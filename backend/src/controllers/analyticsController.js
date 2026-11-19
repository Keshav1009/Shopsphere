const AnalyticsService = require('../services/analyticsService');

// Overall KPI summary
const getSummary = async (req, res, next) => {
  try {
    const summary = await AnalyticsService.getSummaryMetrics();
    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// Breakdowns (Category, Region, Promotion, Monthly)
const getBreakdowns = async (req, res, next) => {
  try {
    const [categories, regions, monthlyTrends, promoImpact] = await Promise.all([
      AnalyticsService.getCategoryBreakdown(),
      AnalyticsService.getRegionalBreakdown(),
      AnalyticsService.getMonthlyTrends(),
      AnalyticsService.getPromotionalImpact()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        categories,
        regions,
        monthlyTrends,
        promoImpact
      }
    });
  } catch (error) {
    next(error);
  }
};

// Predictive sales forecasting & inventory recommendations
const getForecast = async (req, res, next) => {
  try {
    const forecast = await AnalyticsService.getForecastingData();
    return res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getBreakdowns,
  getForecast
};
