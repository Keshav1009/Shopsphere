/**
 * Automated Unit & Integration Test Suite
 * Paper Code: BCA-311 (Summer Training Project)
 * Organization: MNB Soft Solutions Pvt. Ltd.
 * Tests: Authentication, Product Filtering, Order Creation, Predictive Analytics, Collaboration
 */

const { test, describe, before } = require('node:test');
const assert = require('node:assert');
const { PassThrough } = require('stream');
const { app } = require('../server');
const seedDatabase = require('../seed');

let adminToken = '';
let customerToken = '';
let sampleProductId = '';

// High-performance in-memory Express dispatcher (fully in-process, zero socket EACCES risk)
function request(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const urlObj = new URL(path, 'http://localhost:5000');
    const headers = {
      'content-type': 'application/json',
      'accept': 'application/json'
    };
    if (token) headers['authorization'] = `Bearer ${token}`;

    const socket = new PassThrough();
    socket.remoteAddress = '127.0.0.1';
    socket.destroy = () => {};

    const reqStream = new PassThrough();
    const query = Object.fromEntries(urlObj.searchParams.entries());

    const req = Object.assign(reqStream, {
      method: method.toUpperCase(),
      url: path,
      originalUrl: path,
      path: urlObj.pathname,
      query,
      headers,
      ip: '127.0.0.1',
      socket,
      connection: socket,
      body: body || {}
    });

    let statusCode = 200;
    const responseHeaders = {};
    let resolved = false;

    const finish = (data) => {
      if (resolved) return;
      resolved = true;
      resolve({ status: statusCode, headers: responseHeaders, body: data });
    };

    const res = Object.assign(new PassThrough(), {
      statusCode: 200,
      setHeader: (name, val) => { responseHeaders[name.toLowerCase()] = val; },
      getHeader: (name) => responseHeaders[name.toLowerCase()],
      status: function(code) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        finish(data);
      },
      send: function(data) {
        try {
          finish(JSON.parse(data));
        } catch {
          finish(data);
        }
      },
      end: function(data) {
        if (data) {
          try {
            finish(JSON.parse(data));
          } catch {
            finish(data);
          }
        } else {
          finish(null);
        }
      }
    });

    app.handle(req, res);
  });
}

before(async () => {
  await seedDatabase();
});

describe('1. Health Check & System Status', () => {
  test('GET /api/health should return status ONLINE with project metadata', async () => {
    const res = await request('GET', '/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ONLINE');
    assert.strictEqual(res.body.paperCode, 'BCA-311');
    assert.strictEqual(res.body.organization, 'MNB Soft Solutions Pvt. Ltd.');
  });
});

describe('2. Authentication & Profile Management', () => {
  test('POST /api/auth/login with Admin credentials should return valid JWT token', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: 'admin@mnbsolutions.com',
      password: 'Admin@123'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token, 'Token should be returned');
    assert.strictEqual(res.body.user.role, 'admin');
    adminToken = res.body.token;
  });

  test('POST /api/auth/login with Customer credentials should return valid JWT token', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: 'user@mnbsolutions.com',
      password: 'User@123'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'customer');
    customerToken = res.body.token;
  });

  test('POST /api/auth/register should validate invalid email format', async () => {
    const res = await request('POST', '/api/auth/register', {
      name: 'Test Candidate',
      email: 'invalid-email-address',
      password: 'Pass'
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
  });

  test('GET /api/auth/profile should fetch authenticated user and tech stack', async () => {
    const res = await request('GET', '/api/auth/profile', null, customerToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.email, 'user@mnbsolutions.com');
    assert.ok(Array.isArray(res.body.user.tech_stack));
  });
});

