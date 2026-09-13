/**
 * Homepage Showcase Sections & Collection Helper
 * These 4 collections are dedicated showcase sections on the homepage,
 * NOT product categories.
 */

export interface ShowcaseSection {
  id: string;
  slug: string;
  title: string;
  href: string;
  iconName: string;
  tagline: string;
}

export const SHOWCASE_SECTIONS: ShowcaseSection[] = [
  {
    id: "featured-products",
    slug: "featured-products",
    title: "Featured Products",
    href: "/#featured-products",
    iconName: "Sparkles",
    tagline: "Curated store highlights & top recommendations",
  },
  {
    id: "new-arrivals",
    slug: "new-arrivals",
    title: "New Arrivals",
    href: "/#new-arrivals",
    iconName: "Zap",
    tagline: "Latest products & fresh releases",
  },
  {
    id: "best-sellers",
    slug: "best-sellers",
    title: "Best Sellers",
    href: "/#best-sellers",
    iconName: "Flame",
    tagline: "Most popular items loved by customers",
  },
  {
    id: "all-products",
    slug: "all-products",
    title: "All Products",
    href: "/#all-products",
    iconName: "Package",
    tagline: "Complete product catalog & collections",
  },
];

const SHOWCASE_KEYWORDS = [
  "best sellers",
  "bestsellers",
  "best-sellers",
  "new arrivals",
  "new-arrivals",
  "featured products",
  "featured-products",
  "featured",
  "all products",
  "all-products",
];

/**
 * Checks whether a collection or string title/slug represents
 * one of the 4 homepage showcase sections rather than a product category.
 */
export function isShowcaseCollection(
  col?: { title?: string; slug?: string; id?: string } | string | null
): boolean {
  if (!col) return false;
  if (typeof col === "string") {
    return SHOWCASE_KEYWORDS.includes(col.trim().toLowerCase());
  }
  const t = (col.title || "").trim().toLowerCase();
  const s = (col.slug || "").trim().toLowerCase();
  const id = (col.id || "").trim().toLowerCase();

  return (
    SHOWCASE_KEYWORDS.includes(t) ||
    SHOWCASE_KEYWORDS.includes(s) ||
    SHOWCASE_KEYWORDS.includes(id)
  );
}
