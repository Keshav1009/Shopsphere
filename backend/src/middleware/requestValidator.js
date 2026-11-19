// Request Validation Helper Middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for registration input.',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { title, category, price } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Product title is required.');
  }

  if (!category || typeof category !== 'string') {
    errors.push('Product category is required.');
  }

  if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    errors.push('Product price must be a positive number.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for product payload.',
      errors
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { items, shipping_address } = req.body;
  const errors = [];

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one item.');
  } else {
    items.forEach((item, index) => {
      if (!item.product_id) errors.push(`Item at index ${index} must have a product_id.`);
      if (!item.quantity || item.quantity < 1) errors.push(`Item at index ${index} must have a valid quantity.`);
    });
  }

  if (!shipping_address || typeof shipping_address !== 'string' || shipping_address.trim().length < 5) {
    errors.push('A valid shipping address of at least 5 characters is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed for order submission.',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProduct,
  validateOrder
};
