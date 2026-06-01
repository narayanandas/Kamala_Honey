import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavTab, Product, Order, UserProfile, OrderItem, OrderStatus, Review } from '../types';
import { dbStore } from './dbStore';
import { auth, isPlaceholderConfig } from './firebase';

interface StoreContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Products
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Cart State
  cart: OrderItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalBeforeCoupon: number;
  cartTotalAfterCoupon: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponDiscount: number; // Percentage, e.g. 10 for 10%
  applyCoupon: (code: string) => boolean;
  shippingCost: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Auth User
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  loginAdminWithPhoneAndPassword: (phone: string, password: string) => Promise<boolean>;
  resetAdminPassword: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Orders
  orders: Order[];
  refreshOrders: () => void;
  placeOrder: (customerDetails: {
    name: string;
    phone: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    paymentProof?: string;
  }) => Promise<Order>;
  editOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceSort: string; // 'none' | 'low-high' | 'high-low' | 'best-selling'
  setPriceSort: (sort: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Default Mock User Profiles
const MOCK_CUSTOMER: UserProfile = {
  uid: 'cust-demo',
  email: 'karthik.bala@gmail.com',
  name: 'Karthikeyan Bala',
  phone: '9845112233',
  address: '24 South Car Street, Near Nellaiyappar Temple',
  district: 'Thirunelveli',
  state: 'Tamil Nadu',
  pincode: '627002',
  role: 'customer'
};

const MOCK_ADMIN: UserProfile = {
  uid: 'admin-default',
  email: 'admin@kamalahoney.com',
  name: 'Kamala Admin',
  phone: '7708510872',
  address: 'Thirunelveli Farm Gate',
  district: 'Thirunelveli',
  state: 'Tamil Nadu',
  pincode: '627001',
  role: 'admin'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Products listing
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Search, category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceSort, setPriceSort] = useState('none');
  const [maxPrice, setMaxPrice] = useState(600);

  // Cart
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('kamala_honey_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0); // e.g. 10 for 10%
  const [shippingCost, setShippingCost] = useState(50); // Flat shipping default, free above 1000

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch initial products and orders
  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    const data = await dbStore.getAllProducts();
    setProducts(data);
    setIsLoadingProducts(false);
  };

  const refreshOrders = async () => {
    const data = await dbStore.getAllOrders();
    setOrders(data);
  };

  useEffect(() => {
    localStorage.setItem('kamala_honey_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    refreshProducts();
    refreshOrders();
  }, []);

  // Set default wishlist
  useEffect(() => {
    if (currentUser) {
      dbStore.getWishlist(currentUser.uid).then(ids => {
        setWishlist(ids);
      });
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  // Adjust dark/light theme classes on body
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Auth controls
  const loginAdminWithPhoneAndPassword = async (phone: string, password: string): Promise<boolean> => {
    const admin = await dbStore.validateAdminLogin(phone, password);
    if (admin) {
      setCurrentUser(admin);
      setActiveTab(NavTab.ADMIN);
      return true;
    }
    return false;
  };

  const handleResetAdminPassword = async (phone: string, queryNewPassword: string): Promise<boolean> => {
    return await dbStore.resetAdminPassword(phone, queryNewPassword);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab(NavTab.HOME);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profileData } as UserProfile;
    await dbStore.saveUserProfile(updated);
    setCurrentUser(updated);
  };

  // Admin capabilities
  const handleAddProduct = async (p: Product) => {
    await dbStore.addProduct(p);
    await refreshProducts();
  };

  const handleUpdateProduct = async (p: Product) => {
    await dbStore.updateProduct(p);
    await refreshProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    await dbStore.deleteProduct(id);
    await refreshProducts();
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.inventory) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          tamilName: product.tamilName,
          price: product.price,
          quantity,
          image: product.image
        }
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalBeforeCoupon = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate shipping cost: Free shipping for orders above ₹1000, otherwise ₹50
  useEffect(() => {
    if (cartTotalBeforeCoupon === 0) {
      setShippingCost(0);
    } else if (cartTotalBeforeCoupon >= 1000) {
      setShippingCost(0);
    } else {
      setShippingCost(50);
    }
  }, [cartTotalBeforeCoupon]);

  const discountAmount = Math.round(cartTotalBeforeCoupon * (couponDiscount / 100));
  const cartTotalAfterCoupon = cartTotalBeforeCoupon - discountAmount + shippingCost;

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'HONEY10') {
      setCouponCode('HONEY10');
      setCouponDiscount(10);
      return true;
    } else if (normalized === 'FREESHIP') {
      setCouponCode('FREESHIP');
      setShippingCost(0);
      return true;
    } else if (normalized === 'FESTIVE15') {
      setCouponCode('FESTIVE15');
      setCouponDiscount(15);
      return true;
    }
    return false;
  };

  // Wishlist
  const toggleWishlist = async (productId: string) => {
    if (!currentUser) return;
    const list = await dbStore.toggleWishlistItem(currentUser.uid, productId);
    setWishlist(list);
  };

  // Placing Orders
  const placeOrder = async (customerDetails: {
    name: string;
    phone: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    paymentProof?: string;
  }) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const orderId = `KM-${dateStr}-${randomNum}`;

    const newOrder: Order = {
      orderId,
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,
      district: customerDetails.district,
      state: customerDetails.state,
      pincode: customerDetails.pincode,
      items: [...cart],
      totalAmount: cartTotalAfterCoupon,
      status: OrderStatus.PENDING,
      upiScreenshot: customerDetails.paymentProof || '',
      userId: currentUser?.uid || 'guest',
      createdAt: new Date().toISOString()
    };

    await dbStore.createOrder(newOrder);
    
    // Decrease inventory counts locally for ordered items
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(ci => ci.productId === p.id);
      if (cartItem) {
        return { ...p, inventory: Math.max(0, p.inventory - cartItem.quantity) };
      }
      return p;
    });
    
    for (const p of updatedProducts) {
      await dbStore.updateProduct(p);
    }

    setProducts(updatedProducts);
    await refreshOrders();
    clearCart();
    return newOrder;
  };

  const editOrderStatus = async (orderId: string, status: OrderStatus) => {
    await dbStore.updateOrderStatus(orderId, status);
    await refreshOrders();
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        products,
        isLoadingProducts,
        refreshProducts,
        addProduct: handleAddProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
        selectedProductId,
        setSelectedProductId,
        
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotalBeforeCoupon,
        cartTotalAfterCoupon,
        couponCode,
        setCouponCode,
        couponDiscount,
        applyCoupon,
        shippingCost,

        wishlist,
        toggleWishlist,

        currentUser,
        setCurrentUser,
        loginAdminWithPhoneAndPassword,
        resetAdminPassword: handleResetAdminPassword,
        logout,
        updateProfile,

        orders,
        refreshOrders,
        placeOrder,
        editOrderStatus,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceSort,
        setPriceSort,
        maxPrice,
        setMaxPrice
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
