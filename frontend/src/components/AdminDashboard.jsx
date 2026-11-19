import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Brain,
  RefreshCw,
  Sparkles,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';

const COLORS = ['#0c87eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | forecast | products | orders | users
  const [summary, setSummary] = useState(null);
  const [breakdowns, setBreakdowns] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product CRUD modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    title: '',
    description: '',
    category: 'Developer Hardware',
    price: '',
    discount_percentage: '0',
    stock_quantity: '15',
    region_tag: 'Global',
    is_promotional: false,
    image_url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
    sku: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, breakRes, foreRes, prodRes, ordRes, usrRes] = await Promise.all([
        api.getAnalyticsSummary(),
        api.getAnalyticsBreakdowns(),
        api.getSalesForecast(),
        api.getProducts({ limit: 100 }),
        api.getAllOrders(),
        api.getAllUsers()
      ]);

      if (sumRes?.success) setSummary(sumRes.data);
      if (breakRes?.success) setBreakdowns(breakRes.data);
      if (foreRes?.success) setForecast(foreRes.data);
      if (prodRes?.success) setProducts(prodRes.products);
      if (ordRes?.success) setOrders(ordRes.orders);
      if (usrRes?.success) setUsers(usrRes.users);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, prodForm);
        alert('Product updated successfully!');
      } else {
        await api.createProduct(prodForm);
        alert('New product added to catalog!');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleQuickRestock = async (product, amount = 20) => {
    try {
      await api.updateProduct(product.id, {
        stock_quantity: product.stock_quantity + amount
      });
      loadDashboardData();
      alert(`Restocked +${amount} units for ${product.title}`);
    } catch (err) {
      alert(err.message || 'Restock failed');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-mnb-600 mb-3" />
        Calculating statistical regression & sales analytics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              Executive Sales & Predictive Intelligence Dashboard
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
              ADMIN PANEL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales tracking, Ordinary Least Squares (OLS) trend regression, and inventory intelligence.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 'analytics', label: 'Descriptive Analytics', icon: BarChart3 },
            { id: 'forecast', label: 'Predictive Forecasting', icon: Brain },
            { id: 'products', label: 'Product Inventory', icon: Layers },
            { id: 'orders', label: 'Order Fulfillment', icon: ShoppingCart },
            { id: 'users', label: 'User Directory', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mnb-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards (Always visible) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </p>
          <p className="text-2xl font-black text-slate-900">${summary?.totalRevenue?.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Realized gross sales
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-mnb-600" />
          </p>
          <p className="text-2xl font-black text-slate-900">{summary?.totalOrders}</p>
          <p className="text-[10px] text-slate-500">Across all 4 regions</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Avg Order Value</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </p>
          <p className="text-2xl font-black text-slate-900">${summary?.averageOrderValue}</p>
          <p className="text-[10px] text-slate-500">AOV per transaction</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Active Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </p>
          <p className="text-2xl font-black text-slate-900">{summary?.activeUsers}</p>
          <p className="text-[10px] text-slate-500">Registered developers</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 lg:col-span-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Low-Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </p>
          <p className="text-2xl font-black text-amber-600">{summary?.lowStockAlerts}</p>
          <p className="text-[10px] text-amber-600 font-semibold">Stock ≤ 10 units</p>
        </div>
      </div>

      {/* TAB 1: Descriptive Analytics Charts */}
      {activeTab === 'analytics' && breakdowns && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Trend Bar Chart */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Historical Monthly Sales Cohorts (6 Months)</h3>
                  <p className="text-xs text-slate-400">Total gross volume realized over trailing 6 months</p>
                </div>
                <span className="text-xs font-mono text-mnb-600 bg-mnb-50 px-2 py-0.5 rounded font-bold">
                  Trend: Upward
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdowns.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month_label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="total_revenue" fill="#0c87eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Category Revenue Share</h3>
              <p className="text-xs text-slate-400">Sales volume by developer catalog vertical</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdowns.categories}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name.substring(0, 7)} ${(percent * 100).toFixed(0)}%`}
                    >
                      {breakdowns.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Regional Breakdown & Promo Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Regional Sales Distribution</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdowns.regions} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="region" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip formatter={(val) => [`$${val}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Promotional vs Standard Catalog Impact</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdowns.promoImpact}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val) => [`$${val}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Predictive Sales Forecasting Module */}
      {activeTab === 'forecast' && forecast && (
        <div className="space-y-6">
          {/* Mathematical Model Metrics Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-900 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Statistical Trend Model Metrics</h3>
              </div>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono px-3 py-1 rounded-full">
                {forecast.modelMetrics.algorithm}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">Regression Slope (m)</span>
                <p className="text-xl font-mono font-bold text-white mt-1">+{forecast.modelMetrics.slope}</p>
                <span className="text-[10px] text-emerald-400">Monthly delta</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">Determination (R²)</span>
                <p className="text-xl font-mono font-bold text-white mt-1">{forecast.modelMetrics.confidenceRSquared}</p>
                <span className="text-[10px] text-indigo-300">Model Fit (92%+ confidence)</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">Quarterly Growth Velocity</span>
                <p className="text-xl font-mono font-bold text-white mt-1">+{forecast.modelMetrics.projectedGrowthRatePercent}%</p>
                <span className="text-[10px] text-emerald-400">Half-year baseline</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400">Next 3 Months Projected Gross</span>
                <p className="text-xl font-mono font-bold text-white mt-1">
                  ${forecast.summaryStats.totalForecastNext3Months?.toLocaleString()}
                </p>
                <span className="text-[10px] text-indigo-300">~{forecast.summaryStats.estimatedUnitsNext3Months} units</span>
              </div>
            </div>
          </div>

          {/* Historical vs Projected Linear Regression Projection Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Historical Actuals vs. 3-Month Linear Regression Forecast
              </h3>
              <p className="text-xs text-slate-500">
                Orange line indicates the 3-Month Rolling Moving Average; Indigo represents predictive trend trajectory.
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast.forecastTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`$${value || 0}`, 'Revenue']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actualRevenue"
                    stroke="#0c87eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Actual Revenue (Hist)"
                  />
                  <Line
                    type="monotone"
                    dataKey="movingAverage"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    name="3-Mo Moving Avg"
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedRevenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#8b5cf6' }}
                    name="Projected Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Smart Inventory Reorder Recommendations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Automated Inventory Reorder & Velocity Intelligence
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated using product sales velocity, current stock levels, and days-of-inventory remaining.
                </p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 font-bold px-3 py-1 rounded-lg">
                {forecast.summaryStats.criticalRestockCount} Items Critical
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 font-bold">Product</th>
                    <th className="py-2.5 font-bold">Category</th>
                    <th className="py-2.5 font-bold text-center">Current Stock</th>
                    <th className="py-2.5 font-bold text-center">Monthly Velocity</th>
                    <th className="py-2.5 font-bold text-center">Days Remaining</th>
                    <th className="py-2.5 font-bold text-center">Urgency</th>
                    <th className="py-2.5 font-bold">Recommended Action</th>
                    <th className="py-2.5 font-bold text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {forecast.inventoryRecommendations.map((item) => (
                    <tr key={item.product_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900 max-w-xs truncate">{item.title}</td>
                      <td className="py-3 text-slate-600">{item.category}</td>
                      <td className="py-3 text-center font-mono font-bold text-slate-800">{item.current_stock}</td>
                      <td className="py-3 text-center font-mono text-slate-600">~{item.monthly_velocity}/mo</td>
                      <td className="py-3 text-center font-mono">
                        <span
                          className={`font-bold ${
                            item.estimated_days_remaining < 15
                              ? 'text-rose-600'
                              : item.estimated_days_remaining < 30
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {item.estimated_days_remaining} days
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.urgency === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : item.urgency === 'WARNING'
                              ? 'bg-amber-100 text-amber-800'
                              : item.urgency === 'OVERSTOCKED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </td>
                      <td className="py-3 text-slate-700 font-medium">{item.recommended_action}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleQuickRestock(products.find(p => p.id === item.product_id) || { id: item.product_id, title: item.title, stock_quantity: item.current_stock }, 25)}
                          className="bg-slate-100 hover:bg-mnb-50 hover:text-mnb-700 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                        >
                          +25 Units
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Products CRUD Inventory Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Product Catalog CRUD Management</h3>
              <p className="text-xs text-slate-500">Add, edit pricing, stock levels, and promotional discounts.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProdForm({
                  title: '',
                  description: '',
                  category: 'Developer Hardware',
                  price: '',
                  discount_percentage: '0',
                  stock_quantity: '20',
                  region_tag: 'Global',
                  is_promotional: false,
                  image_url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
                  sku: ''
                });
                setShowProductModal(true);
              }}
              className="bg-mnb-600 hover:bg-mnb-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-right">Price</th>
                  <th className="py-2.5 text-center">Discount</th>
                  <th className="py-2.5 text-center">Stock</th>
                  <th className="py-2.5">Region</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={prod.image_url}
                          alt={prod.title}
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{prod.title}</p>
                          <p className="text-[10px] font-mono text-slate-400">{prod.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 font-semibold">{prod.category}</td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">${prod.price}</td>
                    <td className="py-3 text-center">
                      {prod.discount_percentage > 0 ? (
                        <span className="bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          -{prod.discount_percentage}%
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono font-bold">
                      <span className={prod.stock_quantity <= 5 ? 'text-rose-600 font-black' : 'text-slate-800'}>
                        {prod.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-500">{prod.region_tag || 'Global'}</td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setProdForm({
                            title: prod.title,
                            description: prod.description,
                            category: prod.category,
                            price: String(prod.price),
                            discount_percentage: String(prod.discount_percentage || 0),
                            stock_quantity: String(prod.stock_quantity),
                            region_tag: prod.region_tag || 'Global',
                            is_promotional: !!prod.is_promotional,
                            image_url: prod.image_url,
                            sku: prod.sku
                          });
                          setShowProductModal(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-mnb-600 hover:bg-slate-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Order Fulfillment & Status Controller</h3>
            <p className="text-xs text-slate-500">Live order pipeline for customer dispatches across regions.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Destination</th>
                  <th className="py-2.5 text-right">Total</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Update Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900">#{o.id}</td>
                    <td className="py-3">
                      <p className="font-bold text-slate-800">{o.customer_name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-400">{o.customer_email}</p>
                    </td>
                    <td className="py-3 text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="py-3 text-slate-600 truncate max-w-xs">{o.shipping_address}</td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">${o.total_amount}</td>
                    <td className="py-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          o.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.order_status === 'Shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : o.order_status === 'Processing'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">User & Contributor Directory</h3>
            <p className="text-xs text-slate-500">Role permissions and developer technology stacks.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5">Region</th>
                  <th className="py-2.5">Developer Tech Stack</th>
                  <th className="py-2.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'vendor'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{u.region || 'Global'}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {(u.tech_stack || []).map((t) => (
                          <span
                            key={t}
                            className="bg-slate-100 text-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-slate-400 font-mono">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">
              {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={prodForm.title}
                  onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={prodForm.category}
                  onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                  className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                >
                  <option value="Developer Hardware">Developer Hardware</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Software Tools">Software Tools</option>
                  <option value="Merch">Merch</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Smart Devices">Smart Devices</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={prodForm.discount_percentage}
                    onChange={(e) => setProdForm({ ...prodForm, discount_percentage: e.target.value })}
                    className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    value={prodForm.stock_quantity}
                    onChange={(e) => setProdForm({ ...prodForm, stock_quantity: e.target.value })}
                    className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region Tag</label>
                  <select
                    value={prodForm.region_tag}
                    onChange={(e) => setProdForm({ ...prodForm, region_tag: e.target.value })}
                    className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                  >
                    <option value="Global">Global</option>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodForm.image_url}
                  onChange={(e) => setProdForm({ ...prodForm, image_url: e.target.value })}
                  className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full p-2 border rounded-lg outline-none focus:border-mnb-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-mnb-600 hover:bg-mnb-700 text-white font-bold rounded-lg shadow"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
