# FindMyWay | AI-Powered Travel & Booking Platform

FindMyWay is a full-stack, AI-powered travel website designed to help users discover destinations, generate custom day-by-day itineraries, estimate holiday budgets, chat with a local AI assistant, and book ready-made tour packages.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + TypeScript + Lucide Icons
- **Backend**: Node.js + Express.js + TypeScript + REST APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT Auth, bcrypt password hashing, and simulated Google OAuth
- **AI Integration**: OpenAI GPT-4o-mini (with automated mock fallbacks if no API key is present)
- **Payments**: Stripe Test Mode (with automatic local Mock Gateway fallback)

---

## 📁 Directory Structure

```text
/findmyway
  ├── backend/           # Express + TypeScript REST API
  │   ├── prisma/        # schema.prisma database mappings
  │   ├── src/
  │   │   ├── controllers/  # API business logic handlers
  │   │   ├── middleware/   # JWT verification & Admin roles middleware
  │   │   ├── routes/       # API router endpoints
  │   │   ├── services/     # AI Services (OpenAI calls & fallbacks)
  │   │   └── index.ts      # Server setup & global configurations
  │   └── .env.example
  └── frontend/          # Next.js 14 App Router App
      ├── src/
      │   ├── app/          # Pages & layout paths
      │   ├── components/   # Navbar, Footer, and Floating Chatbot widget
      │   └── context/      # Global Authentication Context
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **PostgreSQL**: A local PostgreSQL instance or Docker container running database

### 1. Database & Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your details:
   - `DATABASE_URL`: Connection string for PostgreSQL (e.g. `postgresql://postgres:postgres@localhost:5432/findmyway?schema=public`)
   - `JWT_SECRET`: A secure key for token signing (e.g. `supersecretjwtkeyforfindmyway123!`)
   - `OPENAI_API_KEY`: *(Optional)* Your OpenAI API key for real AI features. If omitted or left as placeholder, the system runs in **AI Mock Fallback Mode** with realistic results.
   - `STRIPE_SECRET_KEY`: *(Optional)* Your Stripe secret key. If omitted, the site automatically enables a **Mock Payment Gateway** to facilitate end-to-end testing of booking flows.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Run Database Migrations**:
   Ensure your PostgreSQL server is active, then create tables:
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Start the Backend Dev Server**:
   ```bash
   npm run dev
   ```
   The backend API will boot on `http://localhost:5000`.

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Frontend Dev Server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

---

## 🔑 Administrative Roles & Testing

- **Convenience Admin Upgrade**: In development mode, the **first user** to register on the website is automatically granted the `ADMIN` role. 
  1. Go to the Sign Up screen.
  2. Create a new account.
  3. You will immediately have access to the **Admin Panel** link under your profile dropdown in the Navbar.
- **Manage Offerings**: Use the Admin Panel to create **Destinations** (e.g., Paris, Bali) and **Packages** (e.g., Classic Parisian Escape). This populates the database and connects user bookings.
