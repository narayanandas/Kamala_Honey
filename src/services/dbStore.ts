import { Product, Order, UserProfile, Review, Wishlist, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper to get or initialize client local storage keys
const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'kamala_honey_products',
  ORDERS: 'kamala_honey_orders',
  REVIEWS: 'kamala_honey_reviews',
  WISHLISTS: 'kamala_honey_wishlists',
  USERS: 'kamala_honey_users',
  CURRENT_USER: 'kamala_honey_current_user'
};

const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed initial products if localStorage is empty
const existingLocalProducts = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
if (!existingLocalProducts) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
} else {
  try {
    const parsed: Product[] = JSON.parse(existingLocalProducts);
    const needsImageSync = INITIAL_PRODUCTS.some(initProd => {
      const existing = parsed.find(p => p.id === initProd.id);
      return existing && existing.image !== initProd.image;
    });
    if (needsImageSync) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
  } catch (e) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
}

// Seed admin user profile in local storage profiles
const localUsers: Record<string, UserProfile> = getLocalStorage(LOCAL_STORAGE_KEYS.USERS, {
  'admin-default': {
    uid: 'admin-default',
    email: 'admin@kamalahoney.com',
    name: 'Kamala Admin',
    phone: '7708510872',
    address: 'Thirunelveli Farm Gate',
    district: 'Thirunelveli',
    state: 'Tamil Nadu',
    pincode: '627001',
    role: 'admin',
    password: 'admin123'
  }
});

// Seed some initial reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-theen-nelli-big',
    reviewerName: 'Subramanian S.',
    rating: 5,
    comment: 'The big amla pieces are extremely soft and saturated with pure honey. Truly exceptional taste from Thirunelveli!',
    createdAt: '2026-05-12T10:00:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-raja-rani-mix',
    reviewerName: 'Gayathri M.',
    rating: 5,
    comment: 'This Raja Rani Mix is a true immunity booster. The nuts remained crunchy, children loved it!',
    createdAt: '2026-05-24T14:30:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-theen-inji',
    reviewerName: 'Dr. Ramesh Kumar',
    rating: 4,
    comment: 'Perfect traditional blend of ginger and farm-pure honey. Excellent for throat relief and respiratory ease.',
    createdAt: '2026-05-26T08:15:00Z'
  }
];

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS)) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
}

// Seed initial orders (one test order)
const INITIAL_ORDERS: Order[] = [
  {
    orderId: 'KM-260527-814',
    customerName: 'Karthikeyan Bala',
    phone: '9845112233',
    address: '24 South Car Street',
    district: 'Thirunelveli',
    state: 'Tamil Nadu',
    pincode: '627002',
    items: [
      {
        productId: 'prod-raja-rani-mix',
        name: 'Raja Rani Mix',
        tamilName: 'ராஜாராணி மிக்ஸ்',
        price: 550,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1596450514943-ac434a2c07d5?auto=format&fit=crop&q=80&w=500'
      },
      {
        productId: 'prod-theen-nelli-big',
        name: 'Theen Nelli (Big Amla Honey)',
        tamilName: 'தேன் நெல்லிக்காய் - பெரியது',
        price: 440,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=500'
      }
    ],
    totalAmount: 1430,
    status: OrderStatus.DELIVERED,
    userId: 'cust-demo',
    createdAt: '2026-05-26T12:00:00Z'
  }
];

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS)) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
}

