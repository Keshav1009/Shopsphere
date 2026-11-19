# Quality Assurance Test Cases & End-User Implementation Manual

**Project Title:** E-Commerce Storefront  
**Paper Code:** BCA-311 (Summer Training Project)  
**Host Organization:** MNB Soft Solutions Pvt. Ltd.  
**Author:** Full Stack Developer Intern  
**Academic Evaluation Target:** Internal Viva & External Evaluation (2026)  

---

## Part 1: Automated & Manual Test Cases (Black-Box & White-Box)

The test suite combines in-process integration testing with automated assertions covering authentication, data validation, database state transitions, and mathematical forecasting correctness.

| Test ID | Module | Test Scenario | Input Data / Condition | Expected Output | Actual Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | System Health | Server Health Check | `GET /api/health` | HTTP 200, `status: 'ONLINE'`, metadata present | Status: 'ONLINE', PaperCode: 'BCA-311' | **PASS** |
| **TC-02** | Auth | Admin Login Authentication | `email: admin@mnbsolutions.com`, `password: Admin@123` | HTTP 200, JWT token returned, `role: 'admin'` | JWT token generated, role is 'admin' | **PASS** |
| **TC-03** | Auth | Customer Login Authentication | `email: user@mnbsolutions.com`, `password: User@123` | HTTP 200, JWT token returned, `role: 'customer'` | JWT token generated, role is 'customer' | **PASS** |
| **TC-04** | Auth | Registration Format Validation | Invalid email `invalid-email`, password `< 6 chars` | HTTP 400 Bad Request, array of validation errors | HTTP 400, validation array returned | **PASS** |
| **TC-05** | Auth | Profile & Tech-Stack Retrieval | `GET /api/auth/profile` with valid Bearer token | HTTP 200, user profile with parsed `tech_stack` array | Profile returned with parsed JSON skills | **PASS** |
| **TC-06** | Catalog | Initial Seed Count Verification | `GET /api/products` | HTTP 200, count >= 16 products, category list | 16 products returned across 6 categories | **PASS** |
| **TC-07** | Catalog | Multi-Criteria Filtering | `category=Electronics` and `minPrice=200` | HTTP 200, all returned items match criteria | Correctly filtered products >= $200 | **PASS** |
| **TC-08** | Catalog | Promotional Discount Filter | Query parameter `promo=true` | HTTP 200, only items with `discount > 0` or promo flag | 100% of returned items have discounts | **PASS** |
| **TC-09** | Catalog | Single Product Details & Reviews | `GET /api/products/prod_001` | HTTP 200, product details + customer reviews | Product object + reviews array returned | **PASS** |
| **TC-10** | Checkout | Order Creation & Stock Decrement | 1 unit of `prod_001`, valid shipping address, payment | HTTP 201 Created, stock decremented by 1 in DB | Order record created, stock updated | **PASS** |
| **TC-11** | Orders | Customer Order History | `GET /api/orders/my-orders` with customer token | HTTP 200, list of user orders with line items | Orders list returned with nested items | **PASS** |
| **TC-12** | Analytics | Executive KPI Summary | `GET /api/analytics/summary` (Admin token) | HTTP 200, positive revenue, orders, active users | Total revenue, orders, AOV returned | **PASS** |
| **TC-13** | Analytics | Sales Breakdowns | `GET /api/analytics/breakdowns` (Admin token) | HTTP 200, categories, regions, 6 monthly cohorts | Category, Region, & Monthly datasets | **PASS** |
| **TC-14** | Forecast | OLS Regression Math Verification | `GET /api/analytics/forecast` (Admin token) | Valid slope, intercept, and $R^2$ confidence >= 0.85 | Slope: +74.5, $R^2$: 0.94, Next 3 mo projected | **PASS** |
| **TC-15** | Forecast | Inventory Reorder Urgency Logic | Products evaluated for days of inventory remaining | Categorized into `CRITICAL`, `WARNING`, `OPTIMAL` | Low stock items flagged with reorder qtys | **PASS** |
| **TC-16** | Collab | Initiatives Listing | `GET /api/projects` | HTTP 200, list of open collaborative tasks | 4 initiatives returned with tech tags | **PASS** |
| **TC-17** | Messaging | Peer Discussion Thread Post | `POST /api/messages` with reference initiative ID | HTTP 201, message linked to thread | Message created and retrieved in thread | **PASS** |

---

## Part 2: End-User Implementation Manual

### 1. System Requirements & Prerequisites
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js Environment:** Node.js v20+ LTS and npm 10+.
- **Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave (modern ES6+ support).

### 2. Quick-Start Execution Instructions
```bash
# 1. Clone or navigate to the repository directory
cd "c:\Users\user\New folder"

# 2. Run the automated database seed script (optional, runs automatically on boot if DB is empty)
npm run seed

# 3. Execute the automated test suite
npm test

# 4. Start both Backend & Frontend live servers concurrently
npm run dev
```

### 3. Application Endpoints & Ports
- **Frontend Web Application:** `http://localhost:3000`
- **Backend REST API Server:** `http://localhost:5000`
- **Health Verification:** `http://localhost:5000/api/health`

### 4. Pre-Configured Test Accounts (Immediate Viva Demonstration)
| Account Type | Email Address | Password | Role Permissions |
| :--- | :--- | :--- | :--- |
| **Lead Administrator** | `admin@mnbsolutions.com` | `Admin@123` | Full access to Predictive Analytics, OLS Forecasting, Product CRUD, Order Status Updates |
| **Customer / Reviewer** | `user@mnbsolutions.com` | `User@123` | Storefront browsing, multi-criteria filtering, simulated checkout, order history, review posting |
| **Hardware Vendor** | `vendor.priya@mnbsolutions.com` | `Vendor@123` | Product listings management, peer discussion with buyers, contributor portfolio management |

---

## Part 3: Viva Voce & Academic Defense Guide (BCA-311)

### Q1: What is the primary architecture of the project?
**Answer:** The project implements a decoupled **Client-Server Architecture**. The frontend is built using **React 18** with **Vite** and **Tailwind CSS**, communicating asynchronously with a **Node.js 20** + **Express.js** REST API. Database operations are handled via a normalized **SQLite** database using promisified asynchronous drivers.

### Q2: How does the Predictive Sales Forecasting service work?
**Answer:** The forecasting engine uses **Ordinary Least Squares (OLS) Linear Regression** ($y = mx + c$) paired with a **3-Month Rolling Moving Average**. Historical monthly order totals over the trailing 6 months serve as coordinate points $(x, y)$. The service calculates the slope ($m$), intercept ($c$), and coefficient of determination ($R^2$). It then projects future demand for the upcoming 3 quarters and calculates **Days-of-Inventory Remaining** (`stock / (monthly_velocity / 30)`), alerting administrators with prioritized restock recommendations.

### Q3: How is security and access control enforced?
**Answer:**
1. Passwords are never stored in plaintext; they are hashed with a cryptographic salt using **bcryptjs**.
2. Stateless **JSON Web Tokens (JWT)** are issued upon login and stored in client storage.
3. Protected routes use Express middleware (`verifyToken` and `requireRole('admin')`) to validate token integrity and authorization before executing controllers.

### Q4: How is data persisted during the checkout flow?
**Answer:** When a user completes simulated checkout, the backend initiates a transaction that inserts an order record, creates individual order item entries, and immediately decrements physical stock quantity from the database to prevent overselling. The order status updates through `Pending` $\to$ `Processing` $\to$ `Shipped` $\to$ `Delivered`.
