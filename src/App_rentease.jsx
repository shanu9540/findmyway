import { useState, useEffect } from 'react';
import Navbar from './components/Navbar_rentease';
import Catalog from './components/Catalog';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import UserDashboard from './components/UserDashboard';
import VendorDashboard from './components/VendorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App_rentease({ onBackToPortfolio }) {
  const [activeView, setActiveView] = useState('login');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('rentease_cart')) || [];
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('rentease_user')) || null;
  });
  const [rentals, setRentals] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [serviceAreas, setServiceAreas] = useState(['New Delhi', 'Noida', 'Gurugram', 'Mumbai', 'Bengaluru']);
  const [isUsingLiveBackend, setIsUsingLiveBackend] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Stats for Vendor/Admin
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalRentals: 0,
    activeRentalsCount: 0,
    totalRevenue: 0,
    monthlyRecurringRevenue: 0,
    categoryDistribution: {},
    rentalStatuses: {},
    pendingMaintenance: 0,
    serviceAreasCount: 0
  });

  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  // Fetch initial data
  const loadAllData = async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const pRes = await fetch(`${API_BASE}/products`);
      if (!pRes.ok) throw new Error('Could not fetch products');
      setProducts(await pRes.json());
      
      const sRes = await fetch(`${API_BASE}/service-areas`);
      if (sRes.ok) {
        const sData = await sRes.json();
        setServiceAreas(sData.map(a => a.name || a));
      }
      
      fetchRentalsList();
      fetchMaintenanceList();
      setIsLoadingProducts(false);
    } catch (err) {
      console.warn('Backend server not running. Falling back to local offline mode.', err);
      setIsUsingLiveBackend(false);
      try {
        loadOfflineMockData();
      } catch (mockErr) {
        setProductsError('Failed to load products database.');
      }
      setIsLoadingProducts(false);
    }
  };

  // Offline mock fallback data setup
  const loadOfflineMockData = () => {
    // Check if the mock DB has outdated credentials and force reset if needed
    const existingUsers = localStorage.getItem('mock_db_users');
    if (existingUsers && existingUsers.includes('@flexirent.com')) {
      console.log('Detected outdated FlexiRent credentials. Clearing localStorage mock databases...');
      localStorage.removeItem('mock_db_users');
      localStorage.removeItem('mock_db_products');
      localStorage.removeItem('mock_db_rentals');
      localStorage.removeItem('mock_db_maintenance');
    }

    // Check if we already have local mock databases set up in localStorage
    const existingProducts = localStorage.getItem('mock_db_products');
    let parsedProducts = [];
    try { parsedProducts = JSON.parse(existingProducts) || []; } catch(e){}

    if (!existingProducts || parsedProducts.length < 12 || existingProducts.includes('photo-1600585154340-be6161a56a0c')) {
      console.log('Force updating localStorage products database to 13 items...');
      const initialProducts = [
        {
          id: 'prd_1',
          name: 'Modern 3-Seater Fabric Sofa',
          category: 'furniture',
          subcategory: 'sofa',
          description: 'Comfortable modern sofa suitable for apartments and living rooms. Spill-resistant neutral grey fabric.',
          monthly_rent: 749,
          pricePerMonth: 749,
          security_deposit: 2000,
          rating: 4.7,
          reviews: 128,
          image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'New Delhi',
          stock: 8
        },
        {
          id: 'prd_2',
          name: 'Premium L-Shaped Sectional Sofa',
          category: 'furniture',
          subcategory: 'sofa',
          description: 'Spacious 5-seater sectional sofa with high-resilience foam and premium linen upholstery.',
          monthly_rent: 1499,
          pricePerMonth: 1499,
          security_deposit: 4000,
          rating: 4.8,
          reviews: 96,
          image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Mumbai',
          stock: 5
        },
        {
          id: 'prd_3',
          name: 'King Size Bed with Storage',
          category: 'furniture',
          subcategory: 'bed',
          description: 'Ergonomically designed premium wood king-sized bed with plush headboard support and storage space.',
          monthly_rent: 999,
          pricePerMonth: 999,
          security_deposit: 3000,
          rating: 4.9,
          reviews: 142,
          image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'New Delhi',
          stock: 12
        },
        {
          id: 'prd_4',
          name: 'Queen Size Premium Bed',
          category: 'furniture',
          subcategory: 'bed',
          description: 'Compact and sturdy queen bed crafted from premium engineered wood with comfortable headrest.',
          monthly_rent: 799,
          pricePerMonth: 799,
          security_deposit: 2500,
          rating: 4.6,
          reviews: 110,
          image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Bengaluru',
          stock: 15
        },
        {
          id: 'prd_5',
          name: 'Ergonomic Office Study Table',
          category: 'furniture',
          subcategory: 'table',
          description: 'Spacious height-adjustable office desk with wire management grommets for home office set-ups.',
          monthly_rent: 349,
          pricePerMonth: 349,
          security_deposit: 1000,
          rating: 4.5,
          reviews: 64,
          image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Noida',
          stock: 15
        },
        {
          id: 'prd_6',
          name: 'High Back Ergonomic Gaming Office Chair',
          category: 'furniture',
          subcategory: 'chair',
          description: '3D adjustable armrests, lumbar support pillow, and lockable tilt mechanism for elite comfort.',
          monthly_rent: 299,
          pricePerMonth: 299,
          security_deposit: 900,
          rating: 4.4,
          reviews: 88,
          image_url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Gurugram',
          stock: 10
        },
        {
          id: 'prd_7',
          name: '55" Ultra HD 4K Smart LED TV',
          category: 'appliances',
          subcategory: 'tv',
          description: 'Cinematic visual experience with HDR10+, Dolby Atmos, bezel-less design, and built-in streaming apps.',
          monthly_rent: 1199,
          pricePerMonth: 1199,
          security_deposit: 3500,
          rating: 4.7,
          reviews: 156,
          image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'New Delhi',
          stock: 5
        },
        {
          id: 'prd_8',
          name: '43" Full HD Smart Android TV',
          category: 'appliances',
          subcategory: 'tv',
          description: 'Smart television with voice control, Chromecast built-in, and Dolby Audio sound system.',
          monthly_rent: 799,
          pricePerMonth: 799,
          security_deposit: 2200,
          rating: 4.5,
          reviews: 72,
          image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Mumbai',
          stock: 8
        },
        {
          id: 'prd_9',
          name: 'Double Door Refrigerator (350L)',
          category: 'appliances',
          subcategory: 'refrigerator',
          description: 'Energy-efficient 5-star inverter double door refrigerator with auto-defrost and convertible freezer.',
          monthly_rent: 1299,
          pricePerMonth: 1299,
          security_deposit: 4000,
          rating: 4.8,
          reviews: 118,
          image_url: 'https://images.unsplash.com/photo-1571175432247-5c314053c29b?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1571175432247-5c314053c29b?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'New Delhi',
          stock: 6
        },
        {
          id: 'prd_10',
          name: 'Single Door Refrigerator (190L)',
          category: 'appliances',
          subcategory: 'refrigerator',
          description: 'Compact chiller with quiet operations compressor, adjustable wire shelving, and dedicated door pockets.',
          monthly_rent: 699,
          pricePerMonth: 699,
          security_deposit: 2000,
          rating: 4.6,
          reviews: 84,
          image_url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Pune',
          stock: 12
        },
        {
          id: 'prd_11',
          name: '30L Convection Smart Microwave Oven',
          category: 'appliances',
          subcategory: 'microwave',
          description: 'Multi-stage cooking microwave with auto-cook menus, touch control, and premium ceramic enamel cavity.',
          monthly_rent: 449,
          pricePerMonth: 449,
          security_deposit: 1500,
          rating: 4.5,
          reviews: 52,
          image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Noida',
          stock: 12
        },
        {
          id: 'prd_12',
          name: 'Fully Automatic Washing Machine (8kg)',
          category: 'appliances',
          subcategory: 'washing machine',
          description: 'Front-load washing machine with built-in heater, steam wash cycle, and 1400 RPM spin.',
          monthly_rent: 999,
          pricePerMonth: 999,
          security_deposit: 3000,
          rating: 4.7,
          reviews: 134,
          image_url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'Bengaluru',
          stock: 10
        },
        {
          id: 'prd_13',
          name: 'Dyson Style Cordless Vacuum Cleaner',
          category: 'appliances',
          subcategory: 'vacuum cleaner',
          description: 'High-suction cordless stick vacuum cleaner with 40-minute run time, HEPA filtration, and multiple attachments.',
          monthly_rent: 599,
          pricePerMonth: 599,
          security_deposit: 2000,
          rating: 4.6,
          reviews: 40,
          image_url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
          image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
          available: true,
          location: 'New Delhi',
          stock: 14
        }
      ];
      localStorage.setItem('mock_db_products', JSON.stringify(initialProducts));
    }

    if (!localStorage.getItem('mock_db_rentals')) {
      const initialRentals = [
        {
          id: 'rnt_1',
          user_id: 'usr_1',
          product_id: 'prd_3',
          product_name: 'King Size Bed with Storage',
          product_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          monthly_rent: 999,
          security_deposit: 3000,
          tenure_months: 12,
          delivery_date: '2026-07-29',
          delivery_time_slot: '10:00 AM - 02:00 PM',
          delivery_address: 'Flat 302, Green Park Apartments, New Delhi - 110016',
          status: 'scheduled',
          damage_claim_amount: 0,
          damage_claim_reason: ''
        }
      ];
      localStorage.setItem('mock_db_rentals', JSON.stringify(initialRentals));
    }

    if (!localStorage.getItem('mock_db_maintenance')) {
      const initialMaintenance = [
        {
          id: 'mnt_1',
          rental_id: 'rnt_1',
          user_id: 'usr_1',
          product_name: 'King Size Bed with Storage',
          issue_type: 'Wobbly Headboard / Structural Fix',
          description: 'The headboard joint seems slightly loose and wobbles upon shifting weight. Requires hardware adjustment.',
          status: 'pending',
          scheduled_date: '2026-07-30',
          created_at: '2026-07-27T14:30:00.000Z'
        }
      ];
      localStorage.setItem('mock_db_maintenance', JSON.stringify(initialMaintenance));
    }

    setProducts(JSON.parse(localStorage.getItem('mock_db_products')) || []);
    setUsersList(JSON.parse(localStorage.getItem('mock_db_users')) || []);
    calculateMockStats();
  };

  // Re-calculate mock admin stats offline
  const calculateMockStats = () => {
    const prods = JSON.parse(localStorage.getItem('mock_db_products')) || [];
    const rnts = JSON.parse(localStorage.getItem('mock_db_rentals')) || [];
    const usrs = JSON.parse(localStorage.getItem('mock_db_users')) || [];
    const active = rnts.filter(r => r.status === 'active' || r.status === 'scheduled');
    
    const catDist = {};
    prods.forEach(p => { catDist[p.category] = (catDist[p.category] || 0) + 1; });
    const statuses = {};
    rnts.forEach(r => { statuses[r.status] = (statuses[r.status] || 0) + 1; });

    setDashboardStats({
      totalUsers: usrs.filter(u => u.role === 'user').length,
      totalVendors: usrs.filter(u => u.role === 'vendor').length,
      totalProducts: prods.length,
      totalRentals: rnts.length,
      activeRentalsCount: active.length,
      totalRevenue: active.reduce((sum, r) => sum + (r.monthly_rent * r.tenure_months), 0),
      monthlyRecurringRevenue: active.reduce((sum, r) => sum + r.monthly_rent, 0),
      categoryDistribution: catDist,
      rentalStatuses: statuses,
      pendingMaintenance: 0,
      serviceAreasCount: 5
    });
  };

  const fetchRentalsList = async () => {
    try {
      if (isUsingLiveBackend) {
        const res = await fetch(`${API_BASE}/rentals`);
        if (res.ok) {
          const data = await res.json();
          if (currentUser.role === 'user') {
            setRentals(data.filter(r => r.user_id === currentUser.id));
          } else {
            setRentals(data);
          }
        }
      }
    } catch (e) { console.error(e); }
  };

  const fetchMaintenanceList = async () => {
    try {
      if (isUsingLiveBackend) {
        const res = await fetch(`${API_BASE}/maintenance`);
        if (res.ok) {
          const data = await res.json();
          if (currentUser.role === 'user') {
            setMaintenanceRequests(data.filter(m => m.user_id === currentUser.id));
          } else {
            setMaintenanceRequests(data);
          }
        }
      }
    } catch (e) { console.error(e); }
  };

  const fetchAdminData = async () => {
    try {
      if (isUsingLiveBackend) {
        const statsRes = await fetch(`${API_BASE}/admin/stats`);
        const stats = await statsRes.json();
        setDashboardStats(stats);

        const usersRes = await fetch(`${API_BASE}/admin/users`);
        const users = await usersRes.json();
        setUsersList(users);
      }
    } catch (e) { console.error(e); }
  };

  // Sync data whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (isUsingLiveBackend) {
        fetchRentalsList();
        fetchMaintenanceList();
        if (currentUser.role === 'admin') fetchAdminData();
      } else {
        // Offline Filter/load
        const rnts = JSON.parse(localStorage.getItem('mock_db_rentals')) || [];
        const maints = JSON.parse(localStorage.getItem('mock_db_maintenance')) || [];
        if (currentUser.role === 'user') {
          setRentals(rnts.filter(r => r.user_id === currentUser.id));
          setMaintenanceRequests(maints.filter(m => m.user_id === currentUser.id));
        } else {
          setRentals(rnts);
          setMaintenanceRequests(maints);
        }
        calculateMockStats();
      }
    }
  }, [currentUser, isUsingLiveBackend]);

  const saveSessionInfo = (email, password, name) => {
    const saved = JSON.parse(localStorage.getItem('rentease_saved_sessions')) || [];
    if (!saved.find(s => s.email === email)) {
      saved.push({ email, password, name: name || email.split('@')[0] });
      localStorage.setItem('rentease_saved_sessions', JSON.stringify(saved));
    }
  };

  // Auth Operations
  const handleLogin = async (email, password) => {
    if (isUsingLiveBackend) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        
        saveSessionInfo(email, password, data.user.name);
        
        setCurrentUser(data.user);
        localStorage.setItem('rentease_user', JSON.stringify(data.user));
        
        if (data.user.role === 'vendor') setActiveView('vendor-dashboard');
        else if (data.user.role === 'admin') setActiveView('admin-dashboard');
        else setActiveView('catalog');
      } catch (err) {
        console.warn('Backend login request failed. Attempting offline fallback verification...', err);
        // Fallback offline verification check
        const usrs = JSON.parse(localStorage.getItem('mock_db_users')) || [];
        const user = usrs.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid email or password (checked online & offline).');

        saveSessionInfo(email, password, user.name);

        setCurrentUser(user);
        localStorage.setItem('rentease_user', JSON.stringify(user));
        setIsUsingLiveBackend(false); // Switch client state to offline mode

        if (user.role === 'vendor') setActiveView('vendor-dashboard');
        else if (user.role === 'admin') setActiveView('admin-dashboard');
        else setActiveView('catalog');
      }
    } else {
      // Offline auth check
      const usrs = JSON.parse(localStorage.getItem('mock_db_users')) || [];
      const user = usrs.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid email or password');

      saveSessionInfo(email, password, user.name);

      setCurrentUser(user);
      localStorage.setItem('rentease_user', JSON.stringify(user));
      
      if (user.role === 'vendor') setActiveView('vendor-dashboard');
      else if (user.role === 'admin') setActiveView('admin-dashboard');
      else setActiveView('catalog');
    }
  };

  const handleRegister = async (regData) => {
    if (isUsingLiveBackend) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      saveSessionInfo(regData.email, regData.password, regData.name);
      
      // Auto login
      setCurrentUser(data.user);
      localStorage.setItem('rentease_user', JSON.stringify(data.user));
      
      if (data.user.role === 'vendor') setActiveView('vendor-dashboard');
      else if (data.user.role === 'admin') setActiveView('admin-dashboard');
      else setActiveView('catalog');
    } else {
      // Offline registration
      const usrs = JSON.parse(localStorage.getItem('mock_db_users')) || [];
      const exists = usrs.find(u => u.email === regData.email);
      if (exists) throw new Error('Email already registered');

      const newUser = {
        id: `usr_${Date.now()}`,
        email: regData.email,
        password: regData.password,
        name: regData.name,
        role: regData.role || 'user',
        service_area: regData.service_area || 'New Delhi',
        created_at: new Date().toISOString()
      };
      
      usrs.push(newUser);
      localStorage.setItem('mock_db_users', JSON.stringify(usrs));
      saveSessionInfo(regData.email, regData.password, regData.name);
      
      setCurrentUser(newUser);
      localStorage.setItem('rentease_user', JSON.stringify(newUser));
      
      if (newUser.role === 'vendor') setActiveView('vendor-dashboard');
      else setActiveView('catalog');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rentease_user');
    setCart([]);
    setActiveView('login');
  };

  const handleRoleSwitch = async (role) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, role };
    setCurrentUser(updatedUser);
    localStorage.setItem('rentease_user', JSON.stringify(updatedUser));
    
    if (role === 'user') setActiveView('catalog');
    else if (role === 'vendor') setActiveView('vendor-dashboard');
    else if (role === 'admin') setActiveView('admin-dashboard');

    try {
      if (isUsingLiveBackend) {
        // Call backend to persist role change if testing demo
        await fetch(`${API_BASE}/admin/users/${currentUser.id}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role })
        });
      } else {
        const usrs = JSON.parse(localStorage.getItem('mock_db_users')) || [];
        const idx = usrs.findIndex(u => u.id === currentUser.id);
        if (idx !== -1) {
          usrs[idx].role = role;
          localStorage.setItem('mock_db_users', JSON.stringify(usrs));
          setUsersList(usrs);
        }
      }
    } catch(e) { console.error(e); }
  };

  // Vendor Operations
  const handleAddProduct = async (productData) => {
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        loadAllData();
      } else {
        const prods = JSON.parse(localStorage.getItem('mock_db_products')) || [];
        const newProd = {
          id: `prd_${Date.now()}`,
          ...productData,
          stock: parseInt(productData.stock) || 5
        };
        prods.push(newProd);
        localStorage.setItem('mock_db_products', JSON.stringify(prods));
        setProducts(prods);
        calculateMockStats();
      }
      alert("Product added to catalog.");
    } catch (e) { alert(e.message); }
  };

  const handleAddToCart = (product, tenure, finalMonthlyRent) => {
    const cartCopy = [...cart];
    const existing = cartCopy.find(item => item.id === product.id && item.tenure === tenure);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cartCopy.push({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        security_deposit: product.security_deposit,
        monthly_rent: product.monthly_rent,
        tenure,
        finalMonthlyRent,
        quantity: 1
      });
    }
    setCart(cartCopy);
    localStorage.setItem('rentease_cart', JSON.stringify(cartCopy));
    setActiveView('cart');
  };

  const handleUpdateCartQty = (productId, tenure, qty) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId, tenure);
      return;
    }
    const updated = cart.map(item => 
      (item.id === productId && item.tenure === tenure) ? { ...item, quantity: qty } : item
    );
    setCart(updated);
    localStorage.setItem('rentease_cart', JSON.stringify(updated));
  };

  const handleRemoveCartItem = (productId, tenure) => {
    const filtered = cart.filter(item => !(item.id === productId && item.tenure === tenure));
    setCart(filtered);
    localStorage.setItem('rentease_cart', JSON.stringify(filtered));
  };

  // Order Placement
  const handlePlaceOrder = async (deliveryDetails) => {
    if (cart.length === 0 || !currentUser) return;
    
    try {
      if (isUsingLiveBackend) {
        // Place order for each cart item
        for (const item of cart) {
          await fetch(`${API_BASE}/rentals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: currentUser.id,
              product_id: item.id,
              product_name: item.name,
              product_image: item.image_url,
              monthly_rent: item.finalMonthlyRent,
              security_deposit: item.security_deposit,
              tenure_months: item.tenure,
              delivery_date: deliveryDetails.delivery_date,
              delivery_time_slot: deliveryDetails.delivery_time_slot,
              delivery_address: deliveryDetails.delivery_address
            })
          });
        }
        // Reload products and rentals
        const pRes = await fetch(`${API_BASE}/products`);
        setProducts(await pRes.json());
        fetchRentalsList();
      } else {
        // Offline Order Placement
        const rnts = JSON.parse(localStorage.getItem('mock_db_rentals')) || [];
        const prods = JSON.parse(localStorage.getItem('mock_db_products')) || [];

        cart.forEach(item => {
          // Decrement mock stock
          const pIdx = prods.findIndex(p => p.id === item.id);
          if (pIdx !== -1 && prods[pIdx].stock > 0) {
            prods[pIdx].stock -= 1;
          }

          rnts.push({
            id: `rnt_${Date.now()}_${Math.floor(Math.random()*1000)}`,
            user_id: currentUser.id,
            product_id: item.id,
            product_name: item.name,
            product_image: item.image_url,
            monthly_rent: item.finalMonthlyRent,
            security_deposit: item.security_deposit,
            tenure_months: item.tenure,
            delivery_date: deliveryDetails.delivery_date,
            delivery_time_slot: deliveryDetails.delivery_time_slot,
            delivery_address: deliveryDetails.delivery_address,
            status: 'scheduled',
            created_at: new Date().toISOString(),
            damage_claim_amount: 0,
            damage_claim_reason: ''
          });
        });

        localStorage.setItem('mock_db_rentals', JSON.stringify(rnts));
        localStorage.setItem('mock_db_products', JSON.stringify(prods));
        setProducts(prods);
        setRentals(rnts.filter(r => r.user_id === currentUser.id));
        calculateMockStats();
      }

      // Clear Cart
      setCart([]);
      localStorage.removeItem('rentease_cart');
      setActiveView('user-dashboard');
    } catch (err) {
      alert("Failed to checkout: " + err.message);
    }
  };



  // Maintenance Tickets
  const handleCreateMaintenance = async (maintData) => {
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/maintenance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...maintData,
            user_id: currentUser.id
          })
        });
        fetchMaintenanceList();
      } else {
        const maints = JSON.parse(localStorage.getItem('mock_db_maintenance')) || [];
        const newReq = {
          id: `mnt_${Date.now()}`,
          user_id: currentUser.id,
          status: 'pending',
          created_at: new Date().toISOString(),
          ...maintData
        };
        maints.push(newReq);
        localStorage.setItem('mock_db_maintenance', JSON.stringify(maints));
        setMaintenanceRequests(maints.filter(m => m.user_id === currentUser.id));
      }
      alert("Support ticket raised. Technical team has been notified.");
    } catch (e) { alert(e.message); }
  };

  const handleScheduleReturn = async (rentalId) => {
    if (!window.confirm("Are you sure you want to schedule relocation return/pickup for this item?")) return;
    
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/rentals/${rentalId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'return_pending' })
        });
        fetchRentalsList();
      } else {
        const rnts = JSON.parse(localStorage.getItem('mock_db_rentals')) || [];
        const idx = rnts.findIndex(r => r.id === rentalId);
        if (idx !== -1) {
          rnts[idx].status = 'return_pending';
          localStorage.setItem('mock_db_rentals', JSON.stringify(rnts));
          setRentals(rnts.filter(r => r.user_id === currentUser.id));
          calculateMockStats();
        }
      }
      alert("Return scheduled. Our vendor will coordinate the pickup time slot.");
    } catch (e) { alert(e.message); }
  };

  const handleAddServiceArea = async (area) => {
    try {
      if (isUsingLiveBackend) {
        const res = await fetch(`${API_BASE}/service-areas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ area })
        });
        const data = await res.json();
        setServiceAreas(data);
      } else {
        const areas = [...serviceAreas];
        if (!areas.includes(area)) {
          areas.push(area);
          setServiceAreas(areas);
        }
      }
      alert("Delivery coverage expanded to: " + area);
    } catch (e) { alert(e.message); }
  };

  const handleDeleteServiceArea = async (area) => {
    if (!window.confirm(`Stop logistics services in ${area}?`)) return;
    try {
      if (isUsingLiveBackend) {
        const res = await fetch(`${API_BASE}/service-areas/${area}`, { method: 'DELETE' });
        const data = await res.json();
        setServiceAreas(data);
      } else {
        setServiceAreas(serviceAreas.filter(a => a !== area));
      }
      alert("Logistics coverage retracted.");
    } catch (e) { alert(e.message); }
  };

  const handleUpdateProduct = async (prodId, productData) => {
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/products/${prodId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        loadAllData();
      } else {
        const prods = JSON.parse(localStorage.getItem('mock_db_products')) || [];
        const idx = prods.findIndex(p => p.id === prodId);
        if (idx !== -1) {
          prods[idx] = { ...prods[idx], ...productData };
          localStorage.setItem('mock_db_products', JSON.stringify(prods));
          setProducts(prods);
          calculateMockStats();
        }
      }
      alert("Product inventory updated.");
    } catch (e) { alert(e.message); }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("Are you sure you want to delete this product from catalog?")) return;
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/products/${prodId}`, { method: 'DELETE' });
        loadAllData();
      } else {
        const prods = JSON.parse(localStorage.getItem('mock_db_products')) || [];
        const filtered = prods.filter(p => p.id !== prodId);
        localStorage.setItem('mock_db_products', JSON.stringify(filtered));
        setProducts(filtered);
        calculateMockStats();
      }
      alert("Product deleted.");
    } catch (e) { alert(e.message); }
  };

  const handleUpdateRentalStatus = async (rentalId, status, claims = {}) => {
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/rentals/${rentalId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, ...claims })
        });
        loadAllData();
        fetchRentalsList();
      } else {
        const rnts = JSON.parse(localStorage.getItem('mock_db_rentals')) || [];
        const prods = JSON.parse(localStorage.getItem('mock_db_products')) || [];
        const idx = rnts.findIndex(r => r.id === rentalId);
        if (idx !== -1) {
          rnts[idx].status = status;
          if (claims.damage_claim_amount !== undefined) {
            rnts[idx].damage_claim_amount = claims.damage_claim_amount;
          }
          if (claims.damage_claim_reason !== undefined) {
            rnts[idx].damage_claim_reason = claims.damage_claim_reason;
          }

          // Restock product unit if returned
          if (status === 'returned') {
            const pIdx = prods.findIndex(p => p.id === rnts[idx].product_id);
            if (pIdx !== -1) prods[pIdx].stock += 1;
          }

          localStorage.setItem('mock_db_rentals', JSON.stringify(rnts));
          localStorage.setItem('mock_db_products', JSON.stringify(prods));
          setProducts(prods);
          setRentals(rnts);
          calculateMockStats();
        }
      }
      alert("Logistics status updated.");
    } catch (e) { alert(e.message); }
  };

  const handleUpdateMaintenanceStatus = async (reqId, status) => {
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/maintenance/${reqId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        fetchMaintenanceList();
      } else {
        const maints = JSON.parse(localStorage.getItem('mock_db_maintenance')) || [];
        const idx = maints.findIndex(m => m.id === reqId);
        if (idx !== -1) {
          maints[idx].status = status;
          localStorage.setItem('mock_db_maintenance', JSON.stringify(maints));
          setMaintenanceRequests(maints);
        }
      }
      alert("Maintenance ticket status updated.");
    } catch (e) { alert(e.message); }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      if (isUsingLiveBackend) {
        await fetch(`${API_BASE}/admin/users/${userId}/role`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role })
        });
        loadAllData();
      } else {
        const usrs = JSON.parse(localStorage.getItem('mock_db_users')) || [];
        const idx = usrs.findIndex(u => u.id === userId);
        if (idx !== -1) {
          usrs[idx].role = role;
          localStorage.setItem('mock_db_users', JSON.stringify(usrs));
          setUsersList(usrs);
          calculateMockStats();
        }
      }
      alert("User permissions altered.");
    } catch (e) { alert(e.message); }
  };

  if (activeView === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onRegister={handleRegister}
        serviceAreas={serviceAreas}
        onBrowseGuest={() => setActiveView('catalog')}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      {/* Top Brand & User Navbar */}
      <Navbar 
        activeView={activeView} 
        setActiveView={(v) => {
          setActiveView(v);
          setSelectedProduct(null);
        }} 
        cart={cart}
        currentUser={currentUser}
        onLogout={handleLogout}
        onRoleSwitch={handleRoleSwitch}
        onBackToPortfolio={onBackToPortfolio}
      />

      <main className="main-content" style={{ height: 'auto', flexGrow: 1, padding: '2rem' }}>
        {/* Router View Switching */}
        {activeView === 'catalog' && !selectedProduct && (
          <Catalog 
            products={products} 
            isLoading={isLoadingProducts}
            error={productsError}
            onRetry={loadAllData}
            onViewDetails={(p) => {
              setSelectedProduct(p);
              setActiveView('product-details');
            }} 
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'product-details' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct} 
            onAddToCart={handleAddToCart}
            onBackToCatalog={() => {
              setSelectedProduct(null);
              setActiveView('catalog');
            }}
          />
        )}

        {activeView === 'cart' && (
          <Cart 
            cart={cart}
            serviceAreas={serviceAreas}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeView === 'user-dashboard' && currentUser && (
          <UserDashboard 
            rentals={rentals}
            maintenanceRequests={maintenanceRequests}
            onCreateMaintenance={handleCreateMaintenance}
            onScheduleReturn={handleScheduleReturn}
            currentUser={currentUser}
          />
        )}
        {activeView === 'vendor-dashboard' && currentUser && (
          <VendorDashboard 
            products={products}
            rentals={rentals}
            maintenanceRequests={maintenanceRequests}
            onAddProduct={handleAddProduct}
            onEditProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateRentalStatus={handleUpdateRentalStatus}
            onUpdateMaintenanceStatus={handleUpdateMaintenanceStatus}
          />
        )}

        {activeView === 'admin-dashboard' && currentUser && (
          <AdminDashboard 
            users={usersList}
            rentals={rentals}
            serviceAreas={serviceAreas}
            adminStats={dashboardStats}
            onUpdateUserRole={handleUpdateUserRole}
            onAddServiceArea={handleAddServiceArea}
            onDeleteServiceArea={handleDeleteServiceArea}
          />
        )}
      </main>

      {/* Connection Mode indicator in page footer */}
      <footer style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 0 0 0',
        borderTop: '1px solid var(--border-glass)',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
      }}>
        <span>&copy; 2026 RentEase Inc. All rights reserved.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isUsingLiveBackend ? 'var(--color-steps)' : 'var(--color-sleep)',
            boxShadow: isUsingLiveBackend ? '0 0 8px var(--color-steps)' : '0 0 8px var(--color-sleep)'
          }}></div>
          <span>Mode: {isUsingLiveBackend ? 'Live Node.js API Database' : 'Stand-alone Offline Database'}</span>
        </div>
      </footer>
    </div>
  );
}

export default App_rentease;
