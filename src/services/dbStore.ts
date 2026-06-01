import { db, isPlaceholderConfig, OperationType, handleFirestoreError, auth } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { Product, Order, UserProfile, Review, Wishlist, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper to get or initialize client local storage
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

// Seed initial products if localStorage is empty, or update images if they contain old patterns
const existingLocalProducts = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
if (!existingLocalProducts) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
} else {
  try {
    const parsed: Product[] = JSON.parse(existingLocalProducts);
    // Sync cached products with newest images from INITIAL_PRODUCTS if there is an image mismatch
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

// Seed admin user and guest user in local storage profiles
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
    role: 'admin'
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
    totalAmount: 1430, // 550 + 880
    status: OrderStatus.DELIVERED,
    userId: 'cust-demo',
    createdAt: '2026-05-26T12:00:00Z'
  }
];

if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS)) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
}

// Master DB operations class
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
            ingredients: Array.isArray(row.ingredients) ? row.ingredients : (row.ingredients ? JSON.parse(row.ingredients) : ['Pure Organics']),
            isBestSeller: !!row.isBestSeller
          }));
          return mapped;
        } else if (error) {
          console.warn('Supabase query failed, falling back to local storage:', error.message);
        }
      } catch (err) {
        console.error('Supabase fetch exception, falling back to local storage:', err);
      }
    }

    if (!isPlaceholderConfig && db) {
      const colPath = 'products';
      try {
        const querySnapshot = await getDocs(collection(db, colPath));
        const list: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        if (list.length > 0) return list;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    }
    // Fallback Local Mode
    return getLocalStorage<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async addProduct(product: Product): Promise<void> {
    // Save to local storage first for resilience
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
            stock: Number(product.inventory), // stock maps to product.inventory
            image: product.image,
            category: product.category,
            tamil_name: product.tamilName,
            description: product.description,
            rating: Number(product.rating || 5)
          }]);
        if (error) {
          console.error('Supabase write error, products stored offline:', error.message);
        }
      } catch (err) {
        console.error('Supabase write exception:', err);
      }
    }

    if (!isPlaceholderConfig && db) {
      const colPath = 'products';
      try {
        await setDoc(doc(db, colPath, product.id), product);
        return;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${colPath}/${product.id}`);
      }
    }
  },

  async updateProduct(product: Product): Promise<void> {
    // Save to local storage first for resilience
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
            stock: Number(product.inventory), // stock maps to product.inventory
            image: product.image,
            category: product.category,
            tamil_name: product.tamilName,
            description: product.description,
            rating: Number(product.rating || 5)
          }]);
        if (error) {
          console.error('Supabase upsert error, products stored offline:', error.message);
        }
      } catch (err) {
        console.error('Supabase upsert exception:', err);
      }
    }

    if (!isPlaceholderConfig && db) {
      const colPath = 'products';
      try {
        await setDoc(doc(db, colPath, product.id), product, { merge: true });
        return;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${colPath}/${product.id}`);
      }
    }
  },

  async deleteProduct(id: string): Promise<void> {
    // Save to local storage first for resilience
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
          console.error('Supabase delete error:', error.message);
        }
      } catch (err) {
        console.error('Supabase delete exception:', err);
      }
    }

    if (!isPlaceholderConfig && db) {
      const colPath = 'products';
      try {
        await deleteDoc(doc(db, colPath, id));
        return;
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `${colPath}/${id}`);
      }
    }
  },

  // USERS / PROFILES
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'users';
      try {
        const docRef = doc(db, colPath, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${colPath}/${uid}`);
      }
    }
    // Fallback Local Mode
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, localUsers);
    return users[uid] || null;
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'users';
      try {
        await setDoc(doc(db, colPath, profile.uid), profile, { merge: true });
        return;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${colPath}/${profile.uid}`);
      }
    }
    // Fallback Local Mode
    const users = getLocalStorage<Record<string, UserProfile>>(LOCAL_STORAGE_KEYS.USERS, localUsers);
    users[profile.uid] = profile;
    setLocalStorage(LOCAL_STORAGE_KEYS.USERS, users);
  },

  // ORDERS
  async createOrder(order: Order): Promise<void> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'orders';
      try {
        await setDoc(doc(db, colPath, order.orderId), order);
        return;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${colPath}/${order.orderId}`);
      }
    }
    // Fallback Local Mode
    const list = getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    list.unshift(order);
    setLocalStorage(LOCAL_STORAGE_KEYS.ORDERS, list);
  },

  async getAllOrders(): Promise<Order[]> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'orders';
      try {
        const q = query(collection(db, colPath), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const list: Order[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Order);
        });
        if (list.length > 0) return list;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    }
    // Fallback Local Mode
    return getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'orders';
      try {
        const q = query(collection(db, colPath), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const list: Order[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Order);
        });
        return list;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    }
    // Fallback Local Mode
    const orders = getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return orders.filter(o => o.userId === userId);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'orders';
      try {
        const docRef = doc(db, colPath, orderId);
        await updateDoc(docRef, { status });
        return;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${colPath}/${orderId}`);
      }
    }
    // Fallback Local Mode
    const list = getLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const index = list.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      list[index].status = status;
      setLocalStorage(LOCAL_STORAGE_KEYS.ORDERS, list);
    }
  },

  // REVIEWS
  async getReviewsForProduct(productId: string): Promise<Review[]> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'reviews';
      try {
        const q = query(collection(db, colPath), where('productId', '==', productId));
        const querySnapshot = await getDocs(q);
        const list: Review[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Review);
        });
        return list;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, colPath);
      }
    }
    // Fallback Local Mode
    const reviews = getLocalStorage<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return reviews.filter(r => r.productId === productId);
  },

  async addReview(review: Review): Promise<void> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'reviews';
      try {
        await setDoc(doc(db, colPath, review.id), review);
        return;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${colPath}/${review.id}`);
      }
    }
    // Fallback Local Mode
    const reviews = getLocalStorage<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    reviews.push(review);
    setLocalStorage(LOCAL_STORAGE_KEYS.REVIEWS, reviews);
    
    // Dynamically update product average rating
    const pList = getLocalStorage<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const pIndex = pList.findIndex(p => p.id === review.productId);
    if (pIndex !== -1) {
      const pReviews = reviews.filter(r => r.productId === review.productId);
      const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
      pList[pIndex].rating = parseFloat(avg.toFixed(1));
      setLocalStorage(LOCAL_STORAGE_KEYS.PRODUCTS, pList);
    }
  },

  // WISHLIST
  async getWishlist(userId: string): Promise<string[]> {
    if (!isPlaceholderConfig && db) {
      const colPath = 'wishlists';
      try {
        const docRef = doc(db, colPath, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return (docSnap.data() as Wishlist).productIds;
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${colPath}/${userId}`);
      }
    }
    // Fallback Local Mode
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

    if (!isPlaceholderConfig && db) {
      const colPath = 'wishlists';
      try {
        await setDoc(doc(db, colPath, userId), { userId, productIds: updated });
        return updated;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${colPath}/${userId}`);
      }
    }
    // Fallback Local Mode
    const wishlists = getLocalStorage<Record<string, string[]>>(LOCAL_STORAGE_KEYS.WISHLISTS, {
      'cust-demo': ['prod-raja-rani-mix']
    });
    wishlists[userId] = updated;
    setLocalStorage(LOCAL_STORAGE_KEYS.WISHLISTS, wishlists);
    return updated;
  }
};
