const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Checkout / Create Order
const createOrder = async (req, res, next) => {
  try {
    const { items, shipping_address, region = 'North America', payment_method = 'Credit Card' } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to create an order.' });
    }

    let totalAmount = 0;
    const resolvedItems = [];

    // Check inventory and calculate total
    for (const item of items) {
      const product = await db.getAsync(`SELECT * FROM products WHERE id = ?`, [item.product_id]);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product_id} not found.` });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Available: ${product.stock_quantity}, requested: ${item.quantity}.`
        });
      }

      const effectivePrice = product.discount_percentage > 0
        ? Number((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
        : product.price;

      totalAmount += effectivePrice * item.quantity;
      resolvedItems.push({
        product_id: product.id,
        title: product.title,
        quantity: item.quantity,
        unit_price: effectivePrice,
        image_url: product.image_url,
        sku: product.sku
      });
    }

    // Add estimated sales tax (8%)
    const tax = Number((totalAmount * 0.08).toFixed(2));
    const finalTotal = Number((totalAmount + tax).toFixed(2));

    const orderId = `ord_${uuidv4().substring(0, 8)}`;

    // Create Order Record
    await db.runAsync(`
      INSERT INTO orders (id, user_id, total_amount, shipping_address, region, payment_status, order_status)
      VALUES (?, ?, ?, ?, ?, 'Completed', 'Processing')
    `, [orderId, userId, finalTotal, shipping_address, region]);

    // Insert Order Items & decrement stock
    for (const item of resolvedItems) {
      const itemId = `item_${uuidv4().substring(0, 8)}`;
      await db.runAsync(`
        INSERT INTO order_items (id, order_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?)
      `, [itemId, orderId, item.product_id, item.quantity, item.unit_price]);

      // Decrement stock
      await db.runAsync(`
        UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?
      `, [item.quantity, item.product_id]);
    }

    return res.status(201).json({
      success: true,
      message: 'Order created successfully. Simulated payment confirmed.',
      order: {
        id: orderId,
        user_id: userId,
        subtotal: Number(totalAmount.toFixed(2)),
        tax,
        total_amount: finalTotal,
        shipping_address,
        region,
        payment_status: 'Completed',
        payment_method,
        order_status: 'Processing',
        created_at: new Date().toISOString(),
        items: resolvedItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await db.allAsync(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `, [userId]);

    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      const items = await db.allAsync(`
        SELECT oi.*, p.title, p.image_url, p.category, p.sku
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      return { ...order, items };
    }));

    return res.status(200).json({
      success: true,
      count: enrichedOrders.length,
      orders: enrichedOrders
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await db.allAsync(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      const items = await db.allAsync(`
        SELECT oi.*, p.title, p.category, p.sku
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      return { ...order, items };
    }));

    return res.status(200).json({
      success: true,
      count: enrichedOrders.length,
      orders: enrichedOrders
    });
  } catch (error) {
    next(error);
  }
};

// Get single order with invoice details
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await db.getAsync(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order invoice.' });
    }

    const items = await db.allAsync(`
      SELECT oi.*, p.title, p.image_url, p.category, p.sku
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    return res.status(200).json({
      success: true,
      order: { ...order, items }
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: [${validStatuses.join(', ')}]`
      });
    }

    const existing = await db.getAsync(`SELECT id FROM orders WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await db.runAsync(`UPDATE orders SET order_status = ? WHERE id = ?`, [order_status, id]);

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${order_status}".`,
      order_status
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};
