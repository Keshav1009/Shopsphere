# System Architecture, Database Schema & Engineering Specifications

**Project Title:** E-Commerce Storefront  
**Paper Code:** BCA-311 (Summer Training Project)  
**Host Organization:** MNB Soft Solutions Pvt. Ltd.  
**Role:** Full Stack Developer Intern  
**Academic Year:** 2026  

---

## 1. Executive Architectural Overview

The **MNB E-Commerce Storefront** is engineered on a modular, decoupled **Client-Server Architecture** utilizing a stateless **RESTful API** communication layer. The platform bridges standard consumer storefront transactions with developer collaboration workflows and predictive inventory intelligence.

```
+-----------------------------------------------------------------------------------+
|                            CLIENT TIER (React 18 + Vite)                          |
|  - Modern Tailwind CSS Responsive Layout (Mobile, Tablet, Desktop)               |
|  - Context State Machines: AuthContext (JWT Sessions), CartContext (Persistence)  |
|  - Dynamic Visualization Tier: Recharts (Trend Lines, Donut, Bar Charts)          |
+-----------------------------------------------------------------------------------+
                                        |
                          JSON over HTTPS / RESTful API
                                        |
+-----------------------------------------------------------------------------------+
|                        APPLICATION / SERVER TIER (Node.js 20+)                    |
|  - Express.js HTTP Framework & Routing Gateway                                    |
|  - Request Validation Middleware & Sanitization Pipeline                         |
|  - Centralized Error Interceptor & Real-Time Console Logging                       |
|  - Security Layer: bcryptjs Password Hashing, JWT Role-Based Access Control       |
|  - Intelligence Tier: Ordinary Least Squares (OLS) Regression & Moving Average    |
+-----------------------------------------------------------------------------------+
                                        |
                          Asynchronous Promisified SQL
                                        |
+-----------------------------------------------------------------------------------+
|                           DATABASE TIER (SQLite / Embedded)                       |
|  - Relational Normalized Schema (3NF)                                            |
|  - Indexed Tables: users, products, orders, order_items, projects, messages       |
|  - Automatic Seed & Schema Synchronization Pipeline (npm run seed)               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Text-Based Entity-Relationship Diagram (ERD)

```
        +----------------------------------------+
        |                 USERS                  |
        +----------------------------------------+
        | * id (PK, TEXT)                        |
        |   name (TEXT)                          |
        |   email (UNIQUE, TEXT)                 |
        |   password_hash (TEXT)                 |
        |   role (TEXT: admin/customer/vendor)   |
        |   region (TEXT)                        |
        |   bio (TEXT)                           |
        |   tech_stack (TEXT, JSON Array)        |
        |   portfolio_url (TEXT)                 |
        |   created_at (DATETIME)                |
        +----------------------------------------+
             | 1                   | 1               | 1
             |                     |                 |
             | 0..*                | 0..*            | 0..*
             v                     v                 v
+--------------------------+  +----------------+  +--------------------------+
|         PRODUCTS         |  |    PROJECTS    |  |          ORDERS          |
+--------------------------+  +----------------+  +--------------------------+
| * id (PK, TEXT)          |  | * id (PK)      |  | * id (PK, TEXT)          |
|   title (TEXT)           |  |   title        |  |   user_id (FK -> users)  |
|   description (TEXT)     |  |   description  |  |   total_amount (REAL)    |
|   category (TEXT)        |  |   required_tech|  |   shipping_address (TEXT)|
|   price (REAL)           |  |   status       |  |   region (TEXT)          |
|   discount_percentage(R) |  |   creator_id   |  |   payment_status (TEXT)  |
|   stock_quantity (INT)   |  |   created_at   |  |   order_status (TEXT)    |
|   region_tag (TEXT)      |  +----------------+  |   created_at (DATETIME)  |
|   is_promotional (INT)   |          | 1         +--------------------------+
|   creator_id (FK->users) |          |                        | 1
|   sku (TEXT)             |          v                        v
|   rating (REAL)          |   (referenced)            +---------------------+
|   created_at (DATETIME)  |          ^                |     ORDER_ITEMS     |
+--------------------------+          |                +---------------------+
      | 1           | 1               |                | * id (PK, TEXT)     |
      |             |                 |                |   order_id (FK)     |
      v 0..*        v 0..*            |                |   product_id (FK)   |
