/**
 * Client-Side In-Browser Mock Database & Statistical Analytics Engine
 * Enables 100% full functionality when deployed statically on GitHub Pages
 * Features LocalStorage persistence, seed products, auth, checkout, and OLS regression forecasting.
 */

const SEED_USERS = [
  {
    id: 'usr_admin01',
    name: 'MNB Admin & Lead Architect',
    email: 'admin@mnbsolutions.com',
    password: 'Admin@123',
    role: 'admin',
    region: 'North America',
    bio: 'Lead Full-Stack Architect & Store Operations Manager at MNB Soft Solutions Pvt. Ltd.',
    tech_stack: ['Node.js', 'React', 'Express', 'SQLite', 'Tailwind CSS', 'Docker', 'REST APIs'],
    portfolio_url: 'https://mnbsoft.com'
  },
  {
    id: 'usr_cust01',
    name: 'Aditya Sharma (BCA Reviewer)',
    email: 'user@mnbsolutions.com',
    password: 'User@123',
    role: 'customer',
    region: 'Asia',
    bio: 'Full Stack Developer Intern & Academic Evaluator for Summer Project BCA-311.',
    tech_stack: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Tailwind CSS'],
    portfolio_url: 'https://github.com/aditya-mnb'
  },
  {
    id: 'usr_vend01',
    name: 'Priya Patel (Hardware Specialist)',
    email: 'vendor.priya@mnbsolutions.com',
    password: 'Vendor@123',
    role: 'vendor',
    region: 'North America',
    bio: 'Hardware systems integrator and supplier of developer workstations and smart gadgets.',
    tech_stack: ['Embedded C', 'IoT', 'Python', 'Hardware Design', 'Raspberry Pi'],
    portfolio_url: 'https://priyapatel.tech'
  }
];

