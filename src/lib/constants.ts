export const GEM_SHAPES = [
  { name: "Round", slug: "round" },
  { name: "Oval", slug: "oval" },
  { name: "Pear", slug: "pear" },
  { name: "Cushion", slug: "cushion" },
  { name: "Heart", slug: "heart" },
  { name: "Marquise", slug: "marquise" },
  { name: "Emerald Cut", slug: "emerald-cut" },
  { name: "Octagonal", slug: "octagonal" },
  { name: "Cabochon", slug: "cabochon" },
  { name: "Sugarloaf", slug: "sugarloaf" },
] as const;

export const GEM_COLORS = [
  { name: "Blue", slug: "blue", hex: "#1e40af" },
  { name: "Pink", slug: "pink", hex: "#db2777" },
  { name: "Yellow", slug: "yellow", hex: "#eab308" },
  { name: "Green", slug: "green", hex: "#16a34a" },
  { name: "Red", slug: "red", hex: "#dc2626" },
  { name: "Purple", slug: "purple", hex: "#7c3aed" },
  { name: "Orange", slug: "orange", hex: "#ea580c" },
  { name: "Teal", slug: "teal", hex: "#0d9488" },
  { name: "Peach", slug: "peach", hex: "#f4a583" },
  { name: "Padparadscha", slug: "padparadscha", hex: "#f0758f" },
  { name: "Colorless", slug: "colorless", hex: "#e5e7eb" },
  { name: "Brown", slug: "brown", hex: "#92400e" },
] as const;

export const GEM_TYPES = [
  "Sapphire",
  "Ruby",
  "Emerald",
  "Alexandrite",
  "Spinel",
  "Garnet",
  "Tourmaline",
  "Topaz",
  "Aquamarine",
  "Tanzanite",
  "Zircon",
  "Chrysoberyl",
  "Peridot",
  "Amethyst",
  "Citrine",
  "Opal",
  "Moonstone",
  "Star Sapphire",
  "Star Ruby",
  "Cat's Eye",
] as const;

export const TREATMENTS = [
  "No Treatment (Natural)",
  "Heated",
  "Unheated",
  "Minor Heat",
  "Beryllium Treated",
  "Diffusion Treated",
  "Glass Filled",
  "Oiled",
] as const;

export const CLARITY_OPTIONS = [
  "Eye Clean",
  "Loupe Clean",
  "Slightly Included",
  "Moderately Included",
  "Heavily Included",
  "Transparent",
  "Translucent",
  "Opaque",
] as const;

export const SITE_NAME = "GemMarket";
export const SITE_DESCRIPTION = "Premium Gemstone Marketplace — Buy and sell high-quality gems from trusted sellers worldwide.";