// Unified Database Store using Supabase with local fallback
export const dbStore = {
  // PRODUCTS
  async getAllProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            tamilName: row.tamil_name || row.tamilName || row.name,
            price: Number(row.price),
            description: row.description || 'Directly packed under strict botanical and sanitary control in Kamala Farm apiary.',
            category: row.category || 'Raw Wild Honey',
            rating: Number(row.rating || 5),
            image: row.image || 'https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=500',
            inventory: Number(row.stock !== undefined ? row.stock : (row.inventory !== undefined ? row.inventory : 50)),
            ingredients: Array.isArray(row.ingredients) ? row.ingredients : (row.ingredients ? (typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : [row.ingredients]) : ['Pure Organics']),
            isBestSeller: !!(row.is_best_seller || row.isBestSeller)
          }));
          return mapped;
        } else if (error) {
          console.warn('Supabase query failed, falling back to local storage:', error.message);
        }
      } catch (err) {
        console.error('Supabase fetch exception, falling back to local storage:', err);
      }
    }
    return getLocalStorage<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async addProduct(product: Product): Promise<void> {
    const list = getLocalStorage<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    list.push(product);
    setLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, list);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .insert([{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: Number(product.inventory),
            image: product.image,
            category: product.category,
            tamil_name: product.tamilName,
            description: product.description,
            rating: Number(product.rating || 5),
            ingredients: product.ingredients,
            is_best_seller: product.isBestSeller,
            isBestSeller: product.isBestSeller
          }]);
        if (error) {
          console.error('Supabase product add error:', error.message);
        }
      } catch (err) {
        console.error('Supabase product add exception:', err);
      }
    }
  },

  async updateProduct(product: Product): Promise<void> {
    const list = getLocalStorage<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = list.findIndex(p => p.id === product.id);
    if (index !== -1) {
      list[index] = product;
      setLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, list);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .upsert([{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: Number(product.inventory),
            image: product.image,
            category: product.category,
            tamil_name: product.tamilName,
            description: product.description,
            rating: Number(product.rating || 5),
            ingredients: product.ingredients,
            is_best_seller: product.isBestSeller,
            isBestSeller: product.isBestSeller
          }]);
        if (error) {
          console.error('Supabase product update error:', error.message);
        }
      } catch (err) {
        console.error('Supabase product update exception:', err);
      }
    }
  },

  async deleteProduct(id: string): Promise<void> {
    const list = getLocalStorage<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = list.filter(p => p.id !== id);
    setLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        if (error) {
          console.error('Supabase product delete error:', error.message);
        }
      } catch (err) {
        console.error('Supabase product delete exception:', err);
      }
    }
  },

  // USERS / PROFILES
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uid', uid)
          .maybeSingle();
        if (!error && data) {
          return {
            uid: data.uid,
            email: data.email,
            name: data.name,
            phone: data.phone,
            address: data.address,
            district: data.district,
            state: data.state,
            pincode: data.pincode,
            role: data.role,
            password: data.password
          };
        }
      } catch (err) {
        console.error('Supabase getUserProfile exception:', err);
      }
    }
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, localUsers);
    return users[uid] || null;
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, localUsers);
    users[profile.uid] = profile;
    setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('users')
          .upsert([{
            uid: profile.uid,
            email: profile.email,
            name: profile.name,
            phone: profile.phone,
            address: profile.address,
            district: profile.district,
            state: profile.state,
            pincode: profile.pincode,
            role: profile.role,
            password: profile.password
          }]);
        if (error) {
          console.error('Supabase saveUserProfile error:', error.message);
        }
      } catch (err) {
        console.error('Supabase saveUserProfile exception:', err);
      }
    }
  },

  async validateAdminLogin(phone: string, password: string): Promise<UserProfile | null> {
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, localUsers);
    const admin = Object.values(users).find(
      u => u.role === 'admin' && u.phone === phone && u.password === password
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'admin')
          .eq('phone', phone)
          .maybeSingle();
        
        if (!error && data) {
          if (data.password === password) {
            return {
              uid: data.uid,
              email: data.email,
              name: data.name,
              phone: data.phone,
              address: data.address,
              district: data.district,
              state: data.state,
              pincode: data.pincode,
              role: data.role,
              password: data.password
            };
          }
        } else if (!data && admin) {
          // Auto-seed admin user profile record to Supabase if verified locally but not yet in database
          await supabase.from('users').upsert([{
            uid: admin.uid,
            email: admin.email,
            name: admin.name,
            phone: admin.phone,
            address: admin.address,
            district: admin.district,
            state: admin.state,
            pincode: admin.pincode,
            role: admin.role,
            password: admin.password
          }]);
          return admin;
        }
      } catch (err) {
        console.warn('Supabase validateAdminLogin exception:', err);
      }
    }
    return admin || null;
  },

  async resetAdminPassword(phone: string, newPassword: string): Promise<boolean> {
    let success = false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ password: newPassword })
          .match({ role: 'admin', phone: phone });
        
        if (!error) {
          success = true;
        } else {
          const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, localUsers);
          const localAdmin = Object.values(users).find(u => u.role === 'admin' && u.phone === phone);
          if (localAdmin) {
            const seedAdmin = { ...localAdmin, password: newPassword };
            const { error: seedError } = await supabase
              .from('users')
              .upsert([{
                uid: seedAdmin.uid,
                email: seedAdmin.email,
                name: seedAdmin.name,
                phone: seedAdmin.phone,
                address: seedAdmin.address,
                district: seedAdmin.district,
                state: seedAdmin.state,
                pincode: seedAdmin.pincode,
                role: seedAdmin.role,
                password: seedAdmin.password
              }]);
            if (!seedError) success = true;
          }
        }
      } catch (err) {
        console.error('Supabase resetAdminPassword failed:', err);
      }
    }

    // Always sync with local storage as well
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, localUsers);
    const adminKey = Object.keys(users).find(k => users[k].role === 'admin' && users[k].phone === phone);
    if (adminKey) {
      users[adminKey].password = newPassword;
      setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
      success = true;
    }
    return success;
  },

  // ORDERS
  async createOrder(order: Order): Promise<void> {
    const list = getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    list.unshift(order);
    setLocalStorage(LOCAL_STORAGE_KEYS.ORDERS, list);

    if (isSupabaseConfigured && supabase) {
      try {
        const dbRow = {
          order_id: order.orderId,
          orderId: order.orderId,
          customer_name: order.customerName,
          customerName: order.customerName,
          phone: order.phone,
          address: order.address,
          district: order.district,
          state: order.state,
          pincode: order.pincode,
          total_amount: Number(order.totalAmount),
          totalAmount: Number(order.totalAmount),
          status: order.status,
          upi_screenshot: order.upiScreenshot || '',
          upiScreenshot: order.upiScreenshot || '',
          user_id: order.userId,
          userId: order.userId,
          created_at: order.createdAt,
          createdAt: order.createdAt,
          payment_method: order.paymentMethod || 'Manual',
          paymentMethod: order.paymentMethod || 'Manual',
          payment_status: order.paymentStatus || 'Unpaid',
          paymentStatus: order.paymentStatus || 'Unpaid',
          payment_id: order.paymentId || '',
          paymentId: order.paymentId || '',
          items: order.items
        };

        const { error } = await supabase
          .from('orders')
          .insert([dbRow]);
        if (error) {
          console.error('Supabase createOrder error:', error.message);
        }
      } catch (err) {
        console.error('Supabase createOrder exception:', err);
      }
    }
  },

  async getAllOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped: Order[] = data.map((row: any) => ({
            orderId: row.order_id || row.orderId,
            customerName: row.customer_name || row.customerName,
            phone: row.phone,
            address: row.address,
            district: row.district,
            state: row.state,
            pincode: row.pincode,
            totalAmount: Number(row.total_amount || row.totalAmount),
            status: row.status as OrderStatus,
            upiScreenshot: row.upi_screenshot || row.upiScreenshot || '',
            userId: row.user_id || row.userId,
            createdAt: row.created_at || row.createdAt,
            paymentMethod: row.payment_method || row.paymentMethod || 'Manual',
            paymentStatus: (row.payment_status || row.paymentStatus || 'Unpaid') as any,
            paymentId: row.payment_id || row.paymentId || '',
            items: Array.isArray(row.items) ? row.items : (row.items ? (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) : [])
          }));
          return mapped;
        }
      } catch (err) {
        console.error('Supabase getAllOrders exception:', err);
      }
    }
    return getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        let resData = data;
        if ((error || !data || data.length === 0)) {
          const { data: altData } = await supabase
            .from('orders')
            .select('*')
            .eq('userId', userId);
          if (altData) resData = altData;
        }

        if (resData) {
          const mapped: Order[] = resData.map((row: any) => ({
            orderId: row.order_id || row.orderId,
            customerName: row.customer_name || row.customerName,
            phone: row.phone,
            address: row.address,
            district: row.district,
            state: row.state,
            pincode: row.pincode,
            totalAmount: Number(row.total_amount || row.totalAmount),
            status: row.status as OrderStatus,
            upiScreenshot: row.upi_screenshot || row.upiScreenshot || '',
            userId: row.user_id || row.userId,
            createdAt: row.created_at || row.createdAt,
            paymentMethod: row.payment_method || row.paymentMethod || 'Manual',
            paymentStatus: (row.payment_status || row.paymentStatus || 'Unpaid') as any,
            paymentId: row.payment_id || row.paymentId || '',
            items: Array.isArray(row.items) ? row.items : (row.items ? (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) : [])
          }));
          return mapped;
        }
      } catch (err) {
        console.error('Supabase getOrdersByUserId exception:', err);
      }
    }
    const orders = getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return orders.filter(o => o.userId === userId);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const list = getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const index = list.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      list[index].status = status;
      setLocalStorage(LOCAL_STORAGE_KEYS.ORDERS, list);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: status })
          .match({ order_id: orderId });
        if (error) {
          await supabase
            .from('orders')
            .update({ status: status })
            .match({ orderId: orderId });
        }
      } catch (err) {
        console.error('Supabase updateOrderStatus exception:', err);
      }
    }
  },

  // REVIEWS
  async getReviewsForProduct(productId: string): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });
        
        let resData = data;
        if (error || !data || data.length === 0) {
          const { data: altData } = await supabase
            .from('reviews')
            .select('*')
            .eq('productId', productId);
          if (altData && altData.length > 0) resData = altData;
        }

        if (resData && resData.length > 0) {
          const mapped: Review[] = resData.map((row: any) => ({
            id: row.id,
            productId: row.product_id || row.productId,
            reviewerName: row.reviewer_name || row.reviewerName,
            rating: Number(row.rating),
            comment: row.comment,
            createdAt: row.created_at || row.createdAt
          }));
          return mapped;
        }
      } catch (err) {
        console.error('Supabase getReviewsForProduct exception:', err);
      }
    }
    const reviews = getLocalStorage<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return reviews.filter(r => r.productId === productId);
  },

  async addReview(review: Review): Promise<void> {
    const reviews = getLocalStorage<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    reviews.push(review);
    setLocalStorage(LOCAL_STORAGE_KEYS.REVIEWS, reviews);
    
    // Dynamically update product average rating locally
    const pList = getLocalStorage<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const pIndex = pList.findIndex(p => p.id === review.productId);
    if (pIndex !== -1) {
      const pReviews = reviews.filter(r => r.productId === review.productId);
      const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
      pList[pIndex].rating = parseFloat(avg.toFixed(1));
      setLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, pList);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const dbRow = {
          id: review.id,
          product_id: review.productId,
          productId: review.productId,
          reviewer_name: review.reviewerName,
          reviewerName: review.reviewerName,
          rating: Number(review.rating),
          comment: review.comment,
          created_at: review.createdAt,
          createdAt: review.createdAt
        };

        const { error } = await supabase
          .from('reviews')
          .insert([dbRow]);
        if (error) {
          console.error('Supabase addReview error:', error.message);
        }
      } catch (err) {
        console.error('Supabase addReview exception:', err);
      }
    }
  },

  // WISHLIST
  async getWishlist(userId: string): Promise<string[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        let row = data;
        if (!row) {
          const { data: altData } = await supabase
            .from('wishlists')
            .select('*')
            .eq('userId', userId)
            .maybeSingle();
          if (altData) row = altData;
        }

        if (row) {
          const productIds = row.product_ids || row.productIds || [];
          return Array.isArray(productIds) ? productIds : (typeof productIds === 'string' ? JSON.parse(productIds) : []);
        }
      } catch (err) {
        console.error('Supabase getWishlist exception:', err);
      }
    }
    const wishlists = getLocalStorage<Record<string, string[]>>(LOCAL_STORAGE_KEYS.WISHLISTS, {
      'cust-demo': ['prod-raja-rani-mix']
    });
    return wishlists[userId] || [];
  },

  async toggleWishlistItem(userId: string, productId: string): Promise<string[]> {
    const current = await this.getWishlist(userId);
    const updated = current.includes(productId)
      ? current.filter(id => id !== productId)
      : [...current, productId];

    const wishlists = getLocalStorage<Record<string, string[]>>(LOCAL_STORAGE_KEYS.WISHLISTS, {
      'cust-demo': ['prod-raja-rani-mix']
    });
    wishlists[userId] = updated;
    setLocalStorage(LOCAL_STORAGE_KEYS.WISHLISTS, wishlists);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('wishlists')
          .upsert([{
            user_id: userId,
            user_id_column: userId,
            product_ids: updated,
            userId: userId,
            productIds: updated
          }]);
        if (error) {
          await supabase
            .from('wishlists')
            .upsert([{
              userId: userId,
              productIds: updated
            }]);
        }
      } catch (err) {
        console.error('Supabase toggleWishlistItem exception:', err);
      }
    }
    return updated;
  }
};