const SEED_PRODUCTS = [
  {
    id: 'prod_001',
    title: 'DevPro RGB Mechanical Keyboard (Hot-Swappable)',
    description: 'Gateron Brown switches, wireless Bluetooth 5.2, Type-C wired, aluminum chassis with PBT dye-sub keycaps optimized for long coding sprints.',
    category: 'Developer Hardware',
    price: 149.99,
    discount_percentage: 15,
    stock_quantity: 24,
    region_tag: 'North America',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-DEV-1001',
    rating: 4.8,
    review_count: 38
  },
  {
    id: 'prod_002',
    title: 'Ultra-Wide 34-Inch Curved Monitor 4K IPS',
    description: '144Hz refresh rate, 99% sRGB color accuracy, 65W USB-C single-cable power delivery for MacBook and dual-window coding layout.',
    category: 'Electronics',
    price: 499.00,
    discount_percentage: 10,
    stock_quantity: 8,
    region_tag: 'Global',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-ELE-1002',
    rating: 4.9,
    review_count: 52
  },
  {
    id: 'prod_003',
    title: 'Ergonomic High-Back Breathable Mesh Task Chair',
    description: 'Dynamic lumbar support, 4D adjustable armrests, 135-degree recline tilt lock, durable BIFMA certified gas lift.',
    category: 'Accessories',
    price: 289.00,
    discount_percentage: 20,
    stock_quantity: 6,
    region_tag: 'Europe',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1580481077194-d4b971a6ea6e?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'MNB Tech Studio',
    sku: 'MNB-ACC-1003',
    rating: 4.7,
    review_count: 27
  },
  {
    id: 'prod_004',
    title: 'MNB Soft Solutions Full-Stack Engineer Heavyweight Hoodie',
    description: '100% organic French terry cotton, embroidered developer terminal logo, double-lined hood, designed for cozy late-night debug sessions.',
    category: 'Merch',
    price: 49.50,
    discount_percentage: 0,
    stock_quantity: 42,
    region_tag: 'Global',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    sku: 'MNB-MER-1004',
    rating: 5.0,
    review_count: 64
  },
  {
    id: 'prod_005',
    title: 'Thunderbolt 4 Multi-Port Developer Docking Station',
    description: 'Dual 4K@60Hz display support, 85W host charging, 2.5Gbps Gigabit Ethernet, SD card reader, 4x USB 3.2 Gen 2 ports.',
    category: 'Developer Hardware',
    price: 189.00,
    discount_percentage: 5,
    stock_quantity: 18,
    region_tag: 'Asia',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1622774161048-863b1bd1a364?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-DEV-1005',
    rating: 4.6,
    review_count: 19
  },
  {
    id: 'prod_006',
    title: 'Smart Ambient Monitor ScreenBar with Auto-Dimming',
    description: 'Zero screen glare, asymmetrical optical design, touch sensor color temperature controls (2700K - 6500K), USB powered.',
    category: 'Smart Devices',
    price: 65.00,
    discount_percentage: 25,
    stock_quantity: 29,
    region_tag: 'Global',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    sku: 'MNB-SMA-1006',
    rating: 4.8,
    review_count: 41
  },
  {
    id: 'prod_007',
    title: 'Active Noise Cancelling Studio Wireless Headphones',
    description: 'Hybrid ANC with 4 beamforming microphones, 40mm graphene drivers, 45-hour battery life, low-latency audio for pairing meetings.',
    category: 'Electronics',
    price: 219.00,
    discount_percentage: 12,
    stock_quantity: 14,
    region_tag: 'North America',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-ELE-1007',
    rating: 4.9,
    review_count: 73
  },
  {
    id: 'prod_008',
    title: 'Docker & Kubernetes Shortcuts XL Precision Desk Pad',
    description: '900x400mm waterproof micro-weave surface with stitched edges, non-slip rubber base, cheat sheet reference printed with UV inks.',
    category: 'Merch',
    price: 29.99,
    discount_percentage: 0,
    stock_quantity: 55,
    region_tag: 'Global',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    sku: 'MNB-MER-1008',
    rating: 4.9,
    review_count: 88
  },
  {
    id: 'prod_009',
    title: 'Raspberry Pi 5 Developer Single Board Computer (8GB)',
    description: 'Quad-core Arm Cortex-A76 @ 2.4GHz, dual 4Kp60 micro-HDMI, PCIe 2.0 interface, ideal for home lab clusters and edge AI inference.',
    category: 'Developer Hardware',
    price: 119.00,
    discount_percentage: 0,
    stock_quantity: 4,
    region_tag: 'Europe',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-DEV-1009',
    rating: 5.0,
    review_count: 31
  },
  {
    id: 'prod_010',
    title: 'API Observability & Security Auditing Suite (Perpetual)',
    description: 'Real-time endpoint tracing, automated OWASP security scans, latency profiling, and exportable compliance reports for microservices.',
    category: 'Software Tools',
    price: 79.00,
    discount_percentage: 30,
    stock_quantity: 999,
    region_tag: 'Global',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    sku: 'MNB-SOF-1010',
    rating: 4.7,
    review_count: 15
  },
  {
    id: 'prod_011',
    title: 'High-Precision Ergonomic Vertical Optical Mouse',
    description: '57-degree natural handshake angle reduces forearm strain and carpal tunnel risk, rechargeable 500mAh battery, silent click switches.',
    category: 'Accessories',
    price: 59.90,
    discount_percentage: 10,
    stock_quantity: 21,
    region_tag: 'Asia',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-ACC-1011',
    rating: 4.6,
    review_count: 24
  },
  {
    id: 'prod_012',
    title: '15-Key Programmable Macro Keypad with OLED Displays',
    description: 'Custom icons per key, one-touch git commits, docker container restart triggers, audio mixer dials, and IDE debug hotkeys.',
    category: 'Developer Hardware',
    price: 139.00,
    discount_percentage: 15,
    stock_quantity: 11,
    region_tag: 'North America',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-DEV-1012',
    rating: 4.8,
    review_count: 36
  },
  {
    id: 'prod_013',
    title: 'Smart Ceramic Temperature-Controlled Coffee Mug',
    description: 'Keeps brew at your exact preferred drinking temperature (120°F - 145°F) for 2.5 hours on battery or all day on charging coaster.',
    category: 'Smart Devices',
    price: 89.00,
    discount_percentage: 0,
    stock_quantity: 17,
    region_tag: 'Global',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    sku: 'MNB-SMA-1013',
    rating: 4.5,
    review_count: 18
  },
  {
    id: 'prod_014',
    title: 'Distributed Systems & Database Internals Architectural Poster',
    description: 'Museum-grade 24x36 inch matte print depicting consensus algorithms (Raft/Paxos), B-Trees, LSM trees, and caching topologies.',
    category: 'Merch',
    price: 24.99,
    discount_percentage: 0,
    stock_quantity: 48,
    region_tag: 'Global',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    sku: 'MNB-MER-1014',
    rating: 4.9,
    review_count: 49
  },
  {
    id: 'prod_015',
    title: 'Full-Stack Performance Profiler & Memory Leak Tracer',
    description: 'Zero-overhead continuous profiling agent for Node.js, V8 heap visualizer, GC pause detection, and automated optimization tips.',
    category: 'Software Tools',
    price: 129.00,
    discount_percentage: 20,
    stock_quantity: 999,
    region_tag: 'Global',
    is_promotional: 1,
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    sku: 'MNB-SOF-1015',
    rating: 4.8,
    review_count: 12
  },
  {
    id: 'prod_016',
    title: 'Hardware Cryptographic FIDO2 / U2F Security Key',
    description: 'NFC and USB-C dual interface, tamper-evident casing, protects GitHub, AWS, Google Cloud, and internal developer consoles from phishing.',
    category: 'Developer Hardware',
    price: 45.00,
    discount_percentage: 0,
    stock_quantity: 3,
    region_tag: 'Global',
    is_promotional: 0,
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    sku: 'MNB-DEV-1016',
    rating: 4.9,
    review_count: 67
  }
];

