-- =========================================================================
-- KAMALA HONEY - COMPLETE SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- Copy and paste this script directly into your Supabase SQL Editor and run it.
-- =========================================================================

-- 1. DROP EXISTING TABLES IF NEEDED (OPTIONAL)
-- DROP TABLE IF EXISTS wishlists CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;

-- -------------------------------------------------------------------------
-- TABLE 1: products
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tamil_name TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  category TEXT,
  description TEXT,
  rating NUMERIC DEFAULT 5.0,
  ingredients JSONB DEFAULT '[]'::jsonb,
  is_best_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public select product') THEN
    CREATE POLICY "Allow public select product" ON products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public insert product') THEN
    CREATE POLICY "Allow public insert product" ON products FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public update product') THEN
    CREATE POLICY "Allow public update product" ON products FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public delete product') THEN
    CREATE POLICY "Allow public delete product" ON products FOR DELETE USING (true);
  END IF;
END $$;


-- -------------------------------------------------------------------------
-- TABLE 2: users
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  address TEXT,
  district TEXT,
  state TEXT,
  pincode TEXT,
  role TEXT DEFAULT 'customer',
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public select users') THEN
    CREATE POLICY "Allow public select users" ON users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public insert users') THEN
    CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public update users') THEN
    CREATE POLICY "Allow public update users" ON users FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public delete users') THEN
    CREATE POLICY "Allow public delete users" ON users FOR DELETE USING (true);
  END IF;
END $$;


-- -------------------------------------------------------------------------
-- TABLE 3: orders
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  customer_name TEXT,
  phone TEXT,
  address TEXT,
  district TEXT,
  state TEXT,
  pincode TEXT,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  upi_screenshot TEXT,
  user_id TEXT,
  payment_method TEXT DEFAULT 'Manual',
  payment_status TEXT DEFAULT 'Unpaid',
  payment_id TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow public select orders') THEN
    CREATE POLICY "Allow public select orders" ON orders FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow public insert orders') THEN
    CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow public update orders') THEN
    CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow public delete orders') THEN
    CREATE POLICY "Allow public delete orders" ON orders FOR DELETE USING (true);
  END IF;
END $$;


-- -------------------------------------------------------------------------
-- TABLE 4: reviews
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  reviewer_name TEXT,
  rating NUMERIC NOT NULL DEFAULT 5,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Allow public select reviews') THEN
    CREATE POLICY "Allow public select reviews" ON reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Allow public insert reviews') THEN
    CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Allow public update reviews') THEN
    CREATE POLICY "Allow public update reviews" ON reviews FOR UPDATE USING (true);
  END IF;
END $$;


