export type UserRole = "seller" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type PriceType = "fixed" | "request";
export type GemStatus = "draft" | "pending" | "active" | "sold" | "removed";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  business_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Gem {
  id: string;
  seller_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  gem_type: string;
  carat_weight: number | null;
  shape: string | null;
  color: string | null;
  clarity: string | null;
  treatment: string | null;
  origin: string | null;
  dimensions: string | null;
  certification: string | null;
  certificate_url: string | null;
  price_type: PriceType;
  price: number | null;
  currency: string;
  status: GemStatus;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  seller?: Profile;
  category?: Category;
  images?: GemImage[];
}

export interface GemImage {
  id: string;
  gem_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface Inquiry {
  id: string;
  gem_id: string;
  seller_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  // Joined fields
  gem?: Gem;
}

export interface Review {
  id: string;
  seller_id: string;
  buyer_name: string;
  buyer_email: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  session_id: string;
  gem_id: string;
  created_at: string;
  gem?: Gem;
}
