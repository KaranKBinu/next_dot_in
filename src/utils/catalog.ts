export interface ProductMeasurements {
    chest: string;
    length: string;
    shoulder: string;
}

export interface ProductVariant {
    sku: string;         // Unique SKU code, e.g., "prod-1-L-orange"
    size: string;        // Size (e.g. "L", "M")
    colorName: string;   // Color label (e.g. "Rust Orange")
    colorHex: string;    // Color hex code (e.g. "#ff5722")
    priceInRupees: number;
    imagePath: string;
    measurements: ProductMeasurements;
    conditionKey: "condExcellent" | "condVeryGood" | "condGood";
    hotness: 1 | 2 | 3 | 4 | 5;
    stockQuantity: number;
}

export interface Product {
    id: string; // Base product ID
    nameKey: string;
    descKey: string;
    brand: string;
    year: string;
    category: "tees" | "denim" | "knits" | "cargo";
    materialKey: "matCotton" | "matDenim" | "matCorduroy" | "matWool" | "matFleece" | "matNylon";
    variants: ProductVariant[];
    
    // Default variant properties (for backward compatibility with carousels and basic card maps)
    sku: string;
    priceInRupees: number;
    size: string;
    colorHex: string;
    colorName: string;
    imagePath: string;
    measurements: ProductMeasurements;
    conditionKey: "condExcellent" | "condVeryGood" | "condGood";
    hotness: 1 | 2 | 3 | 4 | 5;
    stockQuantity: number;
}

export const CATEGORIES_META = {
    all: { labelKey: "browseCategories", href: "/catalog/all" },
    tees: { labelKey: "catTeesTitle", href: "/catalog/tees" },
    denim: { labelKey: "catDenimTitle", href: "/catalog/denim" },
    knits: { labelKey: "catKnitsTitle", href: "/catalog/knits" },
    cargo: { labelKey: "catCargoTitle", href: "/catalog/cargo" },
} as const;

export const PRODUCTS: Product[] = [];
