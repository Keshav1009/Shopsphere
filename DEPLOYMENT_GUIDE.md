 # 🚀 GitHub Pages Deployment Guide
**Project:** E-Commerce Storefront with Predictive Sales Analytics & Collaborative Workspace  
**Paper Code:** BCA-311 (Summer Training Project Report) | **Company:** MNB Soft Solutions Pvt. Ltd.

This project is configured for **direct, zero-friction deployment to GitHub Pages**. Because GitHub Pages is a static hosting platform, the application includes a **client-side in-browser persistence and statistical forecasting engine** (`frontend/src/services/mockData.js`) so that **all features work 100% interactively** without requiring an external backend server.

---

## 🛠️ Deployment Options on GitHub

You can choose either of the two standard GitHub Pages deployment methods:

### Option 1: Automatic Deployment via GitHub Actions (Recommended)
This repository includes a pre-configured workflow at `.github/workflows/deploy.yml`.

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete E-Commerce Storefront project ready for GitHub Pages"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```
2. On GitHub, navigate to your repository:
   - Click **Settings** (top navigation).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Source**, select:  
     👉 **GitHub Actions**
3. That's it! GitHub will automatically trigger the workflow, build the Vite application, and publish it to:  
   `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`

---

### Option 2: Direct `/docs` Folder Deployment (Instant, No Actions Needed)
The project comes pre-compiled with production assets located inside the `/docs` folder.

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: deploy e-commerce storefront"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```
2. On GitHub:
   - Click **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select:  
     👉 **Deploy from a branch**
   - Under **Branch**, select `main` (or `master`) and change the folder from `/ (root)` to:  
     👉 **`/docs`**
   - Click **Save**.
3. In 1–2 minutes, your website will be live!

---

## 💻 Re-building Production Assets Locally

Whenever you make code updates, you can re-build both `frontend/dist` and `docs/` with a single command:

```bash
# Re-build and export to docs/
npm run build:pages
```

---

## 🌟 Live Features Available on GitHub Pages

When deployed to GitHub Pages, the site runs an in-browser database engine (`localStorage` backed):

- **User Accounts Pre-Configured:**
  - **Administrator:** `admin@mnbsolutions.com` / `Admin@123`
  - **Customer:** `user@mnbsolutions.com` / `User@123`
  - **Vendor:** `vendor.priya@mnbsolutions.com` / `Vendor@123`
- **Catalog & Multi-Criteria Search:** Filter by category, price range, ratings, and promotional tags.
- **Cart & Simulated Checkout:** Stock decrements, subtotal/tax calculations, order history, and downloadable tax invoices.
- **Admin Dashboard & Analytics:** Real-time KPI summary, interactive Recharts charts (Category, Region, Monthly trends).
- **Predictive Sales Forecasting:** Real-time Ordinary Least Squares (OLS) regression trendlines and inventory reorder alerts calculated in-browser.
- **Collaboration Hub:** Browse open tasks, post initiatives, and participate in peer-to-peer message threads.

---

## 🔗 Optional: Connecting to an External Live Backend

If you host the Node.js Express backend on Render, Railway, or Heroku:
1. Set the environment variable in `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com/api
   ```
2. Run `npm run build:pages` and push to GitHub.
