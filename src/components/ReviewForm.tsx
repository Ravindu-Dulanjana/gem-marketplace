"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Star, CheckCircle } from "lucide-react";

interface ReviewFormProps {
  sellerId: string;
}

export default function ReviewForm({ sellerId }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const buyerName = formData.get("buyer_name") as string;
    const buyerEmail = formData.get("buyer_email") as string;
    const comment = formData.get("comment") as string;

    const supabase = createClient();
    const { error: insertError } = await supabase.from("reviews").insert({
      seller_id: sellerId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      rating,
      comment: comment || null,
    });

    if (insertError) {
      setError("Failed to submit review. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
        <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
        <h3 className="text-sm font-semibold text-green-400 mb-1">
          Review Submitted!
        </h3>
        <p className="text-xs text-muted">
          Your review will be visible once approved by an admin.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Leave a Review
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4"
      >
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Star Rating */}
        <div>
          <label className="block text-xs text-muted mb-2">Rating *</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
              >
                <Star
                  size={24}
                  className={`transition-colors ${
                    i < (hoverRating || rating)
                      ? "text-gold fill-gold"
                      : "text-card-border"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1">Name *</label>
            <input
              name="buyer_name"
              type="text"
              required
              className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Email *</label>
            <input
              name="buyer_email"
              type="email"
              required
              className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Comment</label>
          <textarea
            name="comment"
            rows={3}
            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors resize-none"
            placeholder="Share your experience with this seller..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  );
}