+-------------+ +--------------------------+           |   quantity (INT)    |
|   REVIEWS   | |   CONNECTIONS_MESSAGES   |           |   unit_price (REAL) |
+-------------+ +--------------------------+           +---------------------+
| * id (PK)   | | * id (PK, TEXT)          |
|   product_id| |   sender_id (FK -> users)|
|   user_id   | |   receiver_id (FK->users)|
|   rating    | |   reference_id (Prod/Proj|
|   comment   | |   message_text (TEXT)    |
|   timestamp | |   timestamp (DATETIME)   |
+-------------+ +--------------------------+
```

---

## 3. Data Flow Diagrams (DFD)

### 3.1 DFD Level 0 (Context Level Diagram)

```
                       +---------------------------------------+
                       |                                       |
                       |  1. Login Credentials & Registration  |
                       |  2. Catalog Search & Filter Criteria  |
                       |  3. Cart Items & Simulated Payment    |
                       |  4. Peer Messages & Reviews           |
                       v                                       |
+--------------------------+                       +-----------------------+
|                          |                       |                       |
|         CUSTOMER         |                       |       ADMIN /         |
|        / DEVELOPER       |                       |      DEVELOPER        |
|                          |                       |                       |
+--------------------------+                       +-----------------------+
        ^                                                      ^
        |                                                      |
        |  1. JWT Session & Profile Details                    |  1. Real-Time Sales Metrics
        |  2. Filtered Products & Pricing                      |  2. OLS Trend Projection
        |  3. Order Confirmation & Tax Invoice                 |  3. Reorder Alerts & CRUD
        |  4. Discussion Thread Feeds                          |
        |                                                      |
        +--------------------------+---------------------------+
                                   |
                                   v
             +-------------------------------------------+
             |                                           |
             |        MNB E-COMMERCE STOREFRONT          |
             |             SYSTEM (0.0)                  |
             |                                           |
             +-------------------------------------------+
                                   |
                       Asynchronous CRUD Queries
                                   |
                                   v
                      [( SQLite Database Store )]
```

### 3.2 DFD Level 1 (Decomposition of Key Modules)

```
[ User Input ]
     |
     v
+------------------+     Verify Password / JWT     +-------------------+
| 1.0 Auth & User  |------------------------------>|  D1: Users Store  |
| Profile Manager  |<------------------------------+-------------------+
+------------------+     Token & Tech-Stack
     |
     v
+------------------+     Filter by Price/Category  +-------------------+
| 2.0 Product &    |------------------------------>| D2: Products Store|
| Catalog Engine   |<------------------------------+-------------------+
+------------------+     Catalog Records & Stock
     |
     v
+------------------+     Deduct Stock & Record Tx  +-------------------+
| 3.0 Checkout &   |------------------------------>| D3: Orders & Items|
| Order Management |<------------------------------+-------------------+
+------------------+     Invoice & Tracking Info
     |
     v
+------------------+     Thread Discussions        +-------------------+
| 4.0 Peer Collab  |------------------------------>| D4: Projects & Msg|
| & Messaging Hub  |<------------------------------+-------------------+
+------------------+
     |
     v
+------------------+     6-Mo Orders Aggregation   +-------------------+
| 5.0 Predictive   |------------------------------>| D5: Analytics     |
| Sales Forecast   |<------------------------------+ Forecast Cache    |
+------------------+     Regression Slope & Reorder
```

---

## 4. Comprehensive Data Dictionary

### Table 1: `users`
| Field Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | TEXT | No | PRIMARY KEY | Unique user identifier (`usr_xxx`) |
| `name` | TEXT | No | Length >= 2 | Full user/developer legal name |
| `email` | TEXT | No | UNIQUE | Registered email address |
| `password_hash` | TEXT | No | bcrypt | Salted bcrypt hash |
| `role` | TEXT | No | DEFAULT 'customer' | Role: `admin`, `customer`, `vendor` |
| `region` | TEXT | Yes | DEFAULT 'Global' | Geographical fulfillment region |
| `bio` | TEXT | Yes | - | Professional background bio |
| `tech_stack` | TEXT | Yes | DEFAULT '[]' | JSON array of skill strings |
| `portfolio_url` | TEXT | Yes | - | External GitHub / Portfolio link |
| `created_at` | DATETIME | No | CURRENT_TIMESTAMP | Registration audit timestamp |

### Table 2: `products`
| Field Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | TEXT | No | PRIMARY KEY | Unique product ID (`prod_xxx`) |
| `title` | TEXT | No | - | Product commercial title |
| `description` | TEXT | Yes | - | Comprehensive product specification |
| `category` | TEXT | No | - | Developer Hardware, Electronics, etc. |
| `price` | REAL | No | > 0.00 | Base retail price in USD |
| `discount_percentage` | REAL | Yes | DEFAULT 0.00 | Discount percent (0-100) |
| `stock_quantity` | INTEGER | No | DEFAULT 10 | Real-time physical inventory |
| `region_tag` | TEXT | Yes | DEFAULT 'Global' | Regional warehouse tag |
| `is_promotional` | INTEGER | No | DEFAULT 0 | 1 = Featured promotional banner item |
| `image_url` | TEXT | Yes | - | High-resolution image CDN URL |
| `creator_id` | TEXT | Yes | FK -> users(id) | Associated vendor/developer ID |
| `sku` | TEXT | Yes | - | Stock Keeping Unit code |
| `rating` | REAL | No | DEFAULT 5.0 | Aggregated review rating |
| `review_count` | INTEGER | No | DEFAULT 0 | Total submitted reviews |
| `created_at` | DATETIME | No | CURRENT_TIMESTAMP | Timestamp of creation |

### Table 3: `orders`
| Field Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | TEXT | No | PRIMARY KEY | Order reference ID (`ord_xxx`) |
| `user_id` | TEXT | No | FK -> users(id) | Customer identifier |
| `total_amount` | REAL | No | > 0.00 | Total charged amount (incl. tax) |
| `shipping_address` | TEXT | No | - | Complete delivery destination |
| `region` | TEXT | Yes | DEFAULT 'Global' | Destination continent/country |
| `payment_status` | TEXT | No | DEFAULT 'Completed' | Payment authorization status |
| `order_status` | TEXT | No | DEFAULT 'Pending' | Pending, Processing, Shipped, Delivered |
| `created_at` | DATETIME | No | CURRENT_TIMESTAMP | Transaction timestamp |

### Table 4: `order_items`
| Field Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | TEXT | No | PRIMARY KEY | Unique order item ID (`item_xxx`) |
| `order_id` | TEXT | No | FK -> orders(id) | Reference to parent order |
| `product_id` | TEXT | No | FK -> products(id) | Reference to catalog product |
| `quantity` | INTEGER | No | >= 1 | Units purchased |
| `unit_price` | REAL | No | >= 0.00 | Effective unit price at purchase time |

### Table 5: `projects`
| Field Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | TEXT | No | PRIMARY KEY | Initiative identifier (`proj_xxx`) |
| `title` | TEXT | No | - | Initiative / Task title |
| `description` | TEXT | No | - | Detailed requirement description |
| `required_technologies` | TEXT | Yes | DEFAULT '[]' | JSON array of required skills |
| `status` | TEXT | No | DEFAULT 'Open' | Open, In Progress, Completed |
| `creator_id` | TEXT | No | FK -> users(id) | Initiative owner user ID |
| `created_at` | DATETIME | No | CURRENT_TIMESTAMP | Creation timestamp |

### Table 6: `connections_messages`
| Field Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | TEXT | No | PRIMARY KEY | Message identifier (`msg_xxx`) |
| `sender_id` | TEXT | No | FK -> users(id) | Author of message |
| `receiver_id` | TEXT | Yes | FK -> users(id) | Direct recipient (optional) |
| `reference_id` | TEXT | No | - | Product ID or Project ID |
| `message_text` | TEXT | No | Length >= 1 | Content of communication |
| `timestamp` | DATETIME | No | CURRENT_TIMESTAMP | Dispatch timestamp |

### Table 7: `reviews`
| Field Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | TEXT | No | PRIMARY KEY | Review identifier (`rev_xxx`) |
| `product_id` | TEXT | No | FK -> products(id) | Catalog product |
| `user_id` | TEXT | No | FK -> users(id) | Customer author |
| `user_name` | TEXT | No | - | Cached reviewer display name |
| `rating` | INTEGER | No | 1 to 5 | Star score |
| `comment` | TEXT | Yes | - | Detailed text evaluation |
| `created_at` | DATETIME | No | CURRENT_TIMESTAMP | Submission timestamp |

---

## 5. Menu Flow & Application Navigation

```
                       [ Landing Page / Storefront ]
                                     |
    +-------------------+------------+------------+--------------------+
    |                   |                         |                    |
    v                   v                         v                    v
[ Catalog Grid ]    [ Collab Hub ]         [ Order History ]    [ Admin Dashboard ]
    |                   |                         |             (Role: Admin Only)
    +--> Quick View     +--> Post Initiative      +--> Tracker         |
    |    Modal          |    Modal                |    Bar             +--> KPI Cards
    |                   +--> Peer Thread          +--> Printable       +--> OLS Forecast
    +--> Add to Cart         Messages                  Invoice         +--> CRUD Tables
         Drawer                                        Modal                - Products
            |                                                               - Orders
            v                                                               - Users
    [ Simulated Multi-Step Checkout ]
            |
            +--> Step 1: Shipping Destination Address
            +--> Step 2: Payment Simulator (Card / UPI / Net Banking)
            +--> Step 3: Order Confirmation & Live Invoice Generation
```