/**
 * =========================================================================
 * SUPABASE SQL SCHEMA BUILDER SCRIPT (COPY-PASTE IN YOUR SUPABASE PANEL)
 * =========================================================================
 * 
 * -- 1. Products Table
 * CREATE TABLE products (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   tamil_name TEXT,
 *   price NUMERIC NOT NULL DEFAULT 0,
 *   stock INTEGER NOT NULL DEFAULT 0,
 *   image TEXT,
 *   category TEXT,
 *   description TEXT,
 *   rating NUMERIC DEFAULT 5,
 *   ingredients JSONB DEFAULT '[]'::jsonb,
 *   is_best_seller BOOLEAN DEFAULT false,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Enable Row Level Security (RLS) for Products
 * ALTER TABLE products ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow public select product" ON products FOR SELECT USING (true);
 * CREATE POLICY "Allow public insert product" ON products FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow public update product" ON products FOR UPDATE USING (true);
 * CREATE POLICY "Allow public delete product" ON products FOR DELETE USING (true);
 * 
 * -- 2. Users Table
 * CREATE TABLE users (
 *   uid TEXT PRIMARY KEY,
 *   email TEXT,
 *   name TEXT,
 *   phone TEXT,
 *   address TEXT,
 *   district TEXT,
 *   state TEXT,
 *   pincode TEXT,
 *   role TEXT DEFAULT 'customer',
 *   password TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * ALTER TABLE users ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow public select users" ON users FOR SELECT USING (true);
 * CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow public update users" ON users FOR UPDATE USING (true);
 * CREATE POLICY "Allow public delete users" ON users FOR DELETE USING (true);
 * 
 * -- 3. Orders Table
 * CREATE TABLE orders (
 *   order_id TEXT PRIMARY KEY,
 *   customer_name TEXT,
 *   phone TEXT,
 *   address TEXT,
 *   district TEXT,
 *   state TEXT,
 *   pincode TEXT,
 *   total_amount NUMERIC NOT NULL DEFAULT 0,
 *   status TEXT DEFAULT 'Pending',
 *   upi_screenshot TEXT,
 *   user_id TEXT,
 *   payment_method TEXT,
 *   payment_status TEXT,
 *   payment_id TEXT,
 *   items JSONB DEFAULT '[]'::jsonb,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow public select orders" ON orders FOR SELECT USING (true);
 * CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true);
 * CREATE POLICY "Allow public delete orders" ON orders FOR DELETE USING (true);
 * 
 * -- 4. Reviews Table
 * CREATE TABLE reviews (
 *   id TEXT PRIMARY KEY,
 *   product_id TEXT,
 *   reviewer_name TEXT,
 *   rating NUMERIC NOT NULL DEFAULT 5,
 *   comment TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow public select reviews" ON reviews FOR SELECT USING (true);
 * CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow public update reviews" ON reviews FOR UPDATE USING (true);
 * 
 * -- 5. Wishlists Table
 * CREATE TABLE wishlists (
 *   user_id TEXT PRIMARY KEY,
 *   product_ids JSONB DEFAULT '[]'::jsonb,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow public select wishlists" ON wishlists FOR SELECT USING (true);
 * CREATE POLICY "Allow public insert wishlists" ON wishlists FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow public update wishlists" ON wishlists FOR UPDATE USING (true);
 * CREATE POLICY "Allow public delete wishlists" ON wishlists FOR DELETE USING (true);
 */
