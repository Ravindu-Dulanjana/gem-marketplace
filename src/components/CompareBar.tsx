"use client";

import Link from "next/link";
import { X, GitCompareArrows } from "lucide-react";
import { useCompare } from "./CompareProvider";

export default function CompareBar() {
  const { compareIds, clearCompare } = useCompare();

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card-bg border-t border-gold/30 shadow-lg shadow-gold/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompareArrows className="text-gold" size={18} />
          <span className="text-sm text-foreground">
            <span className="text-gold font-semibold">{compareIds.length}</span>{" "}
            gem{compareIds.length !== 1 ? "s" : ""} selected to compare
          </span>
          <span className="text-xs text-muted">(max 4)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-xs text-muted hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Clear
          </button>
          <Link
            href={`/compare?ids=${compareIds.join(",")}`}
            className="text-xs px-4 py-2 bg-gold text-background rounded-lg hover:bg-gold-light transition-colors font-semibold"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
