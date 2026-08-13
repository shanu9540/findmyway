# RentEase - Premium Appliance & Furniture Rental Platform
## Detailed Project Report & Technical Documentation

---

## 1. Project Overview
**RentEase** is a modern, premium web-based rental marketplace designed to allow users to rent high-quality furniture (Sofas, Beds, Tables, Chairs) and home appliances (Smart TVs, Refrigerators, Microwave Ovens, Washing Machines, Vacuum Cleaners) on a flexible monthly basis. The application is built using a custom glassmorphic dark-theme user interface, providing a smooth, premium consumer experience.

---

## 2. System Architecture & Tech Stack
The application is structured as a full-stack JavaScript application with a decoupled frontend and backend. It features a robust offline fallback mode that allows it to operate as a standalone client-side application using browser `localStorage` if the backend server is unreachable.

### Frontend Technologies:
* **Core**: React.js 18 (Vite Build Tool)
* **Styling**: Premium Custom Vanilla CSS (Dark glassmorphic styling, responsive grid layouts, custom pulsing skeleton loaders, CSS Keyframe animations)
* **Icons**: Lucide-React (Vector-based crisp iconography)
* **State Management**: React State Hooks (`useState`, `useEffect`, `useMemo`) backed by local database sync triggers.

### Backend Technologies:
* **Runtime**: Node.js & Express.js server on Port 5000.
* **Database Layer**: Dual-mode MongoDB integration with automated catch fallbacks to a JSON flat-file database (`backend/database.json`).

---

## 3. Key System Features & Implementation

### 3.1. Unified Catalog & Real-time Search
* **Case-Insensitive Search**: Multi-field querying that filters items dynamically across product name, category, description, and location tags.
* **Complex Multi-attribute Sorting**: Allows consumers to sort items dynamically by Popularity (number of customer reviews), Price: Low to High, Price: High to Low, Rating, and Newest uploads.
* **Advanced Skeletons**: Displays 8 pulsing placeholder skeleton cards during network fetches to maintain visual interest.

### 3.2. Secure Multi-gateway Checkout
* **Quick Rent Button ("+ Rent Now")**: Direct catalog actions bypass detail navigation pages to expedite checkouts with 12-month default tenures.
* **Four Dedicated Payment Gateways**:
  1. **Credit / Debit Cards**: Secure form fields for Cardholder Name, Card Number, Expiry, and CVV.
  2. **BHIM UPI**: Supports direct UPI ID input fields and displays a scan-compatible QR Code simulation.
  3. **Net Banking**: Seamless dropdown selections for major Indian banks (SBI, HDFC, ICICI, Axis).
  4. **Digital Wallets**: Quick wallet simulations for Paytm, PhonePe, and Amazon Pay.

### 3.3. Dual-Mode Authentication & Authorization
Supports three role layers:
1. **User (Consumer)**: Browse items, manage cart, checkout, view logistics timeline of rented items.
2. **Vendor**: Monitor product catalogs, check stocks, add new items, and view store statistics.
3. **Admin**: Platform statistics, active rentals tracker, system maintenance requests, and user logs.

### 3.4. Active Logistics & Maintenance Timelines
* **Logistics Timeline**: Live progress visualizer tracking orders through:
  * Order Confirmed
  * Quality Check passed
  * Out for Delivery
  * Installed & Verified
* **Maintenance Request system**: Customers can log requests directly from their dashboard for technician visits.

---

## 4. Seed Database Specifications (13 Premium Products)
The local and backend databases are pre-loaded with 13 highly realistic home inventory products featuring closeup images:

| ID | Product Name | Category | Subcategory | Base Rent | Location |
|---|---|---|---|---|---|
| prd_1 | Modern 3-Seater Fabric Sofa | Furniture | Sofa | ₹749 / mo | New Delhi |
| prd_2 | Premium L-Shaped Sectional Sofa | Furniture | Sofa | ₹1499 / mo | Mumbai |
| prd_3 | King Size Bed with Storage | Furniture | Bed | ₹999 / mo | New Delhi |
| prd_4 | Queen Size Premium Bed | Furniture | Bed | ₹799 / mo | Bengaluru |
| prd_5 | Ergonomic Office Study Table | Furniture | Table | ₹349 / mo | Noida |
| prd_6 | High Back Ergonomic Gaming Chair | Furniture | Chair | ₹299 / mo | Gurugram |
| prd_7 | 55" Ultra HD 4K Smart LED TV | Appliances | TV | ₹1199 / mo | New Delhi |
| prd_8 | 43" Full HD Smart Android TV | Appliances | TV | ₹799 / mo | Mumbai |
| prd_9 | Double Door Refrigerator (350L) | Appliances | Refrigerator | ₹1299 / mo | New Delhi |
| prd_10| Single Door Refrigerator (190L) | Appliances | Refrigerator | ₹699 / mo | Pune |
| prd_11| 30L Convection Smart Microwave | Appliances | Microwave | ₹449 / mo | Noida |
| prd_12| Fully Automatic Washing Machine | Appliances | Washing Machine| ₹999 / mo | Bengaluru |
| prd_13| Dyson Style Cordless Vacuum | Appliances | Vacuum Cleaner| ₹599 / mo | New Delhi |

---

## 5. Offline Resiliency & Image Fallback Architecture
1. **API Fallback Detection**: If connection to the Express API backend fails, the React app transitions into offline local database mode (`isUsingLiveBackend: false`) and loads the mock products list from browser `localStorage` namespaces.
2. **Broken Image Mitigation**: Integrated an `onError` React hook into every `ProductCard` component. If a CDN link is broken:
   - It first attempts to load secondary product media configurations.
   - If that also fails, it returns a high-resolution generic category backup image (mapped by category key).
   - This prevents broken image icons on the consumer interface.