-- -------------------------------------------------------------------------
-- TABLE 5: wishlists
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlists (
  user_id TEXT PRIMARY KEY,
  product_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlists' AND policyname = 'Allow public select wishlists') THEN
    CREATE POLICY "Allow public select wishlists" ON wishlists FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlists' AND policyname = 'Allow public insert wishlists') THEN
    CREATE POLICY "Allow public insert wishlists" ON wishlists FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlists' AND policyname = 'Allow public update wishlists') THEN
    CREATE POLICY "Allow public update wishlists" ON wishlists FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlists' AND policyname = 'Allow public delete wishlists') THEN
    CREATE POLICY "Allow public delete wishlists" ON wishlists FOR DELETE USING (true);
  END IF;
END $$;


-- =========================================================================
-- SEED INITIAL DATA: PRODUCTS
-- =========================================================================

INSERT INTO products (id, name, tamil_name, price, stock, image, category, description, rating, ingredients, is_best_seller)
VALUES
(
  'prod-theen-nelli-big',
  'Theen Nelli (Big Amla Honey)',
  'தேன் நெல்லிக்காய் - பெரியது',
  440,
  50,
  'https://res.cloudinary.com/dlddzqqnw/image/upload/v1779905674/Gemini_Generated_Image_arcgdxarcgdxarcg_xmvn7x.png',
  'Amla Honey',
  'Whole big wild gooseberries soaked in premium wild forest honey. Packed with Vitamin C and iron, it aids digestion and strengthens immunity.',
  4.8,
  '["Whole Indian Gooseberry (Amla)", "100% Pure Natural Forest Honey"]'::jsonb,
  false
),
(
  'prod-chinna-nelli',
  'Chinna Nelli',
  'தேன் நெல்லிக்காய் - சிறியது',
  390,
  45,
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=500',
  'Amla Honey',
  'Small organic baby gooseberry pieces soaked in amber forest honey. Easy for children to consume and great for high energy.',
  4.7,
  '["Small Country Gooseberry Pieces", "Pure Farm Honey"]'::jsonb,
  false
),
(
  'prod-theen-perichai',
  'Theen Perichai',
  'தேன் பேரீச்சம்பழம்',
  450,
  60,
  'https://images.unsplash.com/photo-1569870499705-504209102bd6?auto=format&fit=crop&q=80&w=500',
  'Honey Dates',
  'Premium soft Arabian dates soaked completely in natural honey. Rich in iron, fibers, and natural sugars to boost your stamina.',
  4.9,
  '["Imported Seedless Dates", "Thirunelveli Pure Rock Honey"]'::jsonb,
  false
),
(
  'prod-honey-dry-fruits',
  'Honey Dry Fruits',
  'தேன் டிரை புரூட்ஸ்',
  480,
  35,
  'https://images.unsplash.com/photo-1623428187969-5da2d8a6f157?auto=format&fit=crop&q=80&w=500',
  'Dry Fruits',
  'Assorted premium quality dried walnuts, green raisins, apricot slices blended in single-origin honey.',
  4.8,
  '["Walnuts", "Dried Apricot", "Golden Raisins", "Pure Stingless Bee Honey"]'::jsonb,
  false
),
(
  'prod-theen-athi',
  'Theen Athi',
  'தேன் அத்திப்பழம்',
  460,
  30,
  'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&q=80&w=500',
  'Honey Fig',
  'Delicately dried high-fiber mountain figs preserved in deep golden sweet honey. Perfect combination for heart health and blood purity.',
  4.6,
  '["Smyrna Dried Figs (Athi)", "Raw Saffron Infused Honey"]'::jsonb,
  false
),
(
  'prod-theen-inji',
  'Theen Inji',
  'தேன் இஞ்சி',
  350,
  40,
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=500',
  'Honey Ginger',
  'Traditional home recipe of sliced farm-grown ginger infused in raw organic honey. Outstanding relief for cold, cough, and digestive issues.',
  4.5,
  '["Dehydrated Fresh Ginger Slices", "Thirunelveli Wildwood Honey"]'::jsonb,
  false
),
(
  'prod-raja-rani-mix',
  'Raja Rani Mix',
  'ராஜாராணி மிக்ஸ்',
  550,
  25,
  'https://images.unsplash.com/photo-1596450514943-ac434a2c07d5?auto=format&fit=crop&q=80&w=500',
  'Special Mix',
  'Royal power house formulation comprising whole pine nuts, almonds, pumpkin seeds, and pistachios marinated in top-grade nectar.',
  5.0,
  '["Almonds", "Cashews", "Walnuts", "Pistachios", "Pumpkin Seeds", "Chia Seeds", "Wild Forest Honey"]'::jsonb,
  true
),
(
  'prod-theen-mundhiri',
  'Theen Mundhiri',
  'தேன் முந்திரி',
  470,
  40,
  'https://images.unsplash.com/photo-1600189020840-e9918c25269d?auto=format&fit=crop&q=80&w=500',
  'Honey Cashew',
  'Whole select premium roasted cashews marinated in thick wild clover honey. A delightful natural snack full of essential minerals.',
  4.7,
  '["Selected Large Cashews", "Organic Farm Honey"]'::jsonb,
  false
),
(
  'prod-gulkand-dry-fruits',
  'Gulkand Dry Fruits',
  'குல்கந்து டிரை புரூட்ஸ்',
  520,
  30,
  'https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=500',
  'Gulkand Mix',
  'Traditional aromatic sun-cooked rose petal jam (Gulkand) perfectly mixed with hand-chopped premium almonds, cashews and pistachio nuts.',
  4.9,
  '["Paneer Rose Petals", "Rock Sugar Candy", "Cashews", "Almonds", "Wild Nectar Honey"]'::jsonb,
  false
),
(
  'prod-theen-badam',
  'Theen Badam',
  'தேன் பாதாம்',
  490,
  50,
  'https://images.unsplash.com/photo-1508061253366-f7da158b6db4?auto=format&fit=crop&q=80&w=500',
  'Honey Almond',
  'Mammoth sized California almonds shelled and thoroughly cured in natural multifloral bee honey. Best consumed daily on empty stomach.',
  4.8,
  '["Premium Shelled Almonds (Badam)", "Raw Multifloral Honey"]'::jsonb,
  false
),
(
  'prod-theen-naattu-poondu',
  'Theen Naattu Poondu',
  'தேன் நாட்டுப்பூண்டு',
  380,
  35,
  'https://images.unsplash.com/photo-1581063324423-edefbb5fcd3c?auto=format&fit=crop&q=80&w=500',
  'Honey Garlic',
  'Peeled organic hill garlic cloves slow-cooked and aged in natural liquid gold. Famous south Indian traditional remedy for weight management and cardio health.',
  4.6,
  '["Peeled Country Garlic (Naattu Poondu)", "100% Raw Hill Honey"]'::jsonb,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tamil_name = EXCLUDED.tamil_name,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  ingredients = EXCLUDED.ingredients,
  is_best_seller = EXCLUDED.is_best_seller;


-- =========================================================================
-- SEED INITIAL DATA: ADMIN USER
-- =========================================================================

INSERT INTO users (uid, email, name, phone, address, district, state, pincode, role, password)
VALUES
(
  'admin-default',
  'admin@kamalahoney.com',
  'Kamala Admin',
  '7708510872',
  'Thirunelveli Farm Gate',
  'Thirunelveli',
  'Tamil Nadu',
  '627001',
  'admin',
  'admin123'
)
ON CONFLICT (uid) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  password = EXCLUDED.password;


-- =========================================================================
-- SEED INITIAL DATA: REVIEWS
-- =========================================================================

INSERT INTO reviews (id, product_id, reviewer_name, rating, comment, created_at)
VALUES
(
  'rev-1',
  'prod-theen-nelli-big',
  'Subramanian S.',
  5,
  'The big amla pieces are extremely soft and saturated with pure honey. Truly exceptional taste from Thirunelveli!',
  NOW() - INTERVAL '30 days'
),
(
  'rev-2',
  'prod-raja-rani-mix',
  'Gayathri M.',
  5,
  'This Raja Rani Mix is a true immunity booster. The nuts remained crunchy, children loved it!',
  NOW() - INTERVAL '15 days'
),
(
  'rev-3',
  'prod-theen-inji',
  'Dr. Ramesh Kumar',
  4,
  'Perfect traditional blend of ginger and farm-pure honey. Excellent for throat relief and respiratory ease.',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- SEED INITIAL DATA: SAMPLE ORDER
-- =========================================================================

INSERT INTO orders (order_id, customer_name, phone, address, district, state, pincode, total_amount, status, user_id, payment_method, payment_status, items, created_at)
VALUES
(
  'KM-260527-814',
  'Karthikeyan Bala',
  '9845112233',
  '24 South Car Street',
  'Thirunelveli',
  'Tamil Nadu',
  '627002',
  1430,
  'Delivered',
  'cust-demo',
  'Manual',
  'Paid',
  '[{"productId":"prod-raja-rani-mix","name":"Raja Rani Mix","tamilName":"ராஜாராணி மிக்ஸ்","price":550,"quantity":1,"image":"https://images.unsplash.com/photo-1596450514943-ac434a2c07d5?auto=format&fit=crop&q=80&w=500"},{"productId":"prod-theen-nelli-big","name":"Theen Nelli (Big Amla Honey)","tamilName":"தேன் நெல்லிக்காய் - பெரியது","price":440,"quantity":2,"image":"https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=500"}]'::jsonb,
  NOW() - INTERVAL '10 days'
)
ON CONFLICT (order_id) DO NOTHING;
