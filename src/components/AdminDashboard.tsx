import React, { useState, useEffect } from 'react';
import { useStore } from '../services/storeContext';
import { dbStore } from '../services/dbStore';
import { Order, OrderStatus, Product } from '../types';
import { ShieldCheck, PlusCircle, Trash2, Edit2, TrendingUp, DollarSign, Package, Star, MessageSquare } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    setProducts,
    activeTab
  } = useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Selected Invoice receipt modal preview
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  // New product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdTamil, setNewProdTamil] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(400);
  const [newProdCategory, setNewProdCategory] = useState('Raw Wild Honey');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=500');
  const [newProdInventory, setNewProdInventory] = useState(50);
  const [newProdIngredients, setNewProdIngredients] = useState('');

  // Sync orders on mount
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      setLoading(true);
      dbStore.getAllOrders()
        .then(setOrders)
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  // Total sales revenue accumulator
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

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

  // Create new product addition callback
  const handleAddNewProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdCategory.trim() || !newProdPrice) {
      alert('Please fill out required fields.');
      return;
    }

    const ingList = newProdIngredients
      ? newProdIngredients.split(',').map(s => s.trim())
      : ['Pure Organics', 'Natural Pollens'];

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      tamilName: newProdTamil.trim() || newProdName.trim(),
      price: Number(newProdPrice),
      description: newProdDesc.trim() || 'Directly packed under strict botanical and sanitary control in Kamala Farm apiary.',
      category: newProdCategory.trim(),
      rating: 5,
      image: newProdImage.trim(),
      isBestSeller: false,
      inventory: Number(newProdInventory),
      ingredients: ingList
    };

    await dbStore.addProduct(newProd);
    const updated = await dbStore.getAllProducts();
    setProducts(updated);
    
    // Clear state
    setNewProdName('');
    setNewProdTamil('');
    setNewProdPrice(400);
    setNewProdDesc('');
    setNewProdInventory(50);
    setNewProdIngredients('');
    setShowAddForm(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product from active database?')) {
      await dbStore.deleteProduct(id);
      const updated = await dbStore.getAllProducts();
      setProducts(updated);
    }
  };

  // Secure validation check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
        <span className="text-4xl">🛑</span>
        <h2 className="text-xl font-black text-honey-brown font-heading">Authorized Personnel Only</h2>
        <p className="text-xs text-honey-brown/65 leading-relaxed font-sans">
          This system endpoint contains transaction ledger matrices restricted only for Kamala Farm Administrators. Log in using an Admin profile to bypass this security gate.
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-10">
      
      {/* Head section */}
      <div className="border-b border-honey-brown/10 dark:border-honey-gold/10 pb-5">
        <span className="text-xs text-forest-green font-bold uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck size={14} /> Backoffice Control Suite
        </span>
        <h2 className="text-3xl font-black text-honey-brown dark:text-white font-heading mt-0.5">
          Kamala Farm Administration Ledger
        </h2>
        <p className="text-xs text-honey-brown/65 dark:text-honey-warm/65">
          Configure active products, audit UPI transaction payment screenshots, and finalize order logistics.
        </p>
      </div>

      {/* STATS TILES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">Aggregate Sales</span>
            <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono block mt-1">₹{totalRevenue}</span>
            <span className="text-[10px] text-forest-green font-semibold">↑ Verified orders live</span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-350 rounded-xl">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">Completed Orders</span>
            <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono block mt-1">{orders.length}</span>
            <span className="text-[10px] text-honey-brown/40 font-semibold font-sans">Invoices saved</span>
          </div>
          <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-350 rounded-xl">
            <Package size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">In-Stock Catalog</span>
            <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono block mt-1">{products.length}</span>
            <span className="text-[10px] text-forest-green font-semibold">Active jar offerings</span>
          </div>
          <div className="p-3 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-350 rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-black uppercase tracking-wider block">Awaiting Dispatch</span>
            <span className="text-2xl font-black text-red-500 font-mono block mt-1">
              {orders.filter(o => o.status === OrderStatus.PENDING).length}
            </span>
            <span className="text-[10px] text-red-500 font-semibold">Pending verification</span>
          </div>
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-350 rounded-xl">
            <Package size={20} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ORDER LOGS LIST PANEL */}
        <div className="lg:col-span-8 bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 shadow-sm space-y-4 overflow-x-auto">
          <div className="flex justify-between items-center border-b border-honey-brown/5 pb-3">
            <h3 className="font-heading font-black text-sm uppercase text-honey-brown dark:text-white">Active Order Ledger</h3>
            <span className="text-[10px] font-bold text-honey-brown/50">Scroll horizontally if viewing on phone</span>
          </div>

          {loading ? (
            <p className="text-xs text-honey-brown/40 italic py-6">Connecting database indexers...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-honey-brown/40 italic py-6 text-center">No transactions available.</p>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-honey-brown/10 text-honey-brown/50 uppercase tracking-wider font-extrabold text-[10px]">
                  <th className="py-2">Order Info</th>
                  <th>Customer Address</th>
                  <th>Total Cost</th>
                  <th>UPI Reciept</th>
                  <th>Logistics Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-honey-brown/5 text-honey-brown/85">
                {orders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-honey-warm/15">
                    <td className="py-3 pr-3">
                      <p className="font-mono font-bold text-honey-brown dark:text-honey-gold">{ord.orderId}</p>
                      <p className="text-[10px] text-honey-brown/40">{new Date(ord.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="pr-3">
                      <p className="font-bold text-honey-brown dark:text-white">{ord.customerName}</p>
                      <p className="text-[10px] text-honey-brown/50 line-clamp-1">{ord.address}, {ord.district}</p>
                    </td>
                    <td className="font-mono font-bold text-honey-brown dark:text-white">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="pr-2">
                      {ord.upiScreenshot ? (
                        <button
                          onClick={() => setSelectedProofUrl(ord.upiScreenshot || '')}
                          className="px-2.5 py-1 bg-honey-gold/25 text-honey-brown text-[10px] font-bold rounded border border-honey-brown/10 uppercase"
                        >
                          View Screenshot
                        </button>
                      ) : (
                        <span className="text-red-500 text-[10px]">No Proof</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                        className={`p-1 text-[10px] font-bold rounded ${
                          ord.status === OrderStatus.DELIVERED ? 'bg-green-50 text-emerald-700' :
                          ord.status === OrderStatus.SHIPPED ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'
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

        {/* PRODUCTS MANAGEMENT SUITE */}
        <div className="lg:col-span-4 bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-honey-brown/5 pb-3">
            <h3 className="font-heading font-black text-sm uppercase text-honey-brown dark:text-white">Catalog Manager</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs text-forest-green font-bold flex items-center gap-1 hover:underline"
            >
              <PlusCircle size={14} /> {showAddForm ? 'Hide' : 'Add Item'}
            </button>
          </div>

          {/* ADD PRODUCT EXPANDABLE FORM */}
          {showAddForm && (
            <form onSubmit={handleAddNewProductSubmit} className="space-y-3 bg-honey-warm/15 p-4 rounded-2xl text-xs font-semibold">
              <span className="text-[10px] font-black uppercase text-honey-brown tracking-wider">New Honey Product Specs</span>
              
              <div>
                <label className="block text-[10px] text-honey-brown/60 mb-1">Product Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Raw Thulasi Honey"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-honey-brown/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-honey-brown/60 mb-1">Name in Tamil script *</label>
                <input
                  required
                  type="text"
                  placeholder="உதாரணம்: துளசி தேன்"
                  value={newProdTamil}
                  onChange={(e) => setNewProdTamil(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-honey-brown/10 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-honey-brown/60 mb-1">Price (INR) *</label>
                  <input
                    required
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-honey-brown/10 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-honey-brown/60 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-honey-brown/10 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-honey-brown/60 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Raw Wild Honey"
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-honey-brown/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-honey-brown/60 mb-1">Formula Ingredients (comma separated)</label>
                <input
                  type="text"
                  placeholder="Organic Thulasi extract, raw comb honey"
                  value={newProdIngredients}
                  onChange={(e) => setNewProdIngredients(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-honey-brown/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-honey-brown/60 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-honey-brown/10 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-forest-green text-white font-black uppercase text-[10px]"
              >
                Add to Stock Catalog
              </button>
            </form>
          )}

          {/* ACTIVE PRODUCTS LIST */}
          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-3 border border-honey-brown/5 bg-honey-warm/5 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-md" />
                  <div>
                    <h4 className="font-bold text-honey-brown dark:text-white line-clamp-1">{p.name}</h4>
                    <p className="text-[10px] text-honey-brown/40">Price: ₹{p.price} | Stock: {p.inventory}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="p-2 text-honey-brown/30 hover:text-red-500 rounded-lg hover:bg-red-50"
                  title="Remove product"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* UPI PROOF INVOICE POPUP MODAL SCREEN */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setSelectedProofUrl(null)} />
          
          <div className="relative bg-white dark:bg-charcoal p-6 max-w-lg w-full rounded-2xl text-center space-y-4 z-10 border border-honey-gold/30">
            <h4 className="font-heading font-black text-honey-brown dark:text-white">UPI Payment Screenshot Tally</h4>
            
            <div className="w-full aspect-square max-h-[380px] overflow-hidden rounded bg-black relative flex items-center justify-center">
              <img src={selectedProofUrl} alt="UPI Payment screenshot proof" className="max-w-full max-h-full object-contain" />
            </div>

            <button
              onClick={() => setSelectedProofUrl(null)}
              className="px-5 py-2 hover:bg-red-50 text-red-650 rounded-lg text-xs font-bold border border-red-200/50 uppercase select-none"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
