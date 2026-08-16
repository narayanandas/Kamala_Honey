import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials safely from Vite env parameters with active credentials support
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ragjnpnnvaonzyfxupaw.supabase.co';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PLQhCPIzXZBOF9zwULuTBA_gjX1k1VI';

// Sanitize URL: Remove trailing /rest/v1 or slashes so Supabase JS client constructs correct endpoints
const cleanUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const cleanKey = rawKey.trim();

export const isSupabaseConfigured = !!(
  cleanUrl &&
  cleanKey &&
  !cleanUrl.includes('placeholder') &&
  !cleanKey.includes('placeholder') &&
  cleanUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, cleanKey)
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
