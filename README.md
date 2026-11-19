# E-Commerce Storefront

**Summer Training Project (Paper Code: BCA-311)**  
**Internship Role:** Full Stack Developer Intern  
**Host Organization:** MNB Soft Solutions Pvt. Ltd.  
**Academic Year:** 2026  

---

## 🌟 Project Overview

The **E-Commerce Storefront** is a production-grade, full-stack web application developed as part of the Summer Training Internship at **MNB Soft Solutions Pvt. Ltd.** The platform integrates a modern consumer storefront with a **Developer Collaboration Hub**, peer-to-peer technical messaging, and an advanced **Predictive Sales Forecasting & Inventory Intelligence Engine** powered by Ordinary Least Squares (OLS) Linear Regression.

---

## 🚀 Key Functional Modules

### 1. User Authentication & Developer Profile Management
- Full user registration, login, logout, and token session persistence.
- Role-Based Access Control (`admin`, `customer`, `vendor`).
- **Contributor / Seller & Tech-Stack Profile:** Allows developers and vendors to showcase their technical skills (interactive skill tag adder/remover), GitHub/portfolio links, and professional bio.

### 2. Storefront Catalog & Multi-Criteria Filtering
- **Home & Hero Section:** Seasonal promotions, promotional countdown banners, value proposition highlights, and category navigation.
- **Multi-Criteria Filtering Engine:** Filter products dynamically by:
  - Category (Developer Hardware, Electronics, Software Tools, Merch, Accessories, Smart Devices)
  - Price Range slider & Min/Max inputs
  - Minimum Star Rating (4★, 4.5★)
  - Promotional Discounts Only toggle
  - Fulfillment Region (North America, Europe, Asia, Global)
  - Keyword live search across Title, Description, and SKU
- **Product Details Modal:** High-resolution product showcase, SKU specifications, stock status alert (e.g. low-stock warnings), verified customer reviews, and interactive review posting.

### 3. Shopping Cart, Multi-Step Checkout & Tax Invoices
- **Persistent Shopping Cart:** Real-time subtotal, 8% VAT/GST calculation, quantity modification, and item removal.
- **Simulated Multi-Step Checkout:**
  - Step 1: Destination address and region selection.
  - Step 2: Simulated payment gateway (Credit Card, UPI, Net Banking) with instant validation.
  - Step 3: Order confirmation with automated stock decrement.
- **Order Tracking & Printable Invoices:** 4-step visual order tracking bar (`Pending` $\to$ `Processing` $\to$ `Shipped` $\to$ `Delivered`) and official printable/downloadable GST tax invoices with project metadata.

### 4. Collaborative Initiatives & Peer-to-Peer Hub
- Open storefront feature initiatives and custom developer projects.
- Skill tagging (e.g., React, Node.js, Python, Vector DB, Docker).
- Built-in interactive discussion and peer messaging thread on every initiative and catalog listing.

### 5. Sales Analytics & Predictive Forecasting Dashboard (Admin Panel)
- **Executive KPI Cards:** Total Revenue, Total Orders, Average Order Value (AOV), Active Users, Low-Stock Alerts.
- **Descriptive Analytics Charts (Recharts):**
  - Monthly historical revenue trends over 6 trailing months.
  - Category revenue distribution pie chart.
  - Regional sales distribution horizontal bar chart.
  - Promotional discount vs standard catalog sales impact.
- **Predictive Sales Forecasting Module:**
  - Ordinary Least Squares (OLS) Linear Regression ($y = mx + c$) and 3-Month Rolling Moving Average.
  - Near-term 3-month projected revenue, unit volumes, and model confidence score ($R^2$).
  - **Smart Inventory Reorder Intelligence:** Calculates estimated days of inventory remaining (`stock / daily_velocity`) and flags prioritized restock recommendations (`CRITICAL`, `WARNING`, `OPTIMAL`, `OVERSTOCKED`) with 1-click restock actions.
- **Full CRUD Management:**
  - Products CRUD (Create, Read, Update, Delete, Quick Restock).
  - Order Fulfillment status updates.
  - User Directory and tech stack inspection.

---

## 🛠️ Tech Stack & Architecture

- **Architecture:** Modular, Decoupled Client-Server RESTful Architecture.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend:** Node.js v20+, Express.js framework, structured routing, centralized error handler, real-time request logger.
- **Database:** SQLite with promisified asynchronous query handlers and automatic seed synchronization.
- **Security:** JSON Web Tokens (JWT), bcryptjs password hashing, role-based authorization middleware.
- **Testing:** Automated unit and integration test suite via Node.js native test runner (`node --test`).

