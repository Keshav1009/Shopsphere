const db = require('../db/database');
const ForecastingService = require('./forecastingService');

class AnalyticsService {
  /**
   * Overall Executive KPI Metrics
   */
  static async getSummaryMetrics() {
    const revenueRow = await db.getAsync(`
      SELECT 
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COUNT(id) AS total_orders,
        COALESCE(AVG(total_amount), 0) AS avg_order_value
      FROM orders
    `);

    const usersRow = await db.getAsync(`
      SELECT COUNT(id) AS active_users FROM users
    `);

    const lowStockRow = await db.getAsync(`
      SELECT COUNT(id) AS low_stock_count FROM products WHERE stock_quantity <= 10
    `);

    return {
      totalRevenue: Number(revenueRow.total_revenue.toFixed(2)),
      totalOrders: revenueRow.total_orders,
      averageOrderValue: Number(revenueRow.avg_order_value.toFixed(2)),
      activeUsers: usersRow.active_users,
      lowStockAlerts: lowStockRow.low_stock_count
    };
  }

  /**
   * Sales breakdown by Category
   */
  static async getCategoryBreakdown() {
    const rows = await db.allAsync(`
      SELECT 
        p.category,
        COUNT(DISTINCT o.id) AS total_orders,
        COALESCE(SUM(oi.quantity), 0) AS units_sold,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id
      GROUP BY p.category
      ORDER BY revenue DESC
    `);

    return rows.map(r => ({
      category: r.category,
      totalOrders: r.total_orders,
      unitsSold: r.units_sold,
      revenue: Number(r.revenue.toFixed(2))
    }));
  }

  /**
   * Sales breakdown by Region
   */
  static async getRegionalBreakdown() {
    const rows = await db.allAsync(`
      SELECT 
        region,
        COUNT(id) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS revenue
      FROM orders
      GROUP BY region
      ORDER BY revenue DESC
    `);

    return rows.map(r => ({
      region: r.region || 'Global',
      orders: r.total_orders,
      revenue: Number(r.revenue.toFixed(2))
    }));
  }

  /**
   * Historical Monthly Trends (Past 6 Months)
   */
  static async getMonthlyTrends() {
    const rows = await db.allAsync(`
      SELECT 
        strftime('%Y-%m', created_at) AS month_key,
        COUNT(id) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS total_revenue
      FROM orders
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month_key ASC
    `);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return rows.map(r => {
      const [year, month] = (r.month_key || '2026-01').split('-');
      const label = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
      return {
        month_key: r.month_key,
        month_label: label,
        total_orders: r.total_orders,
        total_revenue: Number(r.total_revenue.toFixed(2))
      };
    });
  }

  /**
   * Promotional vs Standard Product Impact
   */
  static async getPromotionalImpact() {
    const promoRow = await db.getAsync(`
      SELECT 
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue,
        COALESCE(SUM(oi.quantity), 0) AS units_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE p.is_promotional = 1 OR p.discount_percentage > 0
    `);

    const regularRow = await db.getAsync(`
      SELECT 
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue,
        COALESCE(SUM(oi.quantity), 0) AS units_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE p.is_promotional = 0 AND (p.discount_percentage = 0 OR p.discount_percentage IS NULL)
    `);

    return [
      {
        type: 'Promotional / Discounted',
        revenue: Number(promoRow.revenue.toFixed(2)),
        unitsSold: promoRow.units_sold
      },
      {
        type: 'Standard Catalog',
        revenue: Number(regularRow.revenue.toFixed(2)),
        unitsSold: regularRow.units_sold
      }
    ];
  }

  /**
   * Predictive Forecasting & Inventory Recommendations
   */
  static async getForecastingData() {
    const monthlyData = await this.getMonthlyTrends();
    const products = await db.allAsync(`SELECT * FROM products ORDER BY stock_quantity ASC`);
    return ForecastingService.generateForecast(monthlyData, products);
  }
}

module.exports = AnalyticsService;
