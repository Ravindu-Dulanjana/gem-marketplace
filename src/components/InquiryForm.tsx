"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, MessageCircle } from "lucide-react";

interface InquiryFormProps {
  gemId: string;
  sellerId: string;
  gemTitle: string;
}

export default function InquiryForm({ gemId, sellerId, gemTitle }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const buyerName = formData.get("buyer_name") as string;
    const buyerEmail = formData.get("buyer_email") as string;
    const buyerPhone = formData.get("buyer_phone") as string;
    const message = formData.get("message") as string;

    const supabase = createClient();
    const { error: insertError } = await supabase.from("inquiries").insert({
      gem_id: gemId,
      seller_id: sellerId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone || null,
      message,
    });

    if (insertError) {
      setError("Failed to send inquiry. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
        <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
        <h3 className="text-sm font-semibold text-green-400 mb-1">
          Inquiry Sent!
        </h3>
        <p className="text-xs text-muted">
          The seller will respond to your inquiry about &ldquo;{gemTitle}&rdquo; shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageCircle className="text-gold" size={16} />
        Send Inquiry
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

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
          <label className="block text-xs text-muted mb-1">Phone (optional)</label>
          <input
            name="buyer_phone"
            type="tel"
            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Message *</label>
          <textarea
            name="message"
            required
            rows={3}
            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors resize-none"
            placeholder={`I'm interested in "${gemTitle}". Could you please provide more details?`}
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
              Sending...
            </>
          ) : (
            "Send Inquiry"
          )}
        </button>
      </form>
    </div>
  );
}
