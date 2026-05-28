import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials safely from Vite env parameters
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== ''
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema Builder Blueprint helpful for setting up the products table inside Supabase SQL editor:
 * 
 * CREATE TABLE products (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   price NUMERIC NOT NULL DEFAULT 0,
 *   stock INTEGER NOT NULL DEFAULT 0,
 *   image TEXT,
 *   category TEXT,
 *   description TEXT,
 *   tamil_name TEXT,
 *   rating NUMERIC DEFAULT 5
 * );
 * 
 * -- Enable Row Level Security (RLS) or public access depending on security preferences
 * ALTER TABLE products ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
 * CREATE POLICY "Allow public write" ON products FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
 * CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);
 */
