import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { User, Product, Rental, Maintenance, ServiceArea } from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.json');
const seedPath = path.join(__dirname, 'data', 'seed.json');

let useMongo = false;

// Connect to MongoDB
export async function connectMongo(uri = 'mongodb://localhost:27017/rentease') {
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    // Connect with a 3-second timeout so it fails quickly if local MongoDB isn't running
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    useMongo = true;
    console.log('✓ Successfully connected to MongoDB!');
    
    // Seed MongoDB if empty
    await seedMongoIfEmpty();
    return true;
  } catch (error) {
    console.warn('✗ MongoDB connection failed. Falling back to local JSON database.', error.message);
    useMongo = false;
    initJsonDb();
    return false;
  }
}

// Seed MongoDB collections from seed.json if they are empty
async function seedMongoIfEmpty() {
  try {
    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      console.log('MongoDB collections are empty. Seeding initial data from seed.json...');
      const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

      // Seed Users
      if (seedData.users && seedData.users.length > 0) {
        await User.insertMany(seedData.users);
        console.log(`- Seeded ${seedData.users.length} users into MongoDB.`);
      }

      // Seed Products
      if (seedData.products && seedData.products.length > 0) {
        await Product.insertMany(seedData.products);
        console.log(`- Seeded ${seedData.products.length} products into MongoDB.`);
      }

      // Seed Rentals
      if (seedData.rentals && seedData.rentals.length > 0) {
        await Rental.insertMany(seedData.rentals);
        console.log(`- Seeded ${seedData.rentals.length} rentals into MongoDB.`);
      }

      // Seed Maintenance
      if (seedData.maintenance_requests && seedData.maintenance_requests.length > 0) {
        // Map field names
        const mappedMaint = seedData.maintenance_requests.map(m => ({
          id: m.id,
          rental_id: m.rental_id,
          user_id: m.user_id,
          product_name: m.product_name,
          issue_type: m.issue_type,
          description: m.description,
          status: m.status,
          scheduled_date: m.scheduled_date
        }));
        await Maintenance.insertMany(mappedMaint);
        console.log(`- Seeded ${mappedMaint.length} maintenance requests into MongoDB.`);
      }

      // Seed Service Areas
      if (seedData.service_areas && seedData.service_areas.length > 0) {
        const mappedAreas = seedData.service_areas.map(name => ({ name }));
        await ServiceArea.insertMany(mappedAreas);
        console.log(`- Seeded ${mappedAreas.length} service areas into MongoDB.`);
      }
      
      console.log('✓ Seeding completed successfully!');
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}

// Ensure JSON file database exists
function initJsonDb() {
  if (!fs.existsSync(dbPath)) {
    console.log('JSON database file not found. Seeding database.json...');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    fs.writeFileSync(dbPath, seedData, 'utf8');
  }
}

// Read database
function readJsonDb() {
  initJsonDb();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// Write database
function writeJsonDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export const db = {
  // Users CRUD
  getUsers: async () => {
    if (useMongo) {
      return await User.find({}).lean();
    }
    const data = readJsonDb();
    return data.users;
  },
  
  getUserById: async (id) => {
    if (useMongo) {
      return await User.findOne({ id }).lean();
    }
    const data = readJsonDb();
    return data.users.find(u => u.id === id);
  },

  getUserByEmail: async (email) => {
    if (useMongo) {
      return await User.findOne({ email }).lean();
    }
    const data = readJsonDb();
    return data.users.find(u => u.email === email);
  },

  createUser: async (user) => {
    const newId = `usr_${Date.now()}`;
    if (useMongo) {
      const newUser = new User({ id: newId, ...user });
      await newUser.save();
      return newUser.toObject();
    }
    const data = readJsonDb();
    const newUser = { id: newId, ...user };
    data.users.push(newUser);
    writeJsonDb(data);
    return newUser;
  },

  updateUserRole: async (id, role) => {
    if (useMongo) {
      return await User.findOneAndUpdate({ id }, { role }, { new: true }).lean();
    }
    const data = readJsonDb();
    const userIndex = data.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      data.users[userIndex].role = role;
      writeJsonDb(data);
      return data.users[userIndex];
    }
    return null;
  },

  // Products CRUD
  getProducts: async () => {
    if (useMongo) {
      return await Product.find({}).lean();
    }
    const data = readJsonDb();
    return data.products;
  },

  getProductById: async (id) => {
    if (useMongo) {
      return await Product.findOne({ id }).lean();
    }
    const data = readJsonDb();
    return data.products.find(p => p.id === id);
  },

  createProduct: async (product) => {
    const newId = `prd_${Date.now()}`;
    if (useMongo) {
      const newProduct = new Product({ id: newId, ...product });
      await newProduct.save();
      return newProduct.toObject();
    }
    const data = readJsonDb();
    const newProduct = { id: newId, ...product };
    data.products.push(newProduct);
    writeJsonDb(data);
    return newProduct;
  },

  updateProduct: async (id, updatedProduct) => {
    if (useMongo) {
      return await Product.findOneAndUpdate({ id }, updatedProduct, { new: true }).lean();
    }
    const data = readJsonDb();
    const index = data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      data.products[index] = { ...data.products[index], ...updatedProduct };
      writeJsonDb(data);
      return data.products[index];
    }
    return null;
  },

  deleteProduct: async (id) => {
    if (useMongo) {
      const result = await Product.deleteOne({ id });
      return result.deletedCount > 0;
    }
    const data = readJsonDb();
    const filteredProducts = data.products.filter(p => p.id !== id);
    if (data.products.length !== filteredProducts.length) {
      data.products = filteredProducts;
      writeJsonDb(data);
      return true;
    }
    return false;
  },

  // Rentals CRUD
  getRentals: async () => {
    if (useMongo) {
      return await Rental.find({}).lean();
    }
    const data = readJsonDb();
    return data.rentals;
  },

  getRentalsByUser: async (userId) => {
    if (useMongo) {
      return await Rental.find({ user_id: userId }).lean();
    }
    const data = readJsonDb();
    return data.rentals.filter(r => r.user_id === userId);
  },

  createRental: async (rental) => {
    const newId = `rnt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    if (useMongo) {
      // Decrement stock if available
      const product = await Product.findOne({ id: rental.product_id });
      if (product) {
        if (product.stock <= 0) throw new Error('Product out of stock');
        product.stock -= 1;
        await product.save();
      }

      const newRental = new Rental({ id: newId, ...rental });
      await newRental.save();
      return newRental.toObject();
    }

    const data = readJsonDb();
    const product = data.products.find(p => p.id === rental.product_id);
    if (product) {
      if (product.stock <= 0) throw new Error('Product out of stock');
      product.stock -= 1;
    }

    const newRental = {
      id: newId,
      created_at: new Date().toISOString(),
      damage_claim_amount: 0,
      damage_claim_reason: "",
      ...rental
    };
    data.rentals.push(newRental);
    writeJsonDb(data);
    return newRental;
  },

  updateRentalStatus: async (id, status, claims = {}) => {
    if (useMongo) {
      const updateData = { status };
      if (claims.damage_claim_amount !== undefined) updateData.damage_claim_amount = claims.damage_claim_amount;
      if (claims.damage_claim_reason !== undefined) updateData.damage_claim_reason = claims.damage_claim_reason;
      
      const updated = await Rental.findOneAndUpdate({ id }, updateData, { new: true }).lean();
      
      // Restock if returned
      if (status === 'returned' && updated) {
        const product = await Product.findOne({ id: updated.product_id });
        if (product) {
          product.stock += 1;
          await product.save();
        }
      }
      return updated;
    }

    const data = readJsonDb();
    const index = data.rentals.findIndex(r => r.id === id);
    if (index !== -1) {
      data.rentals[index].status = status;
      if (claims.damage_claim_amount !== undefined) {
        data.rentals[index].damage_claim_amount = claims.damage_claim_amount;
      }
      if (claims.damage_claim_reason !== undefined) {
        data.rentals[index].damage_claim_reason = claims.damage_claim_reason;
      }
      
      if (status === 'returned') {
        const product = data.products.find(p => p.id === data.rentals[index].product_id);
        if (product) product.stock += 1;
      }

      writeJsonDb(data);
      return data.rentals[index];
    }
    return null;
  },

  // Maintenance Requests
  getMaintenanceRequests: async () => {
    if (useMongo) {
      return await Maintenance.find({}).lean();
    }
    const data = readJsonDb();
    return data.maintenance_requests;
  },

  getMaintenanceByUser: async (userId) => {
    if (useMongo) {
      return await Maintenance.find({ user_id: userId }).lean();
    }
    const data = readJsonDb();
    return data.maintenance_requests.filter(m => m.user_id === userId);
  },

  createMaintenanceRequest: async (req) => {
    const newId = `mnt_${Date.now()}`;
    if (useMongo) {
      const newReq = new Maintenance({ id: newId, ...req });
      await newReq.save();
      return newReq.toObject();
    }
    const data = readJsonDb();
    const newReq = {
      id: newId,
      created_at: new Date().toISOString(),
      status: 'pending',
      ...req
    };
    data.maintenance_requests.push(newReq);
    writeJsonDb(data);
    return newReq;
  },

  updateMaintenanceStatus: async (id, status) => {
    if (useMongo) {
      return await Maintenance.findOneAndUpdate({ id }, { status }, { new: true }).lean();
    }
    const data = readJsonDb();
    const index = data.maintenance_requests.findIndex(m => m.id === id);
    if (index !== -1) {
      data.maintenance_requests[index].status = status;
      writeJsonDb(data);
      return data.maintenance_requests[index];
    }
    return null;
  },

  // Service Areas
  getServiceAreas: async () => {
    if (useMongo) {
      const list = await ServiceArea.find({}).lean();
      return list.map(a => a.name);
    }
    const data = readJsonDb();
    return data.service_areas;
  },

  addServiceArea: async (area) => {
    if (useMongo) {
      try {
        const newArea = new ServiceArea({ name: area });
        await newArea.save();
      } catch {
        // Area already exists
      }
      const list = await ServiceArea.find({}).lean();
      return list.map(a => a.name);
    }
    const data = readJsonDb();
    if (!data.service_areas.includes(area)) {
      data.service_areas.push(area);
      writeJsonDb(data);
    }
    return data.service_areas;
  },

  deleteServiceArea: async (area) => {
    if (useMongo) {
      await ServiceArea.deleteOne({ name: area });
      const list = await ServiceArea.find({}).lean();
      return list.map(a => a.name);
    }
    const data = readJsonDb();
    data.service_areas = data.service_areas.filter(a => a !== area);
    writeJsonDb(data);
    return data.service_areas;
  },

  // Analytics
  getStats: async () => {
    if (useMongo) {
      const usersCount = await User.countDocuments({ role: 'user' });
      const vendorsCount = await User.countDocuments({ role: 'vendor' });
      const productsCount = await Product.countDocuments({});
      const rentalsCount = await Rental.countDocuments({});
      const serviceAreasCount = await ServiceArea.countDocuments({});

      const activeRentals = await Rental.find({ status: { $in: ['active', 'scheduled'] } }).lean();
      const allRentals = await Rental.find({}).lean();
      
      const totalRevenue = allRentals.reduce((sum, r) => sum + (r.monthly_rent * (r.tenure_months || 1)), 0);
      const monthlyRecurringRevenue = activeRentals.reduce((sum, r) => sum + r.monthly_rent, 0);

      const categoryDistribution = {};
      const prods = await Product.find({}).lean();
      prods.forEach(p => {
        categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
      });

      const rentalStatuses = {};
      allRentals.forEach(r => {
        rentalStatuses[r.status] = (rentalStatuses[r.status] || 0) + 1;
      });

      const pendingMaintenance = await Maintenance.countDocuments({ status: 'pending' });

      return {
        totalUsers: usersCount,
        totalVendors: vendorsCount,
        totalProducts: productsCount,
        totalRentals: rentalsCount,
        activeRentalsCount: activeRentals.length,
        totalRevenue,
        monthlyRecurringRevenue,
        categoryDistribution,
        rentalStatuses,
        pendingMaintenance,
        serviceAreasCount
      };
    }

    const data = readJsonDb();
    const activeRentals = data.rentals.filter(r => r.status === 'active' || r.status === 'scheduled');
    const totalRevenue = data.rentals.reduce((sum, r) => sum + (r.monthly_rent * (r.tenure_months || 1)), 0);
    const monthlyRecurringRevenue = activeRentals.reduce((sum, r) => sum + r.monthly_rent, 0);
    
    const categoryDistribution = {};
    data.products.forEach(p => {
      categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
    });

    const rentalStatuses = {};
    data.rentals.forEach(r => {
      rentalStatuses[r.status] = (rentalStatuses[r.status] || 0) + 1;
    });

    const pendingMaintenance = data.maintenance_requests.filter(m => m.status === 'pending').length;

    return {
      totalUsers: data.users.filter(u => u.role === 'user').length,
      totalVendors: data.users.filter(u => u.role === 'vendor').length,
      totalProducts: data.products.length,
      totalRentals: data.rentals.length,
      activeRentalsCount: activeRentals.length,
      totalRevenue,
      monthlyRecurringRevenue,
      categoryDistribution,
      rentalStatuses,
      pendingMaintenance,
      serviceAreasCount: data.service_areas.length
    };
  }
};
