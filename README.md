# Shoppio - Modern E-commerce Platform

Shoppio is a premium, full-stack e-commerce application built with speed, scalability, and modern aesthetics in mind. It features a robust administration dashboard, a seamless customer shopping experience, and secure payment integrations.

## 🚀 Features

### Customer Features
- **Modern Shopping Experience**: Responsive UI with high-performance product browsing.
- **Cart & Wishlist Management**: Seamlessly manage products for purchase or later interest.
- **Secure Checkout**: Integrated with Moneybag gateway for safe transactions.
- **Loyalty Rewards**: Earn points (**30%**) on every real-money purchase automatically.
- **Transaction History**: Detailed log of all payments, point earnings, and refunds.
- **Enhanced Order Tracking**: View exact product details, quantities, and status updates.
- **Authentication**: Secure user login and profile management powered by Clerk.

### Admin Features
- **Product Management**: Create, update, and manage inventory with ease.
- **Rich Order Insights**: Detailed view of customer orders with product-level information.
- **Settings & Banners**: Dynamic homepage management via administrative controls.
- **Analytics**: Insightful dashboard for monitoring platform performance.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Moneybag SDK](https://moneybag.com.bd/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)

---

## ⚙️ Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### Step 1: Clone the Repository
```bash
git clone https://github.com/Tahsin005/shoppio
cd shoppio
```

### Step 2: Backend Configuration
1. Navigate to the server directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server` directory and populate it with the following:
   ```env
   # Server
   PORT=5000
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000

   # Database
   MONGO_URI=your_mongodb_connection_string

   # Clerk Auth
   CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key

   # Admin
   ADMIN_EMAILS=your_email@example.com

   # Cloudinary
   CLOUDINARY_URL=your_cloudinary_url

   # Moneybag Payment
   MONEYBAG_API_KEY=your_moneybag_api_key
   MONEYBAG_BASE_URL=https://sandbox.api.moneybag.com.bd/api/v2

   # Redirects
   CLIENT_BASE_URL=http://localhost:5173
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Step 3: Frontend Configuration
1. Navigate to the client directory:
   ```bash
   cd ../client
   npm install
   ```
2. Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BACKEND_URL=http://localhost:5000
   ```
3. Start the client:
   ```bash
   npm run dev
   ```

---

## 📦 Scripts

### Server
- `npm run dev`: Starts the development server with Nodemon and tsx.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm run start`: Runs the compiled production build.

### Client
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code quality checks.