const SEED_PROJECTS = [
  {
    id: 'proj_001',
    title: 'AI-Powered Smart Product Recommendation Engine',
    description: 'Implement collaborative filtering and vector similarity search to suggest complementary developer accessories based on user cart contents.',
    required_technologies: ['Node.js', 'Python', 'Vector DB', 'Machine Learning', 'REST APIs'],
    status: 'In Progress',
    creator_id: 'usr_admin01',
    creator_name: 'MNB Admin & Lead Architect',
    created_at: '2026-10-15T10:00:00.000Z'
  },
  {
    id: 'proj_002',
    title: 'Automated GST Billing & PDF Invoice Generation Engine',
    description: 'Integrate PDFKit / Puppeteer worker service to generate printable GST compliant invoices with QR codes for domestic Indian and export shipments.',
    required_technologies: ['JavaScript', 'Node.js', 'Express', 'PDFKit', 'Accounting'],
    status: 'Open',
    creator_id: 'usr_cust01',
    creator_name: 'Aditya Sharma (BCA Reviewer)',
    created_at: '2026-10-20T12:30:00.000Z'
  },
  {
    id: 'proj_003',
    title: 'Real-Time Inventory WebSockets Feed for Flash Sales',
    description: 'Build a low-latency pub/sub WebSocket gateway broadcasting stock changes instantaneously across active storefront checkout sessions.',
    required_technologies: ['WebSockets', 'Redis', 'React', 'Tailwind CSS'],
    status: 'Open',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    created_at: '2026-10-28T14:15:00.000Z'
  },
  {
    id: 'proj_004',
    title: 'Cross-Platform React Native Storefront Mobile App',
    description: 'Port the current React catalog to a React Native / Expo codebase with native biometrics and push notifications for order delivery updates.',
    required_technologies: ['React Native', 'Expo', 'TypeScript', 'Tailwind CSS'],
    status: 'Open',
    creator_id: 'usr_vend01',
    creator_name: 'Priya Patel (Hardware Specialist)',
    created_at: '2026-11-02T09:45:00.000Z'
  }
];

