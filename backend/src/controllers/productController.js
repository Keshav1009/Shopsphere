const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Get all products with multi-criteria filtering
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      rating,
      promo,
      region,
      sortBy = 'newest',
      page = 1,
      limit = 50
    } = req.query;

    let sql = `
      SELECT p.*, u.name AS creator_name, u.role AS creator_role, u.tech_stack AS creator_tech_stack
      FROM products p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'All') {
      sql += ` AND p.category = ?`;
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (minPrice && !isNaN(minPrice)) {
      sql += ` AND p.price >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
      sql += ` AND p.price <= ?`;
      params.push(Number(maxPrice));
    }

    if (rating && !isNaN(rating)) {
      sql += ` AND p.rating >= ?`;
      params.push(Number(rating));
    }

    if (promo === 'true' || promo === '1') {
      sql += ` AND (p.is_promotional = 1 OR p.discount_percentage > 0)`;
    }

    if (region && region !== 'All') {
      sql += ` AND (p.region_tag = ? OR p.region_tag = 'Global')`;
      params.push(region);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      sql += ` ORDER BY p.price ASC`;
    } else if (sortBy === 'price_desc') {
      sql += ` ORDER BY p.price DESC`;
    } else if (sortBy === 'rating') {
      sql += ` ORDER BY p.rating DESC, p.review_count DESC`;
    } else {
      sql += ` ORDER BY p.created_at DESC`;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const products = await db.allAsync(sql, params);

    // Format creator tech stack
    const formatted = products.map(p => {
      try {
        p.creator_tech_stack = JSON.parse(p.creator_tech_stack || '[]');
      } catch {
        p.creator_tech_stack = [];
      }
      return p;
    });

    // Get categories count
    const categories = await db.allAsync(`
      SELECT category, COUNT(id) as count FROM products GROUP BY category
    `);

    return res.status(200).json({
      success: true,
      count: formatted.length,
      categories,
      products: formatted
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await db.getAsync(`
      SELECT p.*, u.name AS creator_name, u.email AS creator_email, u.bio AS creator_bio, u.portfolio_url AS creator_portfolio, u.tech_stack AS creator_tech_stack
      FROM products p
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    try {
      product.creator_tech_stack = JSON.parse(product.creator_tech_stack || '[]');
    } catch {
      product.creator_tech_stack = [];
    }

    // Fetch product reviews
    const reviews = await db.allAsync(`
      SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC
    `, [id]);

    return res.status(200).json({
      success: true,
      product,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// Create product
const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      price,
      discount_percentage = 0,
      stock_quantity = 10,
      region_tag = 'Global',
      is_promotional = 0,
      image_url,
      sku
    } = req.body;

    const id = `prod_${uuidv4().substring(0, 8)}`;
    const generatedSku = sku || `MNB-${category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const creatorId = req.user ? req.user.id : null;

    await db.runAsync(`
      INSERT INTO products (id, title, description, category, price, discount_percentage, stock_quantity, region_tag, is_promotional, image_url, creator_id, sku, rating, review_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0)
    `, [
      id,
      title.trim(),
      description,
      category,
      Number(price),
      Number(discount_percentage),
      Number(stock_quantity),
      region_tag,
      is_promotional ? 1 : 0,
      image_url,
      creatorId,
      generatedSku
    ]);

    const created = await db.getAsync(`SELECT * FROM products WHERE id = ?`, [id]);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: created
    });
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      price,
      discount_percentage,
      stock_quantity,
      region_tag,
      is_promotional,
      image_url,
      sku
    } = req.body;

    const existing = await db.getAsync(`SELECT * FROM products WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await db.runAsync(`
      UPDATE products SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        price = COALESCE(?, price),
        discount_percentage = COALESCE(?, discount_percentage),
        stock_quantity = COALESCE(?, stock_quantity),
        region_tag = COALESCE(?, region_tag),
        is_promotional = COALESCE(?, is_promotional),
        image_url = COALESCE(?, image_url),
        sku = COALESCE(?, sku)
      WHERE id = ?
    `, [
      title,
      description,
      category,
      price !== undefined ? Number(price) : undefined,
      discount_percentage !== undefined ? Number(discount_percentage) : undefined,
      stock_quantity !== undefined ? Number(stock_quantity) : undefined,
      region_tag,
      is_promotional !== undefined ? (is_promotional ? 1 : 0) : undefined,
      image_url,
      sku,
      id
    ]);

    const updated = await db.getAsync(`SELECT * FROM products WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db.getAsync(`SELECT id FROM products WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// Add product review
const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
    }

    const reviewId = `rev_${uuidv4().substring(0, 8)}`;
    await db.runAsync(`
      INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [reviewId, id, userId, userName, Number(rating), comment || '']);

    // Recalculate average rating
    const stats = await db.getAsync(`
      SELECT AVG(rating) as avg_rating, COUNT(id) as count FROM reviews WHERE product_id = ?
    `, [id]);

    const roundedRating = Number((stats.avg_rating || 5.0).toFixed(1));
    await db.runAsync(`
      UPDATE products SET rating = ?, review_count = ? WHERE id = ?
    `, [roundedRating, stats.count, id]);

    return res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      review: {
        id: reviewId,
        product_id: id,
        user_id: userId,
        user_name: userName,
        rating: Number(rating),
        comment,
        created_at: new Date().toISOString()
      },
      newRating: roundedRating,
      newReviewCount: stats.count
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
};
