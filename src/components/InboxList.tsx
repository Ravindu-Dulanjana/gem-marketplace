"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  MailOpen,
  MessageCircle,
  Clock,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Inbox,
} from "lucide-react";

interface Inquiry {
  id: string;
  gem_id: string;
  seller_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  gem?: {
    id: string;
    title: string;
    slug: string;
    gem_type: string;
  };
}

interface InboxListProps {
  initialInquiries: Inquiry[];
  sellerId: string;
}

export default function InboxList({ initialInquiries, sellerId }: InboxListProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("inquiries-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "inquiries",
          filter: `seller_id=eq.${sellerId}`,
        },
        async (payload) => {
          // Fetch the full inquiry with gem data
          const { data } = await supabase
            .from("inquiries")
            .select("*, gem:gems(id, title, slug, gem_type)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setInquiries((prev) => [data, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sellerId]);

  async function markAsRead(inquiryId: string) {
    const supabase = createClient();
    await supabase
      .from("inquiries")
      .update({ is_read: true })
      .eq("id", inquiryId);

    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, is_read: true } : inq
      )
    );
  }

  function toggleExpand(inquiryId: string) {
    if (expandedId === inquiryId) {
      setExpandedId(null);
    } else {
      setExpandedId(inquiryId);
      // Mark as read when expanded
      const inq = inquiries.find((i) => i.id === inquiryId);
      if (inq && !inq.is_read) {
        markAsRead(inquiryId);
      }
    }
  }

  const filtered = inquiries.filter((inq) => {
    if (filter === "unread") return !inq.is_read;
    if (filter === "read") return inq.is_read;
    return true;
  });

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div>
      {/* Stats & Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">
            {inquiries.length} total &middot;{" "}
            <span className="text-gold">{unreadCount} unread</span>
          </span>
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                filter === f
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-card-border text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry List */}
      {filtered.length === 0 ? (
        <div className="bg-card-bg border border-card-border rounded-xl p-12 text-center">
          <Inbox className="text-muted mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
          </h3>
          <p className="text-sm text-muted">
            {filter === "all"
              ? "Inquiries from buyers will appear here"
              : "Try changing your filter"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={`bg-card-bg border rounded-xl overflow-hidden transition-colors ${
                inq.is_read
                  ? "border-card-border"
                  : "border-gold/30 bg-gold/5"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(inq.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="shrink-0">
                  {inq.is_read ? (
                    <MailOpen className="text-muted" size={18} />
                  ) : (
                    <Mail className="text-gold" size={18} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {inq.buyer_name}
                    </span>
                    {!inq.is_read && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gold text-background rounded-full font-semibold">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">
                    Re: {inq.gem?.title || "Unknown gem"} — {inq.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-muted flex items-center gap-1">
                    <Clock size={12} />
                    {formatTimeAgo(inq.created_at)}
                  </span>
                  {expandedId === inq.id ? (
                    <ChevronUp size={16} className="text-muted" />
                  ) : (
                    <ChevronDown size={16} className="text-muted" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === inq.id && (
                <div className="px-4 pb-4 border-t border-card-border pt-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="text-muted shrink-0" size={14} />
                      <a
                        href={`mailto:${inq.buyer_email}`}
                        className="text-gold hover:text-gold-light transition-colors"
                      >
                        {inq.buyer_email}
                      </a>
                    </div>
                    {inq.buyer_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="text-muted shrink-0" size={14} />
                        <a
                          href={`tel:${inq.buyer_phone}`}
                          className="text-foreground hover:text-gold transition-colors"
                        >
                          {inq.buyer_phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {inq.gem && (
                    <Link
                      href={`/shop/${inq.gem.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors mb-3"
                    >
                      <ExternalLink size={12} />
                      View: {inq.gem.title}
                    </Link>
                  )}

                  <div className="bg-background border border-card-border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="text-muted shrink-0 mt-0.5" size={14} />
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {inq.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <a
                      href={`mailto:${inq.buyer_email}?subject=Re: ${inq.gem?.title || "Gem Inquiry"}`}
                      className="text-xs px-4 py-2 bg-gold text-background rounded-lg hover:bg-gold-light transition-colors font-semibold"
                    >
                      Reply via Email
                    </a>
                    {inq.buyer_phone && (
                      <a
                        href={`https://wa.me/${inq.buyer_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-semibold"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