describe('3. Products Catalog & Multi-Criteria Filtering', () => {
  test('GET /api/products should return 16+ products with category counts', async () => {
    const res = await request('GET', '/api/products');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.products.length >= 16);
    assert.ok(Array.isArray(res.body.categories));
    sampleProductId = res.body.products[0].id;
  });

  test('GET /api/products with multi-criteria filtering (category + minPrice)', async () => {
    const res = await request('GET', '/api/products?category=Electronics&minPrice=200');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    res.body.products.forEach(p => {
      assert.strictEqual(p.category, 'Electronics');
      assert.ok(p.price >= 200);
    });
  });

  test('GET /api/products with promo filter should return only discounted items', async () => {
    const res = await request('GET', '/api/products?promo=true');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    res.body.products.forEach(p => {
      assert.ok(p.is_promotional === 1 || p.discount_percentage > 0);
    });
  });

  test('GET /api/products/:id should fetch single product details & reviews', async () => {
    const res = await request('GET', `/api/products/${sampleProductId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.product.id, sampleProductId);
    assert.ok(Array.isArray(res.body.reviews));
  });
});

describe('4. Order Creation, Inventory & Tracking System', () => {
  test('POST /api/orders should complete checkout and decrement stock', async () => {
    const checkoutPayload = {
      items: [
        { product_id: sampleProductId, quantity: 1 }
      ],
      shipping_address: 'Room 302, BCA Computer Science Block, Noida, India',
      region: 'Asia',
      payment_method: 'UPI / Credit Card'
    };

    const res = await request('POST', '/api/orders', checkoutPayload, customerToken);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.order.id);
    assert.strictEqual(res.body.order.payment_status, 'Completed');
    assert.ok(res.body.order.total_amount > 0);
  });

  test('GET /api/orders/my-orders should retrieve customer past orders', async () => {
    const res = await request('GET', '/api/orders/my-orders', null, customerToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.orders.length > 0);
    assert.ok(Array.isArray(res.body.orders[0].items));
  });
});

describe('5. Sales Analytics & Predictive Forecasting Engine', () => {
  test('GET /api/analytics/summary should return KPI cards (Admin only)', async () => {
    const res = await request('GET', '/api/analytics/summary', null, adminToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.totalRevenue > 0);
    assert.ok(res.body.data.totalOrders > 0);
    assert.ok(res.body.data.averageOrderValue > 0);
    assert.ok(res.body.data.activeUsers >= 4);
  });

  test('GET /api/analytics/breakdowns should return Category, Region, and Monthly cohorts', async () => {
    const res = await request('GET', '/api/analytics/breakdowns', null, adminToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.categories.length > 0);
    assert.ok(res.body.data.regions.length > 0);
    assert.ok(res.body.data.monthlyTrends.length >= 6);
  });

  test('GET /api/analytics/forecast should perform Linear Regression & Inventory Recommendations', async () => {
    const res = await request('GET', '/api/analytics/forecast', null, adminToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const forecast = res.body.data;
    assert.ok(forecast.modelMetrics);
    assert.strictEqual(typeof forecast.modelMetrics.slope, 'number');
    assert.strictEqual(typeof forecast.modelMetrics.confidenceRSquared, 'number');
    assert.ok(Array.isArray(forecast.projectedQuarters));
    assert.strictEqual(forecast.projectedQuarters.length, 3, 'Should forecast next 3 months');
    assert.ok(Array.isArray(forecast.inventoryRecommendations));
    assert.ok(forecast.inventoryRecommendations.length > 0);
    assert.ok(forecast.summaryStats.totalForecastNext3Months > 0);
  });
});

describe('6. Collaborative Initiatives & Peer-to-Peer Messaging', () => {
  test('GET /api/projects should return collaborative storefront initiatives', async () => {
    const res = await request('GET', '/api/projects');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.projects.length >= 4);
    assert.ok(Array.isArray(res.body.projects[0].required_technologies));
  });

  test('POST /api/messages should allow posting a message to an initiative thread', async () => {
    const res = await request('POST', '/api/messages', {
      reference_id: 'proj_001',
      message_text: 'I can help benchmark the search indexing algorithm for this initiative!'
    }, customerToken);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.reference_id, 'proj_001');
  });

  test('GET /api/messages/:referenceId should fetch thread discussion', async () => {
    const res = await request('GET', '/api/messages/proj_001', null, customerToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.messages.length >= 3);
  });
});
