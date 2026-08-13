import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'vendor', 'admin'] },
  service_area: { type: String, default: 'New Delhi' }
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['furniture', 'appliances'] },
  subcategory: { type: String, default: '' },
  description: { type: String, default: '' },
  image_url: { type: String, default: '' },
  monthly_rent: { type: Number, required: true },
  security_deposit: { type: Number, required: true },
  stock: { type: Number, default: 1 },
  created_by: { type: String, default: 'vnd_1' }
});

const RentalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  product_id: { type: String, required: true },
  product_name: { type: String, required: true },
  product_image: { type: String, default: '' },
  monthly_rent: { type: Number, required: true },
  security_deposit: { type: Number, required: true },
  tenure_months: { type: Number, default: 3 },
  delivery_date: { type: String, required: true },
  delivery_time_slot: { type: String, default: '10:00 AM - 02:00 PM' },
  delivery_address: { type: String, required: true },
  status: { type: String, default: 'scheduled', enum: ['scheduled', 'active', 'return_pending', 'returned'] },
  damage_claim_amount: { type: Number, default: 0 },
  damage_claim_reason: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

const MaintenanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rental_id: { type: String, required: true },
  user_id: { type: String, required: true },
  product_name: { type: String, required: true },
  issue_type: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, default: 'pending', enum: ['pending', 'assigned', 'resolved'] },
  scheduled_date: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const ServiceAreaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Rental = mongoose.models.Rental || mongoose.model('Rental', RentalSchema);
export const Maintenance = mongoose.models.Maintenance || mongoose.model('Maintenance', MaintenanceSchema);
export const ServiceArea = mongoose.models.ServiceArea || mongoose.model('ServiceArea', ServiceAreaSchema);
