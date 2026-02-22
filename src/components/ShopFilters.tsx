"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { GEM_SHAPES, GEM_COLORS, GEM_TYPES, TREATMENTS } from "@/lib/constants";
import type { Category } from "@/types/database";

interface ShopFiltersProps {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-card-border pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}

export default function ShopFilters({ categories, currentParams }: ShopFiltersProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });

    if (currentParams[key] === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  function clearAll() {
    router.push("/shop");
  }

  const hasFilters = Object.keys(currentParams).some(
    (k) => k !== "page" && k !== "sort" && currentParams[k]
  );

  const filterContent = (
    <>
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors mb-4"
        >
          <X size={12} />
          Clear all filters
        </button>
      )}

      <FilterSection title="Category">
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => applyFilter("category", cat.slug)}
              className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                currentParams.category === cat.slug
                  ? "bg-gold/10 text-gold border border-gold/30"
                  : "text-muted hover:text-foreground hover:bg-card-border/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gem Type">
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {GEM_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => applyFilter("type", type.toLowerCase())}
              className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                currentParams.type === type.toLowerCase()
                  ? "bg-gold/10 text-gold border border-gold/30"
                  : "text-muted hover:text-foreground hover:bg-card-border/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Shape">
        <div className="grid grid-cols-2 gap-1.5">
          {GEM_SHAPES.map((shape) => (
            <button
              key={shape.slug}
              onClick={() => applyFilter("shape", shape.slug)}
              className={`text-xs px-3 py-2 rounded-lg transition-colors text-center ${
                currentParams.shape === shape.slug
                  ? "bg-gold/10 text-gold border border-gold/30"
                  : "text-muted hover:text-foreground hover:bg-card-border/50 border border-transparent"
              }`}
            >
              {shape.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {GEM_COLORS.map((color) => (
            <button
              key={color.slug}
              onClick={() => applyFilter("color", color.slug)}
              title={color.name}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                currentParams.color === color.slug
                  ? "border-gold scale-110"
                  : "border-card-border hover:border-gold/50"
              }`}
              style={{
                background: `radial-gradient(circle at 35% 35%, ${color.hex}dd, ${color.hex}88)`,
              }}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Treatment" defaultOpen={false}>
        <div className="space-y-1.5">
          {TREATMENTS.map((t) => (
            <button
              key={t}
              onClick={() => applyFilter("treatment", t.toLowerCase())}
              className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                currentParams.treatment === t.toLowerCase()
                  ? "bg-gold/10 text-gold border border-gold/30"
                  : "text-muted hover:text-foreground hover:bg-card-border/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Type" defaultOpen={false}>
        <div className="space-y-1.5">
          {[
            { label: "Fixed Price", value: "fixed" },
            { label: "Request Price", value: "request" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => applyFilter("price_type", opt.value)}
              className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                currentParams.price_type === opt.value
                  ? "bg-gold/10 text-gold border border-gold/30"
                  : "text-muted hover:text-foreground hover:bg-card-border/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-sm text-foreground w-full justify-center"
      >
        <Filter size={16} />
        {mobileOpen ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 bg-card-bg border border-card-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Filter size={14} className="text-gold" />
            Filters
          </h3>
          {filterContent}
        </div>
      </aside>

      {/* Mobile filters */}
      {mobileOpen && (
        <div className="lg:hidden bg-card-bg border border-card-border rounded-xl p-5">
          {filterContent}
        </div>
      )}
    </>
  );
}