const SEED_MESSAGES = [
  {
    id: 'msg_001',
    sender_id: 'usr_cust01',
    sender_name: 'Aditya Sharma (BCA Reviewer)',
    receiver_id: 'usr_admin01',
    reference_id: 'proj_001',
    message_text: 'Hi Team, I have worked with Python TF-IDF and cosine similarity. Can I contribute to the recommendation engine algorithm?',
    timestamp: '2026-11-05T14:20:00.000Z'
  },
  {
    id: 'msg_002',
    sender_id: 'usr_admin01',
    sender_name: 'MNB Admin & Lead Architect',
    receiver_id: 'usr_cust01',
    reference_id: 'proj_001',
    message_text: 'Absolutely Aditya! We are designing the REST endpoint at /api/products/recommendations. Feel free to draft the pull request.',
    timestamp: '2026-11-05T15:10:00.000Z'
  },
  {
    id: 'msg_003',
    sender_id: 'usr_cust01',
    sender_name: 'Aditya Sharma (BCA Reviewer)',
    receiver_id: 'usr_vend01',
    reference_id: 'prod_001',
    message_text: 'Hello Priya, is the DevPro mechanical keyboard compatible with macOS function row shortcuts?',
    timestamp: '2026-11-08T11:05:00.000Z'
  },
  {
    id: 'msg_004',
    sender_id: 'usr_vend01',
    sender_name: 'Priya Patel (Hardware Specialist)',
    receiver_id: 'usr_cust01',
    reference_id: 'prod_001',
    message_text: 'Yes! It features a physical toggle switch between Mac and Windows layouts, and includes replacement Command/Option keycaps.',
    timestamp: '2026-11-08T11:45:00.000Z'
  }
];

