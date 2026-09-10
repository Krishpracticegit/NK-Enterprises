# 🍼 NK ENTERPRISES — Organic Baby Care E-Commerce

> A full-stack e-commerce web application dedicated to premium, certified organic baby care products, clothing, nursery furniture, and essentials.

🌐 **Live Demo**: [https://nk-enterprises.vercel.app](https://nk-enterprises.vercel.app) *(Placeholder)*

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.12-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3.0-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-29.7-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## ✨ Features

### 🛍️ Customer Experience
- **Product Discovery & Filtering**: Real-time search with debouncing, category filter selection, age-group filters (`0-6m`, `6-12m`, `1-3y`), price range sliders, and sorting options.
- **Product Detail & Customer Reviews**: Multi-image interactive gallery, product specifications, verified customer star ratings, and review submission.
- **Shopping Cart & Wishlist**: Dynamic cart state management, quantity stepper, promo/coupon code validation, and wishlist persistence.
- **Secure Checkout & Razorpay Integration**: Saved shipping addresses, custom delivery address form with validation, Razorpay online gateway integration, and Cash on Delivery (COD) fallback.
- **User Accounts & Order History**: Authentication with JWT tokens, user profile editing, address book management, and order status tracking.
- **SEO & Performance Optimized**: Dynamic titles and meta descriptions per page via `react-helmet-async`, image lazy loading (`loading="lazy"`), and code splitting via `React.lazy` + `Suspense`.

### 🛡️ Admin Control Panel
- **Analytical Dashboard**: Overview of total revenue, total orders placed, product count, and recent transactions.
- **Product Management**: Full CRUD operations for products, image uploading via Cloudinary integration, stock level management, and featured bestsellers toggle.
- **Category Management**: Create and manage categories with automatic URL slug creation.
- **Order Fulfillment**: Review customer orders, inspect payment verification statuses, and update fulfillment progress (`placed` ➔ `packed` ➔ `shipped` ➔ `delivered`).

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Customer / Admin Browser])
    
    subgraph Frontend ["Frontend (Vercel)"]
        Vite[Vite + React 19 SPA]
        Helmet[react-helmet-async SEO]
        Context[Cart & Auth Context]
    end

    subgraph Backend ["Backend API (Render)"]
        Express[Express.js Server]
        JWTAuth[JWT Middleware]
        OrderController[Order & Stock Controller]
    end

    subgraph External ["External Services"]
        Mongo[(MongoDB Atlas)]
        Cloudinary[Cloudinary CDN]
        Razorpay[Razorpay Payment Gateway]
    end

    User -->|HTTPS Requests| Vite
    Vite --> Context
    Context -->|REST API Calls| Express
    Express -->|Authenticate| JWTAuth
    Express -->|Mongoose Queries| Mongo
    Express -->|Image Uploads| Cloudinary
    Express -->|Payment Verification| Razorpay
```

---

## 📸 Screenshots

*(Placeholders for application UI screenshots)*

| Storefront Home Page | Product Listing & Filters |
|---|---|
| ![Home Screenshot](https://via.placeholder.com/600x350?text=Storefront+Home+Page) | ![Listing Screenshot](https://via.placeholder.com/600x350?text=Product+Listing+%26+Filters) |

| Secure Checkout & Payment | Admin Dashboard |
|---|---|
| ![Checkout Screenshot](https://via.placeholder.com/600x350?text=Secure+Checkout+%26+Razorpay) | ![Admin Screenshot](https://via.placeholder.com/600x350?text=Admin+Dashboard+%26+Fulfillment) |

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Local MongoDB instance or MongoDB Atlas URI

### 1. Clone Repository
```bash
git clone https://github.com/SanketManav9620/NK-Enterprises.git
cd NK-Enterprises
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create local environment file
cp .env.example .env
```
Fill in your `.env` variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/nk_enterprises
JWT_SECRET=nk_enterprises_super_secret_jwt_key_2026
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
```
Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install --legacy-peer-deps

# Create local environment file
cp .env.example .env
```
Start frontend server:
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 4. Running Test Suites
- **Backend Tests (Jest + Supertest + mongodb-memory-server)**:
  ```bash
  cd backend
  npm test
  ```
- **Frontend Tests (Vitest + React Testing Library)**:
  ```bash
  cd frontend
  npm test
  ```

---

## 🚀 Future Improvements (What I'd Improve with More Time)

1. **Search Indexing**: Integrate Algolia / Elasticsearch for fuzzy search and instant search recommendations.
2. **Performance Caching**: Add a Redis caching layer for hot product queries and categories to reduce DB hits.
3. **Real-Time Order Tracking**: Implement WebSockets (`Socket.io`) for real-time delivery status updates.
4. **End-to-End Browser Testing**: Add a Playwright test suite for automated cross-browser testing.
5. **Localization & Multi-Currency**: Add internationalization (i18n) and multi-currency support.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
