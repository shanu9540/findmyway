import express from 'express';
import cors from 'cors';
import { db, connectMongo } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, service_area } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = await db.createUser({
      email,
      password, // In a real app we'd hash, but plain text for easy demo testing
      name,
      role: role || 'user',
      service_area: service_area || 'New Delhi'
    });

    res.status(201).json({ message: 'Registration successful', user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, service_area: newUser.service_area } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await db.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        service_area: user.service_area
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, subcategory, description, image_url, monthly_rent, security_deposit, stock, created_by } = req.body;
    if (!name || !category || !monthly_rent || !security_deposit) {
      return res.status(400).json({ error: 'Missing required product information' });
    }

    const newProduct = await db.createProduct({
      name,
      category,
      subcategory: subcategory || '',
      description: description || '',
      image_url: image_url || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      monthly_rent: Number(monthly_rent),
      security_deposit: Number(security_deposit),
      stock: Number(stock) || 1,
      created_by: created_by || 'vnd_1'
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rentals Endpoints
app.get('/api/rentals', async (req, res) => {
  try {
    const rentals = await db.getRentals();
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rentals/user/:userId', async (req, res) => {
  try {
    const rentals = await db.getRentalsByUser(req.params.userId);
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rentals', async (req, res) => {
  try {
    const { user_id, product_id, product_name, product_image, monthly_rent, security_deposit, tenure_months, delivery_date, delivery_time_slot, delivery_address } = req.body;
    
    if (!user_id || !product_id || !delivery_date || !delivery_address) {
      return res.status(400).json({ error: 'Missing rental creation fields' });
    }

    const newRental = await db.createRental({
      user_id,
      product_id,
      product_name,
      product_image,
      monthly_rent: Number(monthly_rent),
      security_deposit: Number(security_deposit),
      tenure_months: Number(tenure_months) || 3,
      delivery_date,
      delivery_time_slot: delivery_time_slot || '10:00 AM - 02:00 PM',
      delivery_address,
      status: 'scheduled'
    });

    res.status(201).json(newRental);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/rentals/:id/status', async (req, res) => {
  try {
    const { status, damage_claim_amount, damage_claim_reason } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = await db.updateRentalStatus(req.params.id, status, { damage_claim_amount, damage_claim_reason });
    if (!updated) return res.status(404).json({ error: 'Rental not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Maintenance Endpoints
app.get('/api/maintenance', async (req, res) => {
  try {
    const requests = await db.getMaintenanceRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/maintenance/user/:userId', async (req, res) => {
  try {
    const requests = await db.getMaintenanceByUser(req.params.userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  try {
    const { rental_id, user_id, product_name, issue_type, description, scheduled_date } = req.body;
    if (!rental_id || !user_id || !issue_type || !scheduled_date) {
      return res.status(400).json({ error: 'Missing maintenance details' });
    }

    const newReq = await db.createMaintenanceRequest({
      rental_id,
      user_id,
      product_name,
      issue_type,
      description: description || '',
      scheduled_date
    });

    res.status(201).json(newReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/maintenance/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = await db.updateMaintenanceStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Operations
app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });

    const updated = await db.updateUserRole(req.params.id, role);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Service Areas Endpoints
app.get('/api/service-areas', async (req, res) => {
  try {
    const areas = await db.getServiceAreas();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/service-areas', async (req, res) => {
  try {
    const { area } = req.body;
    if (!area) return res.status(400).json({ error: 'Area is required' });
    const areas = await db.addServiceArea(area);
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/service-areas/:area', async (req, res) => {
  try {
    const areas = await db.deleteServiceArea(req.params.area);
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB and then start server
connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