// Helper to load/save in localStorage
function getStorage(key, defaultVal) {
  try {
    const val = localStorage.getItem(`mnb_mock_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(`mnb_mock_${key}`, JSON.stringify(val));
  } catch (e) {}
}

// Generate realistic historical orders across 6 months
function generateInitialOrders() {
  const existing = getStorage('orders', null);
  if (existing) return existing;

  const orders = [];
  const months = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
  const monthTargetCounts = [14, 18, 22, 25, 29, 20];
  const regions = ['North America', 'Europe', 'Asia', 'Global'];
  const statuses = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Processing'];

  let count = 1;
  months.forEach((mStr, idx) => {
    const target = monthTargetCounts[idx];
    for (let i = 0; i < target; i++) {
      const orderId = `ord_hist_${String(count).padStart(3, '0')}`;
      const day = Math.floor(1 + Math.random() * 27);
      const orderDate = new Date(`${mStr}-${String(day).padStart(2, '0')}T10:00:00Z`);
      const region = regions[Math.floor(Math.random() * regions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const prod1 = SEED_PRODUCTS[Math.floor(Math.random() * SEED_PRODUCTS.length)];
      const prod2 = SEED_PRODUCTS[Math.floor(Math.random() * SEED_PRODUCTS.length)];
      
      const item1Price = prod1.discount_percentage > 0 ? prod1.price * (1 - prod1.discount_percentage/100) : prod1.price;
      const item2Price = prod2.discount_percentage > 0 ? prod2.price * (1 - prod2.discount_percentage/100) : prod2.price;
      const subtotal = Number((item1Price + item2Price).toFixed(2));
      const tax = Number((subtotal * 0.08).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));

      orders.push({
        id: orderId,
        user_id: 'usr_cust01',
        total_amount: total,
        shipping_address: 'Plot 42, Tech Park Boulevard, Sector 62, Noida, India',
        region: region,
        payment_status: 'Completed',
        order_status: status,
        created_at: orderDate.toISOString(),
        items: [
          {
            id: `item_${orderId}_1`,
            order_id: orderId,
            product_id: prod1.id,
            product_title: prod1.title,
            image_url: prod1.image_url,
            category: prod1.category,
            quantity: 1,
            unit_price: Number(item1Price.toFixed(2))
          },
          {
            id: `item_${orderId}_2`,
            order_id: orderId,
            product_id: prod2.id,
            product_title: prod2.title,
            image_url: prod2.image_url,
            category: prod2.category,
            quantity: 1,
            unit_price: Number(item2Price.toFixed(2))
          }
        ]
      });
      count++;
    }
  });

  setStorage('orders', orders);
  return orders;
}

export class MockStore {
  constructor() {
    this.users = getStorage('users', SEED_USERS);
    this.products = getStorage('products', SEED_PRODUCTS);
    this.projects = getStorage('projects', SEED_PROJECTS);
    this.messages = getStorage('messages', SEED_MESSAGES);
    this.orders = generateInitialOrders();
  }

  save() {
    setStorage('users', this.users);
    setStorage('products', this.products);
    setStorage('projects', this.projects);
    setStorage('messages', this.messages);
    setStorage('orders', this.orders);
  }

  // --- Auth ---
  async login({ email, password }) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    const token = `mock_jwt_${user.id}_${Date.now()}`;
    const { password: _, ...userSafe } = user;
    return {
      success: true,
      message: 'Login successful',
      token,
      user: userSafe
    };
  }

  async register(userData) {
    const existing = this.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('User already exists with this email address');
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'customer',
      region: userData.region || 'North America',
      bio: userData.bio || '',
      tech_stack: userData.tech_stack || [],
      portfolio_url: userData.portfolio_url || ''
    };
    this.users.push(newUser);
    this.save();
    const token = `mock_jwt_${newUser.id}_${Date.now()}`;
    const { password: _, ...userSafe } = newUser;
    return {
      success: true,
      message: 'Registration successful',
      token,
      user: userSafe
    };
  }

  async getProfile() {
    const token = localStorage.getItem('mnb_token') || '';
    const userId = token.split('_')[2];
    const user = this.users.find(u => u.id === userId) || this.users[0];
    const { password: _, ...userSafe } = user;
    return { success: true, user: userSafe };
  }

  async updateProfile(profileData) {
    const token = localStorage.getItem('mnb_token') || '';
    const userId = token.split('_')[2];
    const user = this.users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, profileData);
      this.save();
    }
    const { password: _, ...userSafe } = (user || this.users[0]);
    return { success: true, message: 'Profile updated successfully', user: userSafe };
  }

  async getAllUsers() {
    return {
      success: true,
      users: this.users.map(({ password: _, ...u }) => u)
    };
  }

  // --- Products ---
  async getProducts(params = {}) {
    let list = [...this.products];

    if (params.category && params.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (params.minPrice !== undefined && params.minPrice !== '') {
      list = list.filter(p => p.price >= Number(params.minPrice));
    }

    if (params.maxPrice !== undefined && params.maxPrice !== '') {
      list = list.filter(p => p.price <= Number(params.maxPrice));
    }

    if (params.rating) {
      list = list.filter(p => (p.rating || 0) >= Number(params.rating));
    }

    if (params.promotional === 'true' || params.promotional === true) {
      list = list.filter(p => p.is_promotional === 1 || p.discount_percentage > 0);
    }

    return {
      success: true,
      count: list.length,
      products: list
    };
  }

  async getProductById(id) {
    const prod = this.products.find(p => p.id === id);
    if (!prod) throw new Error('Product not found');
    return { success: true, product: prod };
  }

  async createProduct(data) {
    const newProd = {
      id: `prod_${Date.now()}`,
      sku: `MNB-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 5.0,
      review_count: 0,
      ...data,
      price: Number(data.price),
      discount_percentage: Number(data.discount_percentage || 0),
      stock_quantity: Number(data.stock_quantity || 0),
      is_promotional: Number(data.is_promotional || 0)
    };
    this.products.unshift(newProd);
    this.save();
    return { success: true, message: 'Product created successfully', product: newProd };
  }

  async updateProduct(id, data) {
    const prod = this.products.find(p => p.id === id);
    if (!prod) throw new Error('Product not found');
    Object.assign(prod, {
      ...data,
      price: Number(data.price !== undefined ? data.price : prod.price),
      discount_percentage: Number(data.discount_percentage !== undefined ? data.discount_percentage : prod.discount_percentage),
      stock_quantity: Number(data.stock_quantity !== undefined ? data.stock_quantity : prod.stock_quantity)
    });
    this.save();
    return { success: true, message: 'Product updated successfully', product: prod };
  }

  async deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.save();
    return { success: true, message: 'Product deleted successfully' };
  }

  async addReview(productId, reviewData) {
    const prod = this.products.find(p => p.id === productId);
    if (prod) {
      prod.review_count = (prod.review_count || 0) + 1;
      this.save();
    }
    return { success: true, message: 'Review added successfully' };
  }

  // --- Orders ---
  async createOrder(orderPayload) {
    if (!orderPayload.items || !orderPayload.items.length) {
      throw new Error('Order must contain at least one item');
    }

    // Verify stock and decrement
    const orderItems = [];
    let subtotal = 0;

    for (const item of orderPayload.items) {
      const prod = this.products.find(p => p.id === item.product_id);
      if (!prod) throw new Error(`Product ${item.product_id} not found`);
      if (prod.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for "${prod.title}". Only ${prod.stock_quantity} remaining.`);
      }
      prod.stock_quantity -= item.quantity;
      const effectivePrice = prod.discount_percentage > 0
        ? prod.price * (1 - prod.discount_percentage / 100)
        : prod.price;
      subtotal += effectivePrice * item.quantity;

      orderItems.push({
        id: `item_${Date.now()}_${item.product_id}`,
        product_id: prod.id,
        product_title: prod.title,
        image_url: prod.image_url,
        category: prod.category,
        quantity: item.quantity,
        unit_price: Number(effectivePrice.toFixed(2))
      });
    }

    const tax = Number((subtotal * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const token = localStorage.getItem('mnb_token') || '';
    const userId = token.split('_')[2] || 'usr_cust01';

    const newOrder = {
      id: `ord_${Date.now()}`,
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: orderPayload.shipping_address || '452 Innovation Blvd, Austin, TX',
      region: orderPayload.region || 'North America',
      payment_status: 'Completed',
      order_status: 'Processing',
      created_at: new Date().toISOString(),
      items: orderItems
    };

    this.orders.unshift(newOrder);
    this.save();

    return {
      success: true,
      message: 'Order created successfully',
      order: newOrder
    };
  }

  async getMyOrders() {
    const token = localStorage.getItem('mnb_token') || '';
    const userId = token.split('_')[2] || 'usr_cust01';
    const myOrders = this.orders.filter(o => o.user_id === userId || o.user_id === 'usr_cust01');
    return { success: true, orders: myOrders };
  }

  async getAllOrders() {
    return { success: true, orders: this.orders };
  }

  async getOrderById(id) {
    const ord = this.orders.find(o => o.id === id);
    if (!ord) throw new Error('Order not found');
    return { success: true, order: ord };
  }

  async updateOrderStatus(id, status) {
    const ord = this.orders.find(o => o.id === id);
    if (ord) {
      ord.order_status = status;
      this.save();
    }
    return { success: true, message: 'Order status updated' };
  }

  // --- Projects ---
  async getProjects() {
    return { success: true, projects: this.projects };
  }

  async getProjectById(id) {
    const p = this.projects.find(x => x.id === id);
    if (!p) throw new Error('Project not found');
    return { success: true, project: p };
  }

  async createProject(data) {
    const token = localStorage.getItem('mnb_token') || '';
    const userId = token.split('_')[2] || 'usr_admin01';
    const user = this.users.find(u => u.id === userId) || this.users[0];

    const newProj = {
      id: `proj_${Date.now()}`,
      title: data.title,
      description: data.description,
      required_technologies: Array.isArray(data.required_technologies)
        ? data.required_technologies
        : (data.required_technologies || '').split(',').map(s => s.trim()).filter(Boolean),
      status: 'Open',
      creator_id: userId,
      creator_name: user.name,
      created_at: new Date().toISOString()
    };
    this.projects.unshift(newProj);
    this.save();
    return { success: true, message: 'Project created successfully', project: newProj };
  }

  // --- Messages ---
  async getMessages(referenceId) {
    const msgs = this.messages.filter(m => String(m.reference_id) === String(referenceId));
    return { success: true, messages: msgs };
  }

  async sendMessage(data) {
    const token = localStorage.getItem('mnb_token') || '';
    const userId = token.split('_')[2] || 'usr_cust01';
    const user = this.users.find(u => u.id === userId) || this.users[1];

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender_id: userId,
      sender_name: user.name,
      receiver_id: data.receiver_id || 'usr_admin01',
      reference_id: data.reference_id,
      message_text: data.message_text,
      timestamp: new Date().toISOString()
    };
    this.messages.push(newMsg);
    this.save();
    return { success: true, message: 'Message sent successfully', messageRecord: newMsg };
  }

  // --- Analytics & OLS Forecasting Engine ---
  async getAnalyticsSummary() {
    let totalRevenue = 0;
    const catMap = {};
    const regMap = {};
    const monthMap = {};

    this.orders.forEach(o => {
      totalRevenue += o.total_amount;
      const r = o.region || 'Global';
      regMap[r] = (regMap[r] || 0) + o.total_amount;

      const m = o.created_at ? o.created_at.substring(0, 7) : '2026-11';
      if (!monthMap[m]) monthMap[m] = { revenue: 0, orders: 0 };
      monthMap[m].revenue += o.total_amount;
      monthMap[m].orders += 1;

      (o.items || []).forEach(item => {
        const c = item.category || 'Electronics';
        catMap[c] = (catMap[c] || 0) + item.unit_price * item.quantity;
      });
    });

    const totalOrders = this.orders.length;
    const averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
    const lowStockCount = this.products.filter(p => p.stock_quantity < 10).length;

    const categoryBreakdown = Object.entries(catMap).map(([category, revenue]) => ({
      category,
      revenue: Number(revenue.toFixed(2)),
      orders: Math.floor(revenue / (averageOrderValue || 100)) + 1
    }));

    const regionalBreakdown = Object.entries(regMap).map(([region, revenue]) => ({
      region,
      revenue: Number(revenue.toFixed(2)),
      orders: Math.floor(revenue / (averageOrderValue || 100)) + 1
    }));

    const monthlyTrends = Object.entries(monthMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => ({
        month,
        revenue: Number(data.revenue.toFixed(2)),
        orders: data.orders
      }));

    return {
      success: true,
      summary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        averageOrderValue,
        activeUsers: this.users.length + 42,
        lowStockCount
      },
      categoryBreakdown,
      regionalBreakdown,
      monthlyTrends
    };
  }

  async getSalesForecast() {
    const summary = await this.getAnalyticsSummary();
    const monthlyTrends = summary.monthlyTrends || [];

    // OLS Linear Regression on historical monthly order volumes
    const N = monthlyTrends.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    monthlyTrends.forEach((t, i) => {
      const x = i + 1;
      const y = t.orders;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = N > 1 && (N * sumX2 - sumX * sumX) !== 0
      ? (N * sumXY - sumX * sumY) / (N * sumX2 - sumX * sumX)
      : 1.5;
    const intercept = N > 0 ? (sumY - slope * sumX) / N : 15;

    // R-squared
    const meanY = N > 0 ? sumY / N : 20;
    let ssTot = 0, ssRes = 0;
    monthlyTrends.forEach((t, i) => {
      const x = i + 1;
      const y = t.orders;
      const yHat = slope * x + intercept;
      ssTot += Math.pow(y - meanY, 2);
      ssRes += Math.pow(y - yHat, 2);
    });
    const rSquared = ssTot > 0 ? Math.max(0, Number((1 - ssRes / ssTot).toFixed(3))) : 0.885;

    const projectedVolume = Math.max(1, Math.round(slope * (N + 1) + intercept));
    const projectedRevenue = Number((projectedVolume * summary.summary.averageOrderValue).toFixed(2));
    const growthRate = slope > 0 ? `+${(slope * 4).toFixed(1)}%` : `${(slope * 4).toFixed(1)}%`;

    // Inventory advisories for low-stock items
    const inventoryAdvisory = this.products
      .filter(p => p.stock_quantity < 10)
      .slice(0, 4)
      .map(p => {
        const predictedDemand = Math.round(projectedVolume * 0.15) + 5;
        const safetyStock = 4;
        const recommendedQty = Math.max(0, predictedDemand + safetyStock - p.stock_quantity);
        return {
          product_id: p.id,
          title: p.title,
          current_stock: p.stock_quantity,
          predicted_monthly_demand: predictedDemand,
          safety_stock: safetyStock,
          recommended_reorder_qty: recommendedQty,
          urgency: 'CRITICAL REORDER'
        };
      });

    return {
      success: true,
      forecast: {
        model: 'Ordinary Least Squares (OLS) Linear Regression',
        historicalMonths: N,
        trendSlope: Number(slope.toFixed(2)),
        trendIntercept: Number(intercept.toFixed(2)),
        rSquared,
        projectedNextMonthVolume: projectedVolume,
        projectedNextMonthRevenue: projectedRevenue,
        growthRatePercentage: growthRate,
        inventoryAdvisory
      }
    };
  }
}

export const mockStore = new MockStore();
