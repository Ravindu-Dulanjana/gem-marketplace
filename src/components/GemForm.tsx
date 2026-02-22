"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X, Upload, ImageIcon } from "lucide-react";
import { GEM_SHAPES, GEM_COLORS, GEM_TYPES, TREATMENTS, CLARITY_OPTIONS } from "@/lib/constants";
import type { Gem, GemImage, Category } from "@/types/database";

interface GemFormProps {
  gem?: Gem & { images?: GemImage[] };
  categories: Category[];
  action: (formData: FormData) => Promise<{ error: string } | undefined | void>;
  submitLabel: string;
}

export default function GemForm({ gem, categories, action, submitLabel }: GemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceType, setPriceType] = useState<string>(gem?.price_type || "request");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<GemImage[]>(gem?.images || []);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length - deletedImageIds.length + selectedFiles.length + files.length;

    if (totalImages > 10) {
      setError("Maximum 10 images allowed per gem");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeNewImage(index: number) {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(imageId: string) {
    setDeletedImageIds((prev) => [...prev, imageId]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Remove the file input and re-add selected files
    formData.delete("images");
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Add deleted image IDs
    if (deletedImageIds.length > 0) {
      formData.set("deleted_images", JSON.stringify(deletedImageIds));
    }

    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const activeExistingImages = existingImages.filter(
    (img) => !deletedImageIds.includes(img.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-[family-name:var(--font-playfair)]">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-muted mb-1.5">Title *</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={gem?.title}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g., Natural Blue Sapphire 3.52ct"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Gem Type *</label>
            <select
              name="gem_type"
              required
              defaultValue={gem?.gem_type}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select gem type</option>
              {GEM_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Category</label>
            <select
              name="category_id"
              defaultValue={gem?.category_id || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-muted mb-1.5">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={gem?.description || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Describe your gem in detail..."
            />
          </div>
        </div>
      </div>

      {/* Gem Specifications */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-[family-name:var(--font-playfair)]">
          Specifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Carat Weight</label>
            <input
              name="carat_weight"
              type="number"
              step="0.01"
              min="0"
              defaultValue={gem?.carat_weight || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g., 3.52"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Shape</label>
            <select
              name="shape"
              defaultValue={gem?.shape || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select shape</option>
              {GEM_SHAPES.map((s) => (
                <option key={s.slug} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Color</label>
            <select
              name="color"
              defaultValue={gem?.color || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select color</option>
              {GEM_COLORS.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Clarity</label>
            <select
              name="clarity"
              defaultValue={gem?.clarity || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select clarity</option>
              {CLARITY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Treatment</label>
            <select
              name="treatment"
              defaultValue={gem?.treatment || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select treatment</option>
              {TREATMENTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Origin</label>
            <input
              name="origin"
              type="text"
              defaultValue={gem?.origin || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g., Sri Lanka, Myanmar"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Dimensions</label>
            <input
              name="dimensions"
              type="text"
              defaultValue={gem?.dimensions || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g., 9.2 x 7.1 x 4.8 mm"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Certification</label>
            <input
              name="certification"
              type="text"
              defaultValue={gem?.certification || ""}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g., GIA, GRS, Gubelin"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-[family-name:var(--font-playfair)]">
          Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Price Type *</label>
            <select
              name="price_type"
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="request">Request Price (inquiry-based)</option>
              <option value="fixed">Fixed Price</option>
            </select>
          </div>

          {priceType === "fixed" && (
            <div>
              <label className="block text-sm text-muted mb-1.5">Price (USD) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required={priceType === "fixed"}
                defaultValue={gem?.price || ""}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g., 5000.00"
              />
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-[family-name:var(--font-playfair)]">
          Images (up to 10)
        </h3>

        {/* Existing images */}
        {activeExistingImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
            {activeExistingImages.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-card-border">
                <Image
                  src={img.url}
                  alt={img.alt_text || "Gem image"}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New image previews */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
            {previewImages.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gold/30">
                <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-1 left-1 text-[10px] bg-gold/80 text-background px-1.5 py-0.5 rounded">
                  New
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-card-border rounded-lg cursor-pointer hover:border-gold/50 transition-colors">
          <Upload className="text-muted" size={24} />
          <span className="text-sm text-muted">Click to upload images</span>
          <span className="text-xs text-muted/60">PNG, JPG, WebP — max 10 images</span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Status & Submit */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Listing Status</label>
            <select
              name="status"
              defaultValue={gem?.status || "pending"}
              className="bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-gold transition-colors"
            >
              <option value="draft">Draft (not visible)</option>
              <option value="pending">Submit for Review</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gold text-background font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
