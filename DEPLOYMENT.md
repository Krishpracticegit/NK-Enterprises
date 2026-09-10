# Production Deployment Guide — NK ENTERPRISES

Complete step-by-step instructions to deploy the NK Enterprises E-Commerce Storefront to **MongoDB Atlas**, **Render (Backend API)**, and **Vercel (Frontend Single Page App)**.

---

## 1. MongoDB Atlas Setup (Cloud Database)

### Step 1: Create a MongoDB Atlas Cluster
1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create a New Project** (e.g., `NK-Enterprises-Prod`).
3. Click **Create a Cluster** and choose the **M0 Free Tier** (Shared).
4. Choose your preferred region (e.g., AWS / Mumbai `ap-south-1` or N. Virginia `us-east-1`).
5. Set cluster name to `nk-enterprises-cluster` and click **Create**.

### Step 2: Configure Database User & Access Controls
1. Go to **Security > Database Access** in the left sidebar.
2. Click **Add New Database User**:
   - Authentication Method: **Password**
   - Username: `nk_admin`
   - Password: Choose a strong password (save this securely)
   - Database User Privileges: `Read and write to any database`
3. Go to **Security > Network Access** in the left sidebar.
4. Click **Add IP Address**:
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Render instances can connect to the database dynamically.
   - Click **Confirm**.

### Step 3: Get Connection String
1. Go to **Database > Clusters** and click **Connect** next to your cluster.
2. Choose **Drivers** (Node.js).
3. Copy the connection string format:
   ```env
   mongodb+srv://nk_admin:<password>@nk-enterprises-cluster.xxxx.mongodb.net/nk_enterprises?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database user password).*

---

## 2. Backend Deployment to Render

### Step 1: Push Repository to GitHub
Ensure your repository is pushed to your GitHub account:
```powershell
git add .
git commit -m "Configure production deployment settings"
git push origin main
```

### Step 2: Create Web Service on Render
1. Sign up or log into [Render](https://render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select the `NK-Enterprises` repository.
4. Fill in the deployment configuration:
   - **Name**: `nk-enterprises-backend`
   - **Region**: Choose closest to your users (e.g., Singapore or Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Configure Environment Variables on Render
Under **Environment Variables** (or **Environment Secrets**), add the following:

| Key | Value Example / Description |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://nk_admin:<password>@nk-enterprises-cluster.xxxx.mongodb.net/nk_enterprises?retryWrites=true&w=majority` |
| `JWT_SECRET` | Strong random string (e.g. `nk_prod_jwt_super_secret_key_2026!`) |
| `FRONTEND_URL` | `https://nk-enterprises.vercel.app` *(Your Vercel URL)* |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxxx` |
| `RAZORPAY_KEY_SECRET` | Your Razorpay API Key Secret |

Click **Create Web Service**. Render will deploy your backend API at `https://nk-enterprises-backend.onrender.com`.

---

## 3. Frontend Deployment to Vercel

### Step 1: Import Project to Vercel
1. Log into [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Select your `NK-Enterprises` GitHub repository and click **Import**.

### Step 2: Configure Project Settings
1. **Framework Preset**: `Vite`
2. **Root Directory**: Click **Edit** and set to `frontend`.
3. Expand **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

### Step 3: Add Environment Variables on Vercel
Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://nk-enterprises-backend.onrender.com/api` |

Click **Deploy**. Vercel will build and host your frontend site at `https://nk-enterprises.vercel.app`.

---

## 4. End-to-End Live Verification Workflow

Once both services are deployed, perform the following verification on the live production site:

### Test Case 1: User Registration & Authentication
1. Open `https://nk-enterprises.vercel.app/register`.
2. Register a new user account with name, email, and password.
3. Verify that registration succeeds, returns a JWT token, and logs you into the storefront with your name displayed in the top navbar.

### Test Case 2: Storefront Browsing & Dynamic Filtering
1. Go to `https://nk-enterprises.vercel.app/products`.
2. Filter by category (e.g. `Nursery & Cribs`) or search for `"Onesie"`.
3. Check browser tab title and open Developer Tools page source to verify dynamic SEO metadata generated via `react-helmet-async`.

### Test Case 3: Cart Management
1. Click on a product card to view `https://nk-enterprises.vercel.app/products/:slug`.
2. Click **Add to Cart**.
3. Verify that the Navbar cart icon count badge updates dynamically.

### Test Case 4: Checkout & Razorpay Test Payment
1. Navigate to `/cart` and click **Proceed to Checkout**.
2. Leave required address fields empty and click **Pay Now** to verify frontend validation error handling.
3. Fill in shipping address details:
   - Address Line 1: `123 Organic Way`
   - City: `Mumbai`
   - State: `Maharashtra`
   - Pincode: `400001`
   - Phone: `9876543210`
4. Select **Razorpay Secure Online Payment** and click **Pay Now**.
5. When the Razorpay checkout modal opens, use standard test card credentials:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry Date**: `12 / 28`
   - **CVV**: `123`
   - **OTP**: `123456` (or click **Success**)
6. Verify that payment succeeds, the cart is cleared, and you are redirected to `/order-confirmation` with your order details.
