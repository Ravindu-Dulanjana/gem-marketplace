"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist";

interface WishlistButtonProps {
  gemId: string;
  isWishlisted: boolean;
  size?: "sm" | "md";
}

export default function WishlistButton({
  gemId,
  isWishlisted: initialWishlisted,
  size = "md",
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    if (wishlisted) {
      await removeFromWishlist(gemId);
      setWishlisted(false);
    } else {
      await addToWishlist(gemId);
      setWishlisted(true);
    }

    setLoading(false);
  }

  const iconSize = size === "sm" ? 14 : 18;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all disabled:opacity-50 ${
        wishlisted
          ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
          : "text-muted hover:text-red-500 hover:bg-red-500/10"
      }`}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={iconSize}
        fill={wishlisted ? "currentColor" : "none"}
      />
    </button>
  );
}
