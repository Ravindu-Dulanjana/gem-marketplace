"use client";

import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/shop/${slug}`
    : `/shop/${slug}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted">Share:</span>

      <button
        onClick={copyLink}
        className="p-2 text-muted hover:text-gold hover:bg-gold/10 rounded-full transition-all"
        title="Copy link"
      >
        {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
      </button>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-muted hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-all"
        title="Share on Twitter"
      >
        <Twitter size={15} />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-muted hover:text-blue-600 hover:bg-blue-600/10 rounded-full transition-all"
        title="Share on Facebook"
      >
        <Facebook size={15} />
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-muted hover:text-green-500 hover:bg-green-500/10 rounded-full transition-all"
        title="Share on WhatsApp"
      >
        <Share2 size={15} />
      </a>
    </div>
  );
}