---

## ⚡ Quick Start & Execution

### 1. Prerequisites
Ensure Node.js (v20+) is available.

### 2. Run Database Seed
```bash
npm run seed
```
*Note: The server also checks on startup and automatically populates the database if empty.*

### 3. Run Automated Unit & Integration Tests
```bash
npm test
```
*Executes all 17 automated tests covering authentication, catalog filtering, checkout, predictive forecasting, and collaboration.*

### 4. Start Live Development Servers
```bash
npm run dev
```
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Populated Credentials (For Viva Evaluation)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mnbsolutions.com` | `Admin@123` | Full access to Admin Panel, Forecasting, CRUD |
| **Customer** | `user@mnbsolutions.com` | `User@123` | Browsing, Filtering, Checkout, Invoices, Reviews |
| **Vendor** | `vendor.priya@mnbsolutions.com` | `Vendor@123` | Product listing creation, Peer discussion |

*(Note: The UI also features 1-Click Demo Login pills for instantaneous evaluation).*

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── data/
│   │   └── ecommerce.db               # SQLite database file
│   ├── src/
│   │   ├── config/                    # Port, JWT secret, DB path config
│   │   ├── controllers/               # Auth, Products, Orders, Projects, Messages, Analytics
│   │   ├── db/                        # Database connection & schema tables
│   │   ├── middleware/                # JWT auth, error handler, request validator, logger
│   │   ├── routes/                    # Express REST route handlers
│   │   └── services/                  # OLS Forecasting & Analytics service
│   ├── tests/
│   │   └── api.test.js                # 17 Automated unit & integration tests
│   ├── package.json
│   ├── seed.js                        # 6-Month historical orders & product seed script
│   └── server.js                      # Express API server entry point
├── frontend/
│   ├── src/
│   │   ├── components/                # Navbar, Hero, ProductCard, Modals, AdminDashboard
│   │   ├── context/                   # AuthContext (JWT) & CartContext (Local storage)
│   │   ├── services/                  # API client fetch wrappers
│   │   ├── App.jsx                    # Root view with multi-criteria filters
│   │   ├── index.css                  # Tailwind styles
│   │   └── main.jsx                   # React DOM entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/                                  # Pre-built static site for GitHub Pages (Deploy from branch /docs)
│   ├── assets/                            # Compiled JS & CSS bundles
│   └── index.html                         # Entry point for GitHub Pages
├── project_docs/                          # Academic Documentation & Technical Specs
│   ├── MNB_Ecommerce_Storefront.postman_collection.json  # Postman v2.1 export
│   ├── SYSTEM_ARCHITECTURE_AND_SCHEMA.md                # ERD, DFD Level 0/1, Data Dictionary
│   └── TEST_CASES_AND_USER_MANUAL.md                    # QA Test Cases & Viva Defense Guide
├── .github/
│   └── workflows/
│       └── deploy.yml                     # Automated GitHub Pages CI/CD Workflow
├── DEPLOYMENT_GUIDE.md                    # Detailed Step-by-Step GitHub Pages Deployment Guide
├── MNB_Ecommerce_Storefront_Project_Report.pdf   # Formal Hardbound Academic Report (214 Pages)
├── MNB_Ecommerce_Storefront_Project_Report.docx  # Editable Word Project Report
├── package.json                           # Root monorepo script coordinator
└── README.md
```

---

## 🌐 Deploying Directly to GitHub Pages

This project is pre-configured for direct, zero-configuration deployment to GitHub Pages.

### Method 1: Automated Deployment via GitHub Actions (Recommended)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete project ready for GitHub Pages"
   git push origin main
   ```
2. In your repository on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
   - GitHub will automatically run `.github/workflows/deploy.yml` and publish your live website!

### Method 2: Direct `/docs` Folder Deployment (Instant)
1. In your repository on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch: `main` (or `master`) and folder: `/docs`.
   - Click **Save**. The website is live in 1–2 minutes!

*Note: On GitHub Pages, the site runs an intelligent in-browser mock database (`frontend/src/services/mockData.js`) so that all authentication, product catalog filtering, cart, simulated checkout, order invoices, admin KPI analytics, and predictive OLS forecasting work 100% interactively without requiring an external backend server!*

---

## 📄 License & Academic Attribution
Developed as an original project for Summer Training (Paper Code: **BCA-311**) at **MNB Soft Solutions Pvt. Ltd.** All rights reserved.
