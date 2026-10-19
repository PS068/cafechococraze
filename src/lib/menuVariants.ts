import type { MenuItem } from '../types';

export interface MenuItemWithVariants {
  item: MenuItem;
  baseName: string;
  variants: MenuItem[];
}

export function formatSizeLabel(raw: string): string {
  return raw
    .replace(/\s*inches/gi, '"')
    .replace(/,\s*/, ' (') + (raw.includes(',') ? ')' : '');
}

/**
 * Strips out medical/health claims (e.g. FODMAP Friendly, Dairy Free),
 * preserving only true culinary highlights (Chef's Special, Popular, Bestseller, etc.).
 */
export function sanitizeCulinaryLabels(labels?: string[] | null): string[] {
  if (!labels || !Array.isArray(labels)) return [];
  return labels.filter((label) => !/fodmap|dairy\s*free|gluten/i.test(label));
}

/**
 * Groups menu items that share the same category and base name (e.g. "[Regular, 6 inches]" and "[Medium, 8 inches]")
 * into a single entry with size variants.
 */
export function groupMenuItemVariants(items: MenuItem[]): MenuItemWithVariants[] {
  const map = new Map<string, MenuItemWithVariants>();

  for (const item of items) {
    const match = item.name.match(/^(.*?)\s*\[(.*?)\]$/);
    const baseName = match ? match[1].trim() : item.name;
    const key = `${item.category_id}:::${baseName.toLowerCase()}`;

    const existing = map.get(key);
    if (existing) {
      existing.variants.push(item);
      existing.variants.sort((a, b) => a.price - b.price);
      existing.item = existing.variants[0];
    } else {
      map.set(key, {
        item,
        baseName,
        variants: [item],
      });
    }
  }

  return Array.from(map.values());
}

/**
 * Detects if a variant group belongs to pizza (which has portion/size variations).
 */
export function isPizzaVariantGroup(group: MenuItemWithVariants): boolean {
  return /pizza/i.test(group.baseName) || /pizza/i.test(group.item.name);
}
