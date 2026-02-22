-- ============================================
-- GEM MARKETPLACE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase Auth)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'seller' CHECK (role IN ('seller', 'admin')),
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default categories
INSERT INTO categories (name, slug, display_order) VALUES
  ('Loose Stones', 'loose-stones', 1),
  ('Layouts', 'layouts', 2),
  ('Cabochons', 'cabochons', 3),
  ('Pairs', 'pairs', 4),
  ('Calibrated Sapphires', 'calibrated-sapphires', 5),
  ('Custom Request', 'custom-request', 6);

-- ============================================
-- GEMS TABLE
-- ============================================
CREATE TABLE gems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  gem_type TEXT NOT NULL,
  carat_weight DECIMAL(10, 2),
  shape TEXT,
  color TEXT,
  clarity TEXT,
  treatment TEXT,
  origin TEXT,
  dimensions TEXT,
  certification TEXT,
  certificate_url TEXT,
  price_type TEXT NOT NULL DEFAULT 'request' CHECK (price_type IN ('fixed', 'request')),
  price DECIMAL(12, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'active', 'sold', 'removed')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gems_seller_id ON gems(seller_id);
CREATE INDEX idx_gems_category_id ON gems(category_id);
CREATE INDEX idx_gems_status ON gems(status);
CREATE INDEX idx_gems_shape ON gems(shape);
CREATE INDEX idx_gems_color ON gems(color);
CREATE INDEX idx_gems_gem_type ON gems(gem_type);
CREATE INDEX idx_gems_is_featured ON gems(is_featured);
CREATE INDEX idx_gems_created_at ON gems(created_at DESC);

-- ============================================
-- GEM IMAGES TABLE
-- ============================================
CREATE TABLE gem_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gem_images_gem_id ON gem_images(gem_id);

-- ============================================
-- INQUIRIES TABLE (In-app messaging)
-- ============================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiries_seller_id ON inquiries(seller_id);
CREATE INDEX idx_inquiries_gem_id ON inquiries(gem_id);
CREATE INDEX idx_inquiries_is_read ON inquiries(is_read);

-- ============================================
-- WISHLIST TABLE (session-based for guests)
-- ============================================
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, gem_id)
);

CREATE INDEX idx_wishlist_session_id ON wishlist(session_id);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_seller_id ON reviews(seller_id);

-- ============================================
-- RECENTLY VIEWED TABLE
-- ============================================
CREATE TABLE recently_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  gem_id UUID NOT NULL REFERENCES gems(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, gem_id)
);

CREATE INDEX idx_recently_viewed_session_id ON recently_viewed(session_id);

-- ============================================
-- ADMIN LOGS TABLE
-- ============================================
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_gems_updated_at
  BEFORE UPDATE ON gems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment view count function
CREATE OR REPLACE FUNCTION increment_view_count(gem_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE gems SET view_count = view_count + 1 WHERE id = gem_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE gem_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CATEGORIES policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories"
  ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- GEMS policies
CREATE POLICY "Active gems are viewable by everyone"
  ON gems FOR SELECT USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Approved sellers can create gems"
  ON gems FOR INSERT WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND approval_status = 'approved')
  );

CREATE POLICY "Sellers can update own gems"
  ON gems FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own gems"
  ON gems FOR DELETE USING (seller_id = auth.uid());

CREATE POLICY "Admins can manage all gems"
  ON gems FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- GEM IMAGES policies
CREATE POLICY "Gem images viewable by everyone"
  ON gem_images FOR SELECT USING (true);

CREATE POLICY "Sellers can manage own gem images"
  ON gem_images FOR ALL USING (
    EXISTS (SELECT 1 FROM gems WHERE gems.id = gem_images.gem_id AND gems.seller_id = auth.uid())
  );

-- INQUIRIES policies
CREATE POLICY "Anyone can create inquiries"
  ON inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Sellers can view own inquiries"
  ON inquiries FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Sellers can update own inquiries"
  ON inquiries FOR UPDATE USING (seller_id = auth.uid());

-- WISHLIST policies
CREATE POLICY "Anyone can manage wishlist"
  ON wishlist FOR ALL USING (true);

-- REVIEWS policies
CREATE POLICY "Approved reviews viewable by everyone"
  ON reviews FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage reviews"
  ON reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RECENTLY VIEWED policies
CREATE POLICY "Anyone can manage recently viewed"
  ON recently_viewed FOR ALL USING (true);

-- ADMIN LOGS policies
CREATE POLICY "Only admins can view logs"
  ON admin_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can create logs"
  ON admin_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('gems', 'gems', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('certifications', 'certifications', true);

-- Storage policies
CREATE POLICY "Anyone can view gem images"
  ON storage.objects FOR SELECT USING (bucket_id = 'gems');

CREATE POLICY "Authenticated users can upload gem images"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'gems' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own gem images"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'gems' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own gem images"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'gems' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can manage own avatar"
  ON storage.objects FOR ALL USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view certifications"
  ON storage.objects FOR SELECT USING (bucket_id = 'certifications');

CREATE POLICY "Authenticated users can upload certifications"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'certifications' AND auth.role() = 'authenticated'
  );
