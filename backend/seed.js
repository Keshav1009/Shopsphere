/**
 * Database Seed Script for E-Commerce Storefront
 * MNB Soft Solutions Pvt. Ltd. Internship - Paper Code: BCA-311
 * Populates realistic accounts, 16+ products, 6 months historical orders, projects, and message threads.
 */

const bcrypt = require('bcryptjs');
const db = require('./src/db/database');

async function seedDatabase() {
  console.log('🌱 Starting Database Seeding Process...');

  await db.initSchema();

  // Clear existing data for fresh seed
  console.log('🧹 Purging existing test tables...');
  await db.runAsync('DELETE FROM order_items');
  await db.runAsync('DELETE FROM orders');
  await db.runAsync('DELETE FROM reviews');
  await db.runAsync('DELETE FROM connections_messages');
  await db.runAsync('DELETE FROM projects');
  await db.runAsync('DELETE FROM products');
  await db.runAsync('DELETE FROM users');

  // 1. Seed Users
  console.log('👤 Seeding Users & Developer Profiles...');
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
  const userPasswordHash = await bcrypt.hash('User@123', salt);
  const vendorPasswordHash = await bcrypt.hash('Vendor@123', salt);

  const users = [
    {
      id: 'usr_admin01',
      name: 'MNB Admin & Lead Architect',
      email: 'admin@mnbsolutions.com',
      password_hash: adminPasswordHash,
      role: 'admin',
      region: 'North America',
      bio: 'Lead Full-Stack Architect & Store Operations Manager at MNB Soft Solutions Pvt. Ltd.',
      tech_stack: JSON.stringify(['Node.js', 'React', 'Express', 'SQLite', 'Tailwind CSS', 'Docker', 'REST APIs']),
      portfolio_url: 'https://mnbsoft.com'
    },
    {
      id: 'usr_cust01',
      name: 'Aditya Sharma (BCA Reviewer)',
      email: 'user@mnbsolutions.com',
      password_hash: userPasswordHash,
      role: 'customer',
      region: 'Asia',
      bio: 'Full Stack Developer Intern & Academic Evaluator for Summer Project BCA-311.',
      tech_stack: JSON.stringify(['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Tailwind CSS']),
      portfolio_url: 'https://github.com/aditya-mnb'
    },
    {
      id: 'usr_vend01',
      name: 'Priya Patel (Hardware Specialist)',
      email: 'vendor.priya@mnbsolutions.com',
      password_hash: vendorPasswordHash,
      role: 'vendor',
      region: 'North America',
      bio: 'Hardware systems integrator and supplier of developer workstations and smart gadgets.',
      tech_stack: JSON.stringify(['Embedded C', 'IoT', 'Python', 'Hardware Design', 'Raspberry Pi']),
      portfolio_url: 'https://priyapatel.tech'
    },
    {
      id: 'usr_vend02',
      name: 'Rohit Verma (Dev Tools Creator)',
      email: 'dev.rohit@mnbsolutions.com',
      password_hash: vendorPasswordHash,
      role: 'vendor',
      region: 'Europe',
      bio: 'Creator of developer productivity utilities, CLI extensions, and ergonomic desktop accessories.',
      tech_stack: JSON.stringify(['TypeScript', 'Next.js', 'Go', 'GraphQL', 'Tailwind CSS']),
      portfolio_url: 'https://rohitverma.dev'
    }
  ];

  for (const u of users) {
    await db.runAsync(`
      INSERT INTO users (id, name, email, password_hash, role, region, bio, tech_stack, portfolio_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [u.id, u.name, u.email, u.password_hash, u.role, u.region, u.bio, u.tech_stack, u.portfolio_url]);
  }
  console.log(`✅ Seeded ${users.length} users successfully.`);

  // 2. Seed 16+ Diverse Products
  console.log('📦 Seeding Products Catalog across Categories & Regions...');
  const products = [
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
      creator_id: 'usr_vend02',
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
      creator_id: 'usr_vend02',
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
      stock_quantity: 4, // Low stock for alert testing
      region_tag: 'Europe',
      is_promotional: 0,
      image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
      creator_id: 'usr_vend01',
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
      creator_id: 'usr_vend02',
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
      creator_id: 'usr_vend02',
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
      creator_id: 'usr_vend02',
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
      creator_id: 'usr_vend02',
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
      stock_quantity: 3, // Low stock for alert testing
      region_tag: 'Global',
      is_promotional: 0,
      image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      creator_id: 'usr_vend01',
      sku: 'MNB-DEV-1016',
      rating: 4.9,
      review_count: 67
    }
  ];

  for (const p of products) {
    await db.runAsync(`
      INSERT INTO products (id, title, description, category, price, discount_percentage, stock_quantity, region_tag, is_promotional, image_url, creator_id, sku, rating, review_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, p.title, p.description, p.category, p.price, p.discount_percentage,
      p.stock_quantity, p.region_tag, p.is_promotional, p.image_url, p.creator_id,
      p.sku, p.rating, p.review_count
    ]);
  }
  console.log(`✅ Seeded ${products.length} products successfully.`);

  // 3. Seed Reviews
  console.log('⭐ Seeding Customer Reviews...');
  const sampleReviews = [
    { id: 'rev_01', product_id: 'prod_001', user_id: 'usr_cust01', user_name: 'Aditya Sharma', rating: 5, comment: 'Hands down the crispest keyboard I have used for coding. The Gateron brown switches feel amazing!' },
    { id: 'rev_02', product_id: 'prod_002', user_id: 'usr_cust01', user_name: 'Aditya Sharma', rating: 5, comment: 'Having two full IDE windows side-by-side on this 34-inch curved screen boosted my productivity instantly.' },
    { id: 'rev_03', product_id: 'prod_003', user_id: 'usr_cust01', user_name: 'Aditya Sharma', rating: 4, comment: 'Solid lumbar support. Assembly was straightforward with the included hex key.' },
    { id: 'rev_04', product_id: 'prod_004', user_id: 'usr_cust01', user_name: 'Aditya Sharma', rating: 5, comment: 'Very soft premium cotton and great fit. Perfect MNB company merchandise.' }
  ];
  for (const r of sampleReviews) {
    await db.runAsync(`
      INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [r.id, r.product_id, r.user_id, r.user_name, r.rating, r.comment]);
  }

  // 4. Seed Historical Orders (Spanning 6 months for realistic analytics & forecasting)
  console.log('📊 Seeding 6 Months of Historical Orders & Analytics Data...');
  const regions = ['North America', 'Europe', 'Asia', 'Global'];
  const orderStatuses = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Processing'];

  let orderCount = 0;
  const now = new Date();

  // Create monthly cohorts over past 6 months
  // Month -5, -4, -3, -2, -1, 0
  const monthlyVolumes = [12, 16, 21, 26, 33, 40]; // Upward growth trend for OLS regression

  for (let m = 5; m >= 0; m--) {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - m, 15);
    const volume = monthlyVolumes[5 - m];

    for (let i = 0; i < volume; i++) {
      const orderDate = new Date(targetMonth.getTime() + (i * 18 * 60 * 60 * 1000) - (Math.random() * 86400000));
      const orderId = `ord_hist_${5 - m}_${i + 1}`;
      const region = regions[Math.floor(Math.random() * regions.length)];
      const status = m === 0 ? (i > volume - 4 ? 'Processing' : 'Shipped') : 'Delivered';

      // Pick 1 to 3 random products
      const numItems = Math.floor(1 + Math.random() * 2.5);
      let orderSubtotal = 0;
      const orderItems = [];

      for (let k = 0; k < numItems; k++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(1 + Math.random() * 2);
        const effectivePrice = prod.discount_percentage > 0
          ? Number((prod.price * (1 - prod.discount_percentage / 100)).toFixed(2))
          : prod.price;
        orderSubtotal += effectivePrice * qty;
        orderItems.push({
          id: `item_${orderId}_${k + 1}`,
          product_id: prod.id,
          quantity: qty,
          unit_price: effectivePrice
        });
      }

      const tax = Number((orderSubtotal * 0.08).toFixed(2));
      const totalAmount = Number((orderSubtotal + tax).toFixed(2));

      await db.runAsync(`
        INSERT INTO orders (id, user_id, total_amount, shipping_address, region, payment_status, order_status, created_at)
        VALUES (?, 'usr_cust01', ?, 'Plot 42, Tech Park Boulevard, Sector 62, Noida, India', ?, 'Completed', ?, ?)
      `, [orderId, totalAmount, region, status, orderDate.toISOString()]);

      for (const item of orderItems) {
        await db.runAsync(`
          INSERT INTO order_items (id, order_id, product_id, quantity, unit_price)
          VALUES (?, ?, ?, ?, ?)
        `, [item.id, orderId, item.product_id, item.quantity, item.unit_price]);
      }
      orderCount++;
    }
  }
  console.log(`✅ Seeded ${orderCount} realistic historical orders spanning 6 months.`);

  // 5. Seed Collaborative Projects / Storefront Initiatives
  console.log('🤝 Seeding Collaborative Initiatives & Developer Projects...');
  const projects = [
    {
      id: 'proj_001',
      title: 'AI-Powered Smart Product Recommendation Engine',
      description: 'Implement collaborative filtering and vector similarity search to suggest complementary developer accessories based on user cart contents.',
      required_technologies: JSON.stringify(['Node.js', 'Python', 'Vector DB', 'Machine Learning', 'REST APIs']),
      status: 'In Progress',
      creator_id: 'usr_admin01'
    },
    {
      id: 'proj_002',
      title: 'Automated GST Billing & PDF Invoice Generation Engine',
      description: 'Integrate PDFKit / Puppeteer worker service to generate printable GST compliant invoices with QR codes for domestic Indian and export shipments.',
      required_technologies: JSON.stringify(['JavaScript', 'Node.js', 'Express', 'PDFKit', 'Accounting']),
      status: 'Open',
      creator_id: 'usr_cust01'
    },
    {
      id: 'proj_003',
      title: 'Real-Time Inventory WebSockets Feed for Flash Sales',
      description: 'Build a low-latency pub/sub WebSocket gateway broadcasting stock changes instantaneously across active storefront checkout sessions.',
      required_technologies: JSON.stringify(['WebSockets', 'Redis', 'React', 'Tailwind CSS']),
      status: 'Open',
      creator_id: 'usr_vend02'
    },
    {
      id: 'proj_004',
      title: 'Cross-Platform React Native Storefront Mobile App',
      description: 'Port the current React catalog to a React Native / Expo codebase with native biometrics and push notifications for order delivery updates.',
      required_technologies: JSON.stringify(['React Native', 'Expo', 'TypeScript', 'Tailwind CSS']),
      status: 'Open',
      creator_id: 'usr_vend01'
    }
  ];

  for (const proj of projects) {
    await db.runAsync(`
      INSERT INTO projects (id, title, description, required_technologies, status, creator_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [proj.id, proj.title, proj.description, proj.required_technologies, proj.status, proj.creator_id]);
  }
  console.log(`✅ Seeded ${projects.length} collaborative initiatives.`);

  // 6. Seed Peer-to-Peer Messages / Connection Threads
  console.log('💬 Seeding Peer-to-Peer Messages & Connection Threads...');
  const messages = [
    {
      id: 'msg_001',
      sender_id: 'usr_cust01',
      receiver_id: 'usr_admin01',
      reference_id: 'proj_001',
      message_text: 'Hi Team, I have worked with Python TF-IDF and cosine similarity. Can I contribute to the recommendation engine algorithm?'
    },
    {
      id: 'msg_002',
      sender_id: 'usr_admin01',
      receiver_id: 'usr_cust01',
      reference_id: 'proj_001',
      message_text: 'Absolutely Aditya! We are designing the REST endpoint at /api/products/recommendations. Feel free to draft the pull request.'
    },
    {
      id: 'msg_003',
      sender_id: 'usr_cust01',
      receiver_id: 'usr_vend01',
      reference_id: 'prod_001',
      message_text: 'Hello Priya, does this DevPro mechanical keyboard come with macOS keycaps included in the retail box?'
    },
    {
      id: 'msg_004',
      sender_id: 'usr_vend01',
      receiver_id: 'usr_cust01',
      reference_id: 'prod_001',
      message_text: 'Yes! It includes both Command and Option keycaps along with a dedicated wire keycap puller.'
    }
  ];

  for (const m of messages) {
    await db.runAsync(`
      INSERT INTO connections_messages (id, sender_id, receiver_id, reference_id, message_text)
      VALUES (?, ?, ?, ?, ?)
    `, [m.id, m.sender_id, m.receiver_id, m.reference_id, m.message_text]);
  }
  console.log(`✅ Seeded ${messages.length} connection threads.`);

  console.log('🎉 Database Seeding Completed Successfully! All tables ready.');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
