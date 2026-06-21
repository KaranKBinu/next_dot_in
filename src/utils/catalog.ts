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
}

export const CATEGORIES_META = {
    all: { labelKey: "browseCategories", href: "/catalog/all" },
    tees: { labelKey: "catTeesTitle", href: "/catalog/tees" },
    denim: { labelKey: "catDenimTitle", href: "/catalog/denim" },
    knits: { labelKey: "catKnitsTitle", href: "/catalog/knits" },
    cargo: { labelKey: "catCargoTitle", href: "/catalog/cargo" },
} as const;

export const PRODUCTS: Product[] = [
    {
        id: "prod-1",
        nameKey: "prod1Name",
        descKey: "prod1Desc",
        brand: "Champion (Classic)",
        year: "1994",
        category: "tees",
        materialKey: "matCotton",
        variants: [
            {
                sku: "prod-1-L-orange",
                size: "L",
                colorName: "Rust Orange",
                colorHex: "#ff5722",
                priceInRupees: 2900,
                imagePath: "/products/vintage_tee.png",
                measurements: { chest: '22"', length: '29"', shoulder: '19.5"' },
                conditionKey: "condExcellent",
                hotness: 5
            },
            {
                sku: "prod-1-M-black",
                size: "M",
                colorName: "Vintage Black",
                colorHex: "#212121",
                priceInRupees: 2700,
                imagePath: "/products/vintage_tee.png",
                measurements: { chest: '20"', length: '28"', shoulder: '18.5"' },
                conditionKey: "condVeryGood",
                hotness: 4
            }
        ],
        // Default variant mapping
        sku: "prod-1-L-orange",
        size: "L",
        colorName: "Rust Orange",
        colorHex: "#ff5722",
        priceInRupees: 2900,
        imagePath: "/products/vintage_tee.png",
        measurements: { chest: '22"', length: '29"', shoulder: '19.5"' },
        conditionKey: "condExcellent",
        hotness: 5
    },
    {
        id: "prod-2",
        nameKey: "prod2Name",
        descKey: "prod2Desc",
        brand: "Levi's (Curated)",
        year: "1988",
        category: "denim",
        materialKey: "matDenim",
        variants: [
            {
                sku: "prod-2-32-blue",
                size: "32 x 30",
                colorName: "Indigo Blue",
                colorHex: "#2b4c7e",
                priceInRupees: 4800,
                imagePath: "/products/denim_jeans.png",
                measurements: { chest: 'N/A', length: '30" (inseam)', shoulder: 'N/A' },
                conditionKey: "condVeryGood",
                hotness: 4
            },
            {
                sku: "prod-2-30-black",
                size: "30 x 32",
                colorName: "Washed Black",
                colorHex: "#424242",
                priceInRupees: 4600,
                imagePath: "/products/denim_jeans.png",
                measurements: { chest: 'N/A', length: '32" (inseam)', shoulder: 'N/A' },
                conditionKey: "condExcellent",
                hotness: 5
            }
        ],
        // Default variant mapping
        sku: "prod-2-32-blue",
        size: "32 x 30",
        colorName: "Indigo Blue",
        colorHex: "#2b4c7e",
        priceInRupees: 4800,
        imagePath: "/products/denim_jeans.png",
        measurements: { chest: 'N/A', length: '30" (inseam)', shoulder: 'N/A' },
        conditionKey: "condVeryGood",
        hotness: 4
    },
    {
        id: "prod-3",
        nameKey: "prod3Name",
        descKey: "prod3Desc",
        brand: "Carhartt WIP",
        year: "1997",
        category: "knits",
        materialKey: "matCorduroy",
        variants: [
            {
                sku: "prod-3-M-brown",
                size: "M",
                colorName: "Dusty Brown",
                colorHex: "#bcaaa4",
                priceInRupees: 3900,
                imagePath: "/products/worker_shirt.png",
                measurements: { chest: '21"', length: '28"', shoulder: '18"' },
                conditionKey: "condVeryGood",
                hotness: 4
            },
            {
                sku: "prod-3-L-tan",
                size: "L",
                colorName: "Tan Cord",
                colorHex: "#d7ccc8",
                priceInRupees: 4100,
                imagePath: "/products/worker_shirt.png",
                measurements: { chest: '22.5"', length: '29"', shoulder: '19"' },
                conditionKey: "condGood",
                hotness: 3
            }
        ],
        // Default variant mapping
        sku: "prod-3-M-brown",
        size: "M",
        colorName: "Dusty Brown",
        colorHex: "#bcaaa4",
        priceInRupees: 3900,
        imagePath: "/products/worker_shirt.png",
        measurements: { chest: '21"', length: '28"', shoulder: '18"' },
        conditionKey: "condVeryGood",
        hotness: 4
    },
    {
        id: "prod-4",
        nameKey: "prod4Name",
        descKey: "prod4Desc",
        brand: "Rothco Vintage",
        year: "1992",
        category: "cargo",
        materialKey: "matCotton",
        variants: [
            {
                sku: "prod-4-30-olive",
                size: "30 x 32",
                colorName: "Olive Green",
                colorHex: "#4e5d44",
                priceInRupees: 4400,
                imagePath: "/products/cargo_pants.png",
                measurements: { chest: 'N/A', length: '32" (inseam)', shoulder: 'N/A' },
                conditionKey: "condGood",
                hotness: 3
            },
            {
                sku: "prod-4-32-khaki",
                size: "32 x 30",
                colorName: "Khaki Tan",
                colorHex: "#c2b280",
                priceInRupees: 4500,
                imagePath: "/products/cargo_pants.png",
                measurements: { chest: 'N/A', length: '30" (inseam)', shoulder: 'N/A' },
                conditionKey: "condVeryGood",
                hotness: 4
            }
        ],
        // Default variant mapping
        sku: "prod-4-30-olive",
        size: "30 x 32",
        colorName: "Olive Green",
        colorHex: "#4e5d44",
        priceInRupees: 4400,
        imagePath: "/products/cargo_pants.png",
        measurements: { chest: 'N/A', length: '32" (inseam)', shoulder: 'N/A' },
        conditionKey: "condGood",
        hotness: 3
    },
    {
        id: "prod-5",
        nameKey: "prod5Name",
        descKey: "prod5Desc",
        brand: "Nike Vintage",
        year: "1996",
        category: "tees",
        materialKey: "matCotton",
        variants: [
            {
                sku: "prod-5-XL-green",
                size: "XL",
                colorName: "Forest Green",
                colorHex: "#009688",
                priceInRupees: 3200,
                imagePath: "/products/vintage_tee.png",
                measurements: { chest: '24"', length: '31"', shoulder: '21"' },
                conditionKey: "condExcellent",
                hotness: 4
            },
            {
                sku: "prod-5-L-grey",
                size: "L",
                colorName: "Heather Grey",
                colorHex: "#9e9e9e",
                priceInRupees: 2900,
                imagePath: "/products/vintage_tee.png",
                measurements: { chest: '22"', length: '30"', shoulder: '19.5"' },
                conditionKey: "condVeryGood",
                hotness: 3
            }
        ],
        // Default variant mapping
        sku: "prod-5-XL-green",
        size: "XL",
        colorName: "Forest Green",
        colorHex: "#009688",
        priceInRupees: 3200,
        imagePath: "/products/vintage_tee.png",
        measurements: { chest: '24"', length: '31"', shoulder: '21"' },
        conditionKey: "condExcellent",
        hotness: 4
    },
    {
        id: "prod-6",
        nameKey: "prod6Name",
        descKey: "prod6Desc",
        brand: "Wrangler Heavyweight",
        year: "1985",
        category: "denim",
        materialKey: "matDenim",
        variants: [
            {
                sku: "prod-6-L-indigo",
                size: "L",
                colorName: "Classic Indigo",
                colorHex: "#3f51b5",
                priceInRupees: 5500,
                imagePath: "/products/denim_jeans.png",
                measurements: { chest: '23"', length: '26" (jacket)', shoulder: '20"' },
                conditionKey: "condVeryGood",
                hotness: 5
            },
            {
                sku: "prod-6-M-stonewash",
                size: "M",
                colorName: "Stonewash Blue",
                colorHex: "#7986cb",
                priceInRupees: 5200,
                imagePath: "/products/denim_jeans.png",
                measurements: { chest: '21"', length: '25" (jacket)', shoulder: '19"' },
                conditionKey: "condGood",
                hotness: 4
            }
        ],
        // Default variant mapping
        sku: "prod-6-L-indigo",
        size: "L",
        colorName: "Classic Indigo",
        colorHex: "#3f51b5",
        priceInRupees: 5500,
        imagePath: "/products/denim_jeans.png",
        measurements: { chest: '23"', length: '26" (jacket)', shoulder: '20"' },
        conditionKey: "condVeryGood",
        hotness: 5
    },
    {
        id: "prod-7",
        nameKey: "prod7Name",
        descKey: "prod7Desc",
        brand: "Sears Vintage",
        year: "1974",
        category: "knits",
        materialKey: "matWool",
        variants: [
            {
                sku: "prod-7-L-pink",
                size: "L",
                colorName: "Vintage Rose",
                colorHex: "#e91e63",
                priceInRupees: 4900,
                imagePath: "/products/worker_shirt.png",
                measurements: { chest: '22"', length: '27"', shoulder: '19"' },
                conditionKey: "condGood",
                hotness: 3
            },
            {
                sku: "prod-7-M-cream",
                size: "M",
                colorName: "Cream Knit",
                colorHex: "#f5f5f5",
                priceInRupees: 4700,
                imagePath: "/products/worker_shirt.png",
                measurements: { chest: '20"', length: '26"', shoulder: '18"' },
                conditionKey: "condVeryGood",
                hotness: 4
            }
        ],
        // Default variant mapping
        sku: "prod-7-L-pink",
        size: "L",
        colorName: "Vintage Rose",
        colorHex: "#e91e63",
        priceInRupees: 4900,
        imagePath: "/products/worker_shirt.png",
        measurements: { chest: '22"', length: '27"', shoulder: '19"' },
        conditionKey: "condGood",
        hotness: 3
    },
    {
        id: "prod-8",
        nameKey: "prod8Name",
        descKey: "prod8Desc",
        brand: "Patagonia Synchilla",
        year: "1995",
        category: "cargo",
        materialKey: "matFleece",
        variants: [
            {
                sku: "prod-8-M-purple",
                size: "M",
                colorName: "Grape Purple",
                colorHex: "#9c27b0",
                priceInRupees: 6200,
                imagePath: "/products/cargo_pants.png",
                measurements: { chest: '21.5"', length: '27.5"', shoulder: '18.5"' },
                conditionKey: "condExcellent",
                hotness: 5
            },
            {
                sku: "prod-8-L-black",
                size: "L",
                colorName: "Obsidian Black",
                colorHex: "#111111",
                priceInRupees: 6500,
                imagePath: "/products/cargo_pants.png",
                measurements: { chest: '23"', length: '29"', shoulder: '20"' },
                conditionKey: "condExcellent",
                hotness: 4
            }
        ],
        // Default variant mapping
        sku: "prod-8-M-purple",
        size: "M",
        colorName: "Grape Purple",
        colorHex: "#9c27b0",
        priceInRupees: 6200,
        imagePath: "/products/cargo_pants.png",
        measurements: { chest: '21.5"', length: '27.5"', shoulder: '18.5"' },
        conditionKey: "condExcellent",
        hotness: 5
    },
    {
        id: "prod-9",
        nameKey: "prod9Name",
        descKey: "prod9Desc",
        brand: "Nirvana Tour Tee",
        year: "1993",
        category: "tees",
        materialKey: "matCotton",
        variants: [
            {
                sku: "prod-9-M-black",
                size: "M",
                colorName: "Faded Black",
                colorHex: "#212121",
                priceInRupees: 3800,
                imagePath: "/products/vintage_tee.png",
                measurements: { chest: '20"', length: '28"', shoulder: '18"' },
                conditionKey: "condVeryGood",
                hotness: 5
            },
            {
                sku: "prod-9-L-charcoal",
                size: "L",
                colorName: "Charcoal Grey",
                colorHex: "#37474f",
                priceInRupees: 4100,
                imagePath: "/products/vintage_tee.png",
                measurements: { chest: '22"', length: '29.5"', shoulder: '19.5"' },
                conditionKey: "condExcellent",
                hotness: 4
            }
        ],
        // Default variant mapping
        sku: "prod-9-M-black",
        size: "M",
        colorName: "Faded Black",
        colorHex: "#212121",
        priceInRupees: 3800,
        imagePath: "/products/vintage_tee.png",
        measurements: { chest: '20"', length: '28"', shoulder: '18"' },
        conditionKey: "condVeryGood",
        hotness: 5
    },
    {
        id: "prod-10",
        nameKey: "prod10Name",
        descKey: "prod10Desc",
        brand: "Lee Riders",
        year: "1991",
        category: "denim",
        materialKey: "matDenim",
        variants: [
            {
                sku: "prod-10-30-brown",
                size: "30 x 32",
                colorName: "Earth Brown",
                colorHex: "#795548",
                priceInRupees: 4200,
                imagePath: "/products/denim_jeans.png",
                measurements: { chest: 'N/A', length: '32" (inseam)', shoulder: 'N/A' },
                conditionKey: "condGood",
                hotness: 3
            },
            {
                sku: "prod-10-32-blue",
                size: "32 x 30",
                colorName: "Standard Blue",
                colorHex: "#5c6bc0",
                priceInRupees: 4400,
                imagePath: "/products/denim_jeans.png",
                measurements: { chest: 'N/A', length: '30" (inseam)', shoulder: 'N/A' },
                conditionKey: "condVeryGood",
                hotness: 4
            }
        ],
        // Default variant mapping
        sku: "prod-10-30-brown",
        size: "30 x 32",
        colorName: "Earth Brown",
        colorHex: "#795548",
        priceInRupees: 4200,
        imagePath: "/products/denim_jeans.png",
        measurements: { chest: 'N/A', length: '32" (inseam)', shoulder: 'N/A' },
        conditionKey: "condGood",
        hotness: 3
    },
    {
        id: "prod-11",
        nameKey: "prod11Name",
        descKey: "prod11Desc",
        brand: "Polo Ralph Lauren",
        year: "1992",
        category: "knits",
        materialKey: "matWool",
        variants: [
            {
                sku: "prod-11-XL-grey",
                size: "XL",
                colorName: "Steel Grey",
                colorHex: "#607d8b",
                priceInRupees: 5200,
                imagePath: "/products/worker_shirt.png",
                measurements: { chest: '25"', length: '30"', shoulder: '22"' },
                conditionKey: "condExcellent",
                hotness: 4
            },
            {
                sku: "prod-11-L-navy",
                size: "L",
                colorName: "Navy Blue",
                colorHex: "#1a237e",
                priceInRupees: 4950,
                imagePath: "/products/worker_shirt.png",
                measurements: { chest: '23"', length: '28.5"', shoulder: '20"' },
                conditionKey: "condVeryGood",
                hotness: 3
            }
        ],
        // Default variant mapping
        sku: "prod-11-XL-grey",
        size: "XL",
        colorName: "Steel Grey",
        colorHex: "#607d8b",
        priceInRupees: 5200,
        imagePath: "/products/worker_shirt.png",
        measurements: { chest: '25"', length: '30"', shoulder: '22"' },
        conditionKey: "condExcellent",
        hotness: 4
    },
    {
        id: "prod-12",
        nameKey: "prod12Name",
        descKey: "prod12Desc",
        brand: "Columbia Sportswear",
        year: "1990",
        category: "cargo",
        materialKey: "matNylon",
        variants: [
            {
                sku: "prod-12-L-cyan",
                size: "L",
                colorName: "Aqua Cyan",
                colorHex: "#00bcd4",
                priceInRupees: 3700,
                imagePath: "/products/cargo_pants.png",
                measurements: { chest: '23"', length: '28"', shoulder: '20"' },
                conditionKey: "condVeryGood",
                hotness: 4
            },
            {
                sku: "prod-12-M-navy",
                size: "M",
                colorName: "Navy Blue",
                colorHex: "#0d47a1",
                priceInRupees: 3500,
                imagePath: "/products/cargo_pants.png",
                measurements: { chest: '21"', length: '27"', shoulder: '18.5"' },
                conditionKey: "condGood",
                hotness: 3
            }
        ],
        // Default variant mapping
        sku: "prod-12-L-cyan",
        size: "L",
        colorName: "Aqua Cyan",
        colorHex: "#00bcd4",
        priceInRupees: 3700,
        imagePath: "/products/cargo_pants.png",
        measurements: { chest: '23"', length: '28"', shoulder: '20"' },
        conditionKey: "condVeryGood",
        hotness: 4
    },
];
