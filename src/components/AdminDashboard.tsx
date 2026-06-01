import React, { useState, useEffect } from 'react';
import { useStore } from '../services/storeContext';
import { dbStore } from '../services/dbStore';
import { Order, OrderStatus, Product, NavTab } from '../types';
import { isSupabaseConfigured } from '../services/supabaseClient';
import {
  ShieldCheck,
  PlusCircle,
  Trash2,
  Edit2,
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Database,
  RefreshCw,
  Search,
  Eye,
  CheckCircle,
  Layers,
  Sparkles,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    setProducts,
    activeTab,
    setActiveTab
  } = useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'analytics' | 'inventory' | 'catalog-form' | 'orders'>('analytics');
  
  // Selected Invoice receipt modal preview
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  // Search & Filter state for catalog management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Currently editing product state. If null, we are in "Add Product" mode
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for adding/editing product
  const [prodName, setProdName] = useState('');
  const [prodTamil, setProdTamil] = useState('');
  const [prodPrice, setProdPrice] = useState(400);
  const [prodCategory, setProdCategory] = useState('Raw Wild Honey');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('https://res.cloudinary.com/dlddzqqnw/image/upload/v1779902931/629709396_18142245394476616_8848105931985901562_n_kkgj74.jpg');
  const [prodInventory, setProdInventory] = useState(50);
  const [prodIngredients, setProdIngredients] = useState('');

  // Preset Unsplash and Cloudinary cover images for the honey-farm catalog
  const PRESET_COVERS = [
    { name: 'Kamala Honey Farm Jar', url: 'https://res.cloudinary.com/dlddzqqnw/image/upload/v1779902931/629709396_18142245394476616_8848105931985901562_n_kkgj74.jpg' },
    { name: 'Raw Clover comb', url: 'https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=500' },
    { name: 'Warm Forest Wild', url: 'https://images.unsplash.com/photo-1596450514943-ac434a2c07d5?auto=format&fit=crop&q=80&w=500' },
    { name: 'Medicinal Ginger Infuse', url: 'https://images.unsplash.com/photo-1605335195007-aa97a7e37e96?auto=format&fit=crop&q=80&w=500' },
    { name: 'Wild Apiary Hive', url: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=500' },
    { name: 'Organic Royal Propolis', url: 'https://images.unsplash.com/photo-1587049257218-197ee89b9d03?auto=format&fit=crop&q=80&w=500' },
    { name: 'Pure Honey Droplet', url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=500' }
  ];

  // Sync orders on mount
  const loadOrdersAndProducts = async () => {
    if (currentUser && currentUser.role === 'admin') {
      setLoading(true);
      try {
        const orderList = await dbStore.getAllOrders();
        setOrders(orderList);
        const prodList = await dbStore.getAllProducts();
        setProducts(prodList);
      } catch (err) {
        console.error('Error load details:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrdersAndProducts();
  }, [currentUser]);

  // Handle switching to Editing mode
  const startEditing = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdTamil(p.tamilName);
    setProdPrice(p.price);
    setProdCategory(p.category);
    setProdDesc(p.description);
    setProdImage(p.image);
    setProdInventory(p.inventory);
    setProdIngredients(p.ingredients ? p.ingredients.join(', ') : '');
    setActiveAdminSubTab('catalog-form');
  };

  // Reset Form
  const resetForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdTamil('');
    setProdPrice(400);
    setProdCategory('Raw Wild Honey');
    setProdDesc('');
    setProdImage('https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=500');
    setProdInventory(50);
    setProdIngredients('');
  };

  // Submit Product Add or Edit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) {
      alert('Please fill out the product title and standard price.');
      return;
    }

    const ingredientsArray = prodIngredients
      ? prodIngredients.split(',').map(s => s.trim()).filter(Boolean)
      : ['Pure Natural Honey', 'Organic Farm Extract'];

    const targetId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;

    const formattedProduct: Product = {
      id: targetId,
      name: prodName.trim(),
      tamilName: prodTamil.trim() || prodName.trim(),
      price: Number(prodPrice),
      description: prodDesc.trim() || 'Directly harvested and slow-cured without synthetic additives under strict parameters near Thirunelveli apiaries.',
      category: prodCategory.trim(),
      rating: editingProduct ? editingProduct.rating : 5,
      image: prodImage.trim(),
      inventory: Number(prodInventory),
      ingredients: ingredientsArray,
      isBestSeller: editingProduct ? editingProduct.isBestSeller : false
    };

    try {
      if (editingProduct) {
        await dbStore.updateProduct(formattedProduct);
      } else {
        await dbStore.addProduct(formattedProduct);
      }
      
      const updatedList = await dbStore.getAllProducts();
      setProducts(updatedList);
      alert(editingProduct ? 'Product specifications updated successfully!' : 'New product successfully cataloged to active stack!');
      resetForm();
      setActiveAdminSubTab('inventory');
    } catch (err) {
      console.error(err);
      alert('Error processed database update.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you strictly sure you want to retire and delete this honey product from active database records?')) {
      try {
        await dbStore.deleteProduct(id);
        const updatedList = await dbStore.getAllProducts();
        setProducts(updatedList);
      } catch (err) {
        console.error(err);
        alert('Could not execute product removal.');
      }
    }
  };

  // Fast inline stock adjustment helper (+/-)
  const adjustStock = async (product: Product, delta: number) => {
    const newInventory = Math.max(0, product.inventory + delta);
    const updated: Product = { ...product, inventory: newInventory };
    
    // Update local set and persist back
    const updatedList = products.map(p => p.id === product.id ? updated : p);
    setProducts(updatedList);
    
    try {
      await dbStore.updateProduct(updated);
    } catch (err) {
      console.error('Failed to update stock in DB:', err);
    }
  };

  // Direct manual stock change handler
  const setExactStock = async (product: Product, countString: string) => {
    const rawVal = parseInt(countString.replace(/\D/g, ''), 10);
    const newInventory = isNaN(rawVal) ? 0 : Math.max(0, rawVal);
    
    const updated: Product = { ...product, inventory: newInventory };
    const updatedList = products.map(p => p.id === product.id ? updated : p);
    setProducts(updatedList);

    try {
      await dbStore.updateProduct(updated);
    } catch (err) {
      console.error('Failed to set manual stock in DB:', err);
    }
  };

  // Update order status callback
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await dbStore.updateOrderStatus(orderId, newStatus as OrderStatus);
      const updated = await dbStore.getAllOrders();
      setOrders(updated);
    } catch (e) {
      console.error(e);
      alert('Unable to alter order state.');
    }
  };

  // Filter products by search & category dropdown
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tamilName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for catalog dropdown
  const categoriesList = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // METRICS & ANALYSIS PREDICTIONS
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const lowStockItems = products.filter(p => p.inventory < 15 && p.inventory > 0);
  const outOfStockItems = products.filter(p => p.inventory === 0);
  const totalStockVolume = products.reduce((sum, p) => sum + p.inventory, 0);
  const totalStockAssetValue = products.reduce((sum, p) => sum + (p.price * p.inventory), 0);

  // Prepare Recharts bar data
  const chartStockData = products.map(p => ({
    name: p.name.length > 20 ? p.name.substring(0, 18) + '..' : p.name,
    stock: p.inventory,
    value: p.price * p.inventory
  }));

  // Prepare Pie Chart category data
  const categorySummary: { [key: string]: number } = {};
  products.forEach(p => {
    categorySummary[p.category] = (categorySummary[p.category] || 0) + p.inventory;
  });
  const pieChartData = Object.keys(categorySummary).map(catName => ({
    name: catName,
    value: categorySummary[catName]
  }));

  const COLORS_PALETTE = ['#D4A017', '#4E2F12', '#2E7D32', '#A0522D', '#CD853F', '#8B4513', '#66c2a5', '#fc8d62'];

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-20 px-4 text-center space-y-4 max-w-md mx-auto">
        <span className="text-4xl">🔒</span>
        <h2 className="text-xl font-bold text-honey-brown dark:text-white font-heading">Authorized Personnel Access Only</h2>
        <p className="text-xs text-honey-brown/70 dark:text-honey-warm/60 leading-relaxed font-sans">
          This secure system interface contains sensitive real-time transaction ledgers, active apiary warehouse audits, and stock controls restricted only for Kamala Farm Administrators.
        </p>
        <button
          onClick={() => setActiveTab(NavTab.DASHBOARD)}
          className="px-6 py-2.5 bg-[#4E2F12] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition hover:bg-black"
        >
          Authenticate as Kamala Admin
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* HEADER STATUS LAYER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-honey-brown/15 dark:border-honey-gold/15 pb-6 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-[#2E7D32] bg-[#2E7D32]/10 dark:bg-emerald-950/40 dark:text-emerald-300 font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <ShieldCheck size={12} /> SECURE MASTER CONTROL
          </span>
          <h2 className="text-3xl font-black text-honey-brown dark:text-white font-heading">
            Kamala Farm Inventory Suite
          </h2>
          <p className="text-xs text-honey-brown/65 dark:text-honey-warm/65">
            Audit high-yield sales, adjust interactive apiary stock levels, and coordinate direct WhatsApp orders.
          </p>
        </div>

        {/* SUPABASE CONNECTION STATUS */}
        <div className="p-4 bg-honey-gold/5 dark:bg-charcoal border border-honey-brown/10 dark:border-honey-gold/10 rounded-2xl flex items-center gap-3 w-fit md:max-w-xs text-left">
          <div className="p-2 bg-[#2E7D32]/10 text-[#2E7D32] dark:bg-green-950/20 rounded-full animate-pulse">
            <Database size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-honey-brown dark:text-honey-gold tracking-wider">DATABASE CAPABILITY</span>
              <span className={`inline-block w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
            </div>
            <p className="text-[10px] font-bold text-honey-brown/60 dark:text-honey-warm/60 leading-normal">
              {isSupabaseConfigured 
                ? 'Concurrently linked to Supabase Products table'
                : 'Resilient offline storage active • Direct copy/paste SQL blueprint inside'}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK SUB TAB SWITCHER SECTIONS */}
      <div className="flex flex-wrap gap-1 bg-honey-warm/15 dark:bg-charcoal p-1 rounded-2xl border border-honey-brown/5">
        <button
          onClick={() => setActiveAdminSubTab('analytics')}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeAdminSubTab === 'analytics'
              ? 'bg-[#4E2F12] text-white shadow'
              : 'text-honey-brown/70 dark:text-honey-warm/60 hover:bg-honey-warm/10'
          }`}
        >
          <TrendingUp size={14} /> Sales & Stock Analytics
        </button>
        <button
          onClick={() => setActiveAdminSubTab('inventory')}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeAdminSubTab === 'inventory'
              ? 'bg-[#4E2F12] text-white shadow'
              : 'text-honey-brown/70 dark:text-honey-warm/60 hover:bg-honey-warm/10'
          }`}
        >
          <Package size={14} /> Inventory Controller
        </button>
        <button
          onClick={() => {
            resetForm();
            setActiveAdminSubTab('catalog-form');
          }}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeAdminSubTab === 'catalog-form'
              ? 'bg-[#4E2F12] text-white shadow'
              : 'text-honey-brown/70 dark:text-honey-warm/60 hover:bg-honey-warm/10'
          }`}
        >
          <PlusCircle size={14} /> {editingProduct ? 'Edit Product Form' : 'Add New Product'}
        </button>
        <button
          onClick={() => setActiveAdminSubTab('orders')}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeAdminSubTab === 'orders'
              ? 'bg-[#4E2F12] text-white shadow'
              : 'text-honey-brown/70 dark:text-honey-warm/60 hover:bg-honey-warm/10'
          }`}
        >
          <CheckCircle size={14} /> WhatsApp Order Ledger
        </button>
      </div>

      {/* STATUS AND LOW-STOCK DISPATCH ALERTS BANNER */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Immediate Apiary Action Required!</p>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-snug">
                {outOfStockItems.length > 0 && <span className="font-bold underline">{outOfStockItems.length} items retired/Out of Stock</span>}
                {outOfStockItems.length > 0 && lowStockItems.length > 0 && ' and '}
                {lowStockItems.length > 0 && <span className="font-bold underline">{lowStockItems.length} items on Low Stock threshold (&lt;15 Jars remaining)</span>}.
                Ensure wholesale bottling is initiated before client orders are placed.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveAdminSubTab('inventory')}
            className="px-3.5 py-1.5 bg-amber-600 font-bold text-[10px] text-white uppercase rounded transition hover:bg-amber-800"
          >
            Refill Warehouses
          </button>
        </div>
      )}

      {/* ======================= SUB TAB 1: ANALYTICS ======================= */}
      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* CORE SALES STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">Aggregate Customer Value</span>
                <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono block">₹{totalRevenue}</span>
                <p className="text-[10px] text-[#2E7D32] font-semibold flex items-center gap-0.5">
                  <ArrowUp size={10} className="inline" /> Direct Farm Orders Complete
                </p>
              </div>
              <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-350 rounded-xl">
                <DollarSign size={20} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">Total Invoiced Orders</span>
                <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono block">{orders.length}</span>
                <p className="text-[10px] text-honey-brown/40 font-semibold font-sans">
                  Active WhatsApp client queries
                </p>
              </div>
              <div className="p-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-350 rounded-xl">
                <Package size={20} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">Warehouse Stock volume</span>
                <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono block">{totalStockVolume} Jars</span>
                <p className="text-[10px] text-honey-brown/40 font-bold font-sans">
                  Sum total bottle units
                </p>
              </div>
              <div className="p-3 bg-emerald-100 text-[#2E7D32] dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl">
                <Layers size={20} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">Estimated Inventory Assets</span>
                <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono block">₹{totalStockAssetValue}</span>
                <p className="text-[10px] text-forest-green font-bold font-sans">
                  Retail valuation pricing
                </p>
              </div>
              <div className="p-3 bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-350 rounded-xl">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>

          {/* TWO COLUMN CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COMPONENT BAR CHART: STOCK COUNTS */}
            <div className="lg:col-span-8 bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black font-heading text-honey-brown dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="text-[#D4A017]" size={16} /> Individual Product Stock Levels
                </h3>
                <p className="text-[10px] text-honey-brown/60 dark:text-honey-warm/50 mt-0.5">
                  Visual inventory jar volume currently available across catalog lines. Action threshold is below 15 units.
                </p>
              </div>

              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartStockData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} />
                    <YAxis fontSize={9} stroke="#888888" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '11px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="stock" name="Active Jar Count" fill="#D4A017">
                      {chartStockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.stock < 15 ? '#EF4444' : '#D4A017'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* COMPONENT PIE CHART: CATEGORY DISTRIBUTION */}
            <div className="lg:col-span-4 bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black font-heading text-honey-brown dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="text-forest-green" size={16} /> Category Density Mix
                </h3>
                <p className="text-[10px] text-honey-brown/60 dark:text-honey-warm/50 mt-0.5">
                  Total jars volume proportioned by family groups inside the warehouse.
                </p>
              </div>

              <div className="h-56 w-full flex items-center justify-center relative text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PALETTE[index % COLORS_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} Jars`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center visual text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-black text-honey-brown dark:text-white font-mono">{totalStockVolume} Jars</span>
                  <span className="text-[8px] text-honey-brown/40 uppercase tracking-widest font-sans">Total</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-honey-brown/5 pt-3">
                {pieChartData.slice(0, 4).map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: COLORS_PALETTE[index % COLORS_PALETTE.length] }} />
                    <span className="text-honey-brown dark:text-honey-warm/80 truncate font-semibold">{entry.name}: <strong>{entry.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SQL PROVISION BLUEPRINT ACCORDION TOOL FOR SUPABASE */}
          <div className="bg-charcoal text-white p-6 rounded-3xl shadow border border-honey-gold/15 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Database size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-honey-gold">Supabase DB Synchronization Blueprint</h4>
                  <p className="text-[10px] text-white/50">Setup your live tables in 60 seconds manually.</p>
                </div>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">Products table schema</span>
            </div>

            <p className="text-[11px] text-white/70 leading-relaxed max-w-3xl">
              To wire this frontend suite directly with your active Cloud database, provision the <strong className="text-white">products</strong> table in your Supabase SQL Editor. The system is designed with dual-sync fallback, meaning it instantly writes changes both locally and remotely!
            </p>

            <pre className="p-4 bg-black/50 text-[10px] font-mono text-emerald-400 rounded-xl overflow-x-auto border border-white/5 whitespace-pre select-all">
{`CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  category TEXT,
  description TEXT,
  tamil_name TEXT,
  rating NUMERIC DEFAULT 5
);

-- Enable public access policies for testing
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);`}
            </pre>
          </div>

        </div>
      )}

      {/* ======================= SUB TAB 2: INVENTORY CONTROLLER ======================= */}
      {activeAdminSubTab === 'inventory' && (
        <div className="bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/5 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-honey-brown/5 pb-4">
            <div>
              <h3 className="font-heading font-black text-lg text-honey-brown dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers size={18} className="text-honey-gold" /> Apiary Warehouse Inventory Manager
              </h3>
              <p className="text-[11px] text-honey-brown/65 dark:text-honey-warm/65">
                Audit active jar counts, execute quick inline stock adjustments, and trigger low stock alerts instantly.
              </p>
            </div>

            {/* SEARCH AND FILTERS ROW */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-honey-brown/40" />
                <input
                  type="text"
                  placeholder="Query honey..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3.5 py-2.5 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 focus:outline-none w-48 text-semibold"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 outline-none font-semibold text-honey-brown dark:bg-charcoal dark:border-honey-gold/20"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CATALOG TABLE OR GRID */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-honey-brown/10 text-honey-brown/55 uppercase tracking-wider font-extrabold text-[10px]">
                  <th className="py-3 px-2">Image</th>
                  <th>Product Identification</th>
                  <th>Category Group</th>
                  <th>Price Value</th>
                  <th className="text-center w-48">Apiary Stock Controller</th>
                  <th className="text-right">Database Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-honey-brown/5 text-honey-brown/85">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs italic text-honey-brown/40">
                      No matching products discovered in active catalog warehouses.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLowStock = p.inventory < 15 && p.inventory > 0;
                    const isOutOfStock = p.inventory === 0;

                    return (
                      <tr key={p.id} className="hover:bg-honey-warm/10 transition-colors">
                        <td className="py-4 px-2">
                          <img src={p.image} alt="" className="w-12 h-12 object-cover rounded-xl border border-honey-brown/10" referrerPolicy="no-referrer" />
                        </td>
                        <td className="pr-3">
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-sm text-honey-brown dark:text-white leading-snug">{p.name}</h4>
                            <p className="text-[10px] text-honey-brown/50 italic">{p.tamilName}</p>
                            <p className="text-[9px] text-[#4E2F12]/60 dark:text-[#D4A017]/80 font-mono">ID: {p.id}</p>
                          </div>
                        </td>
                        <td className="pr-2 font-bold text-forest-green">
                          <span className="bg-forest-green/10 px-2 py-0.5 rounded text-[10px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="font-mono font-bold text-honey-brown dark:text-white">
                          ₹{p.price}
                        </td>
                        
                        {/* THE STOCK ADJUSTMENT CELL */}
                        <td className="pr-4 py-4">
                          <div className="flex flex-col items-center gap-1.5 justify-center">
                            
                            {/* Stock status indicator badges */}
                            <div className="flex gap-1.5 items-center">
                              {isOutOfStock && (
                                <span className="px-2 py-0.5 bg-red-150 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-extrabold text-[9px] uppercase tracking-wider rounded-full animate-pulse border border-red-300">
                                  Out of Stock 🚨
                                </span>
                              )}
                              {isLowStock && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300 font-extrabold text-[9px] uppercase tracking-wider rounded-full border border-amber-300">
                                  Low Stock Warning
                                </span>
                              )}
                              {!isLowStock && !isOutOfStock && (
                                <span className="px-2 py-0.5 bg-green-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 font-extrabold text-[9px] uppercase tracking-wider rounded-full border border-green-300">
                                  Warehouse Healthy
                                </span>
                              )}
                            </div>

                            {/* ADJUSTER ACTION CONTROLS */}
                            <div className="flex items-center gap-1 bg-honey-warm/15 dark:bg-black/25 p-1 rounded-xl w-full max-w-[170px] justify-between">
                              <button
                                onClick={() => adjustStock(p, -1)}
                                type="button"
                                className="p-1 text-honey-brown dark:text-honey-gold hover:bg-[#4E2F12]/10 rounded-lg font-bold"
                                title="Reduce 1"
                              >
                                <Minus size={12} />
                              </button>
                              
                              <input
                                type="text"
                                value={p.inventory}
                                onChange={(e) => setExactStock(p, e.target.value)}
                                className="w-12 text-center bg-transparent border-none text-xs font-black font-mono text-honey-brown dark:text-white select-all focus:ring-0 focus:outline-none"
                              />

                              <button
                                onClick={() => adjustStock(p, 1)}
                                type="button"
                                className="p-1 text-honey-brown dark:text-honey-gold hover:bg-[#4E2F12]/10 rounded-lg"
                                title="Increase 1"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* QUANTITY BULK SETTERS FOR QUICK MANAGEMENT */}
                            <div className="flex gap-1 justify-center text-[9px] font-bold text-honey-brown/50">
                              <button
                                onClick={() => adjustStock(p, 10)}
                                type="button"
                                className="px-1.5 py-0.5 bg-honey-warm/10 dark:bg-black/20 hover:bg-honey-brown hover:text-white rounded border border-honey-brown/10 select-none leading-none"
                              >
                                +10
                              </button>
                              <button
                                onClick={() => adjustStock(p, 50)}
                                type="button"
                                className="px-1.5 py-0.5 bg-honey-warm/10 dark:bg-black/20 hover:bg-honey-brown hover:text-white rounded border border-honey-brown/10 select-none leading-none"
                              >
                                +50
                              </button>
                              <button
                                onClick={() => adjustStock(p, -10)}
                                type="button"
                                className="px-1.5 py-0.5 bg-honey-warm/10 dark:bg-black/20 hover:bg-honey-brown hover:text-white rounded border border-honey-brown/10 select-none leading-none"
                              >
                                -10
                              </button>
                            </div>

                          </div>
                        </td>

                        {/* DELETE & EDIT CONTROLS */}
                        <td className="text-right py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEditing(p)}
                              className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition"
                              title="Edit product parameters"
                            >
                              <Edit2 size={13} />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition"
                              title="Delete from active database"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ======================= SUB TAB 3: SPECIFICATIONS FORM ======================= */}
      {activeAdminSubTab === 'catalog-form' && (
        <div className="bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/5 shadow-sm space-y-8 animate-fade-in">
          
          <div className="border-b border-honey-brown/5 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-lg text-honey-brown dark:text-white uppercase tracking-wider">
                {editingProduct ? `Edit Specifications: ${editingProduct.name}` : 'Provision New Honey Product'}
              </h3>
              <p className="text-[11px] text-honey-brown/65 dark:text-honey-warm/65">
                Set active ingredients formula records, retail pricing catalogs, and immediate inventory warehouse numbers.
              </p>
            </div>
            {editingProduct && (
              <button
                onClick={resetForm}
                className="px-3.5 py-1 text-[10px] font-black uppercase text-red-650 tracking-wider bg-red-100 hover:bg-red-200 border border-red-200 rounded-lg transition-all"
              >
                Cancel Edit Mode
              </button>
            )}
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-6 text-xs font-semibold">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Product Display Name (English) *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Raw Thulasi Honey"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Display Tamil script representation *</label>
                  <input
                    required
                    type="text"
                    placeholder="உதாரணம்: துளசி தேன்"
                    value={prodTamil}
                    onChange={(e) => setProdTamil(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Standard Price (INR) *</label>
                    <input
                      required
                      type="number"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Stock Warehouse Inventory Count *</label>
                    <input
                      required
                      type="number"
                      value={prodInventory}
                      onChange={(e) => setProdInventory(Number(e.target.value))}
                      className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Primary Category Group</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15"
                  >
                    <option value="Raw Wild Honey">Raw Wild Honey</option>
                    <option value="Organic Infusions">Organic Infusions</option>
                    <option value="Herbal Energetics">Herbal Energetics</option>
                    <option value="Beekeeping Specialties">Beekeeping Specialties</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Ingredients (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Organic thulasi pollens, pure unheated honey comb"
                    value={prodIngredients}
                    onChange={(e) => setProdIngredients(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                  />
                </div>
              </div>

              {/* COLUMN RIGHT: Image and descriptive cover options */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Image Cover URL Link *</label>
                  <input
                    required
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition font-mono text-[10px]"
                  />
                </div>

                {/* Cover presets visual selector */}
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-honey-brown/65">Or select a preset natural apiary photo:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_COVERS.map(cover => (
                      <button
                        key={cover.name}
                        type="button"
                        onClick={() => setProdImage(cover.url)}
                        className={`p-1 bg-honey-warm/5 border rounded-lg text-center overflow-hidden transition font-semibold text-[9px] ${
                          prodImage === cover.url 
                            ? 'border-honey-brown bg-honey-gold/10 font-bold' 
                            : 'border-honey-brown/5 hover:border-honey-gold/20'
                        }`}
                      >
                        <img 
                          src={cover.url} 
                          alt="" 
                          className="w-full h-10 object-cover rounded mb-1" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="line-clamp-1 truncate">{cover.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Short Botanical Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Introduce botanical qualities, seasonal extraction schedules, and medical parameters..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 text-xs rounded-xl border border-[#4E2F12]/15 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                  />
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-honey-brown/5 flex justify-end">
              <button
                type="submit"
                className="px-6 py-4 rounded-xl bg-[#2E7D32] hover:bg-emerald-800 text-white font-extrabold tracking-wider text-xs uppercase shadow transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={15} />
                {editingProduct ? 'Update Product Records ➔' : 'Create Live Catalog Item ➔'}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* ======================= SUB TAB 4: ACTIVE ORDER LEDGER ======================= */}
      {activeAdminSubTab === 'orders' && (
        <div className="bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/5 shadow-sm space-y-6 animate-fade-in">
          
          <div className="border-b border-honey-brown/5 pb-4">
            <h3 className="font-heading font-black text-lg text-honey-brown dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle size={18} className="text-[#2E7D32]" /> Active WhatsApp Client Invoices
            </h3>
            <p className="text-[11px] text-honey-brown/65 dark:text-honey-warm/65">
              Confirm client PIN code regions, log payment tracking screenshot proof, and update delivery dispatch pipelines.
            </p>
          </div>

          <div className="overflow-x-auto text-xs font-sans">
            {loading ? (
              <p className="text-xs text-honey-brown/40 italic py-6">Connecting database indexers...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-honey-brown/40 italic py-12 text-center">No transactions available inside records.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-honey-brown/10 text-honey-brown/50 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="py-2.5 px-2">Order Info</th>
                    <th>Customer Location Details</th>
                    <th>Ordered Items Stack</th>
                    <th>Invoice Cost</th>
                    <th>UPI Screenshot</th>
                    <th>Logistics Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-honey-brown/5 text-honey-brown/85">
                  {orders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-honey-warm/10 transition-colors">
                      <td className="py-4 px-2 pr-3">
                        <p className="font-mono font-bold text-honey-brown dark:text-honey-gold">{ord.orderId}</p>
                        <p className="text-[10px] text-honey-brown/45">{new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="pr-3">
                        <p className="font-bold text-honey-brown dark:text-white text-sm">{ord.customerName}</p>
                        <p className="text-[10px] text-honey-brown/60 dark:text-honey-warm/60 mt-0.5 leading-normal">
                          📍 {ord.address}, {ord.district}, {ord.state} - <strong className="font-mono">{ord.pincode}</strong>
                        </p>
                        <p className="text-[10px] font-bold text-[#2E7D32] hover:underline mt-0.5" title="WhatsApp Phone">
                          📞 {ord.phone}
                        </p>
                      </td>
                      <td className="pr-3 max-w-[200px]">
                        <div className="space-y-1">
                          {ord.items.map((item, id) => (
                            <div key={id} className="text-[10px] text-honey-brown/70 dark:text-honey-warm/80 leading-tight">
                              • {item.name} <strong>x{item.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="font-mono font-bold text-honey-brown dark:text-white">
                        ₹{ord.totalAmount}
                      </td>
                      <td className="pr-2">
                        {ord.upiScreenshot ? (
                          <button
                            onClick={() => setSelectedProofUrl(ord.upiScreenshot || '')}
                            className="px-2.5 py-1.5 bg-[#FFF8E7] text-honey-brown text-[10px] hover:bg-honey-brown hover:text-white font-bold rounded-lg border border-honey-brown/10 uppercase transition flex items-center gap-1 shrink-0"
                          >
                            <Eye size={12} /> View Proof
                          </button>
                        ) : (
                          <span className="text-red-500 text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded-full">No Proof</span>
                        )}
                      </td>
                      <td>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                          className={`p-2 text-[10px] font-bold rounded-xl outline-none select-none ${
                            ord.status === OrderStatus.DELIVERED ? 'bg-green-50 text-emerald-700 dark:bg-emerald-950/20' :
                            ord.status === OrderStatus.SHIPPED ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20' :
                            'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                          }`}
                        >
                          <option value={OrderStatus.PENDING}>Pending</option>
                          <option value={OrderStatus.PROCESSING}>Processing</option>
                          <option value={OrderStatus.SHIPPED}>Shipped</option>
                          <option value={OrderStatus.DELIVERED}>Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

      {/* UPI PROOF INVOICE POPUP MODAL SCREEN */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-transparent" onClick={() => setSelectedProofUrl(null)} />
          
          <div className="relative bg-white dark:bg-charcoal p-6 max-w-lg w-full rounded-3xl text-center space-y-4 z-10 border border-honey-gold/30 shadow-2xl">
            <div className="flex justify-between items-center border-b border-honey-brown/5 pb-2">
              <h4 className="font-heading font-black text-honey-brown dark:text-white uppercase tracking-wider text-xs">UPI Screenshot Audit</h4>
              <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold">LEGIT AUDIT</span>
            </div>
            
            <div className="w-full aspect-square max-h-[380px] overflow-hidden rounded bg-black relative flex items-center justify-center border border-honey-brown/10">
              <img 
                src={selectedProofUrl} 
                alt="UPI Payment screenshot proof" 
                className="max-w-full max-h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>

            <button
              onClick={() => setSelectedProofUrl(null)}
              className="w-full py-3 hover:bg-red-50 text-[#4E2F12] hover:text-red-600 rounded-xl text-xs font-black uppercase tracking-wider border border-honey-brown/10 uppercase select-none transition"
            >
              Close Ledger View
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
