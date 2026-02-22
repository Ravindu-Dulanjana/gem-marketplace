"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  Gem,
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-card-border">
      {/* Announcement Bar */}
      <div className="bg-gold/10 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center">
          <p className="text-xs text-gold tracking-widest uppercase">
            Premium Gemstones — Trusted Sellers Worldwide — Free Shipping on Select Orders
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-gold transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Gem className="text-gold" size={28} />
            <span className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
              GemMarket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-sm uppercase tracking-wider text-foreground hover:text-gold transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm uppercase tracking-wider text-foreground hover:text-gold transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm uppercase tracking-wider text-foreground hover:text-gold transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-foreground hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              href="/wishlist"
              className="text-foreground hover:text-gold transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/seller/login"
              className="text-foreground hover:text-gold transition-colors"
              aria-label="Seller Login"
            >
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <form action="/shop" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search gems by name, type, color..."
                className="w-full bg-card-bg border border-card-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-card-border bg-background animate-fade-in">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <Link
              href="/shop"
              className="text-sm uppercase tracking-wider text-foreground hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm uppercase tracking-wider text-foreground hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm uppercase tracking-wider text-foreground hover:text-gold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <hr className="border-card-border" />
            <Link
              href="/seller/login"
              className="text-sm uppercase tracking-wider text-gold hover:text-gold-light transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Seller Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
