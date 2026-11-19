import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import InvoiceModal from './components/InvoiceModal';
import ProfileModal from './components/ProfileModal';
import AuthModal from './components/AuthModal';
import CollaborationHub from './components/CollaborationHub';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { api } from './services/api';
import {
  SlidersHorizontal,
  Star,
  RefreshCw,
  Sparkles,
  Search,
  Tag,
  DollarSign,
  Globe
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('storefront'); // storefront | collaboration | orders | admin
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Multi-Criteria Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [regionFilter, setRegionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Fetch products on filter changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, minRating, onlyPromo, regionFilter, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        rating: minRating || undefined,
        promo: onlyPromo ? 'true' : undefined,
        region: regionFilter !== 'All' ? regionFilter : undefined,
        sortBy
      };

      const res = await api.getProducts(params);
      if (res?.success) {
        setProducts(res.products);
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setOnlyPromo(false);
    setRegionFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Tab Rendering */}
      <main className="flex-1">
        {activeTab === 'storefront' && (
          <div>
            {/* Hero Section */}
            <Hero
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onExploreClick={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Catalog Section with Sidebar Filters */}
            <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Multi-Criteria Filter Sidebar */}
                <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-mnb-600" />
                      Filters & Criteria
                    </span>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-mnb-600 hover:text-mnb-700 font-semibold"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                          selectedCategory === 'All'
                            ? 'bg-mnb-50 text-mnb-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.category}
                          onClick={() => setSelectedCategory(c.category)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                            selectedCategory === c.category
                              ? 'bg-mnb-50 text-mnb-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{c.category}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({c.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Price Range ($)
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="number"
                        placeholder="Min ($)"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="p-2 border rounded-lg outline-none focus:border-mnb-500 bg-slate-50 font-mono"
                      />
                      <input
                        type="number"
                        placeholder="Max ($)"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="p-2 border rounded-lg outline-none focus:border-mnb-500 bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Minimum Rating
                    </label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border rounded-lg outline-none focus:border-mnb-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5 ★ and above</option>
                      <option value="4.0">4.0 ★ and above</option>
                      <option value="3.5">3.5 ★ and above</option>
                    </select>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" /> Dispatch Region
                    </label>
                    <select
                      value={regionFilter}
                      onChange={(e) => setRegionFilter(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border rounded-lg outline-none focus:border-mnb-500"
                    >
                      <option value="All">All Regions</option>
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Global">Global</option>
                    </select>
                  </div>

                  {/* Promotional Toggle */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                      <input
                        type="checkbox"
                        checked={onlyPromo}
                        onChange={(e) => setOnlyPromo(e.target.checked)}
                        className="rounded text-mnb-600 focus:ring-mnb-500 h-4 w-4"
                      />
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-rose-500" /> Discounts & Promotions Only
                      </span>
                    </label>
                  </div>
                </aside>

                {/* Products Grid */}
                <section className="lg:col-span-9 space-y-4">
                  {/* Sorting Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                    <span className="font-semibold text-slate-600">
                      Showing <strong className="text-slate-900">{products.length}</strong> developer products
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-semibold">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 outline-none focus:border-mnb-500"
                      >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                      </select>
                    </div>
                  </div>

                  {/* Products Cards Grid */}
                  {loading ? (
                    <div className="text-center py-20 text-slate-400 text-sm">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-mnb-600 mb-2" />
                      Loading catalog items...
                    </div>
                  ) : products.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
                      <Search className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700">No matching products found</p>
                      <p className="text-xs text-slate-400">
                        Try loosening your price filters or keyword query to explore our catalog.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="text-xs font-bold text-mnb-600 hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelectProduct={(p) => setSelectedProduct(p)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Collaboration Hub */}
        {activeTab === 'collaboration' && <CollaborationHub />}

        {/* Tab 3: Order History & Tracking */}
        {activeTab === 'orders' && (
          <OrderHistory onSelectInvoice={(order) => setSelectedInvoice(order)} />
        )}

        {/* Tab 4: Admin Dashboard & Forecast */}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={(order) => {
          setSelectedInvoice(order);
        }}
      />

      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
