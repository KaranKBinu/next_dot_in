import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, "next_dot_in_salt", 1000, 64, "sha512").toString("hex");
}

async function main() {
  console.log("Seeding initial database & demo items with images...");

  const adminEmail = "admin@next.in";
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Store Admin",
        passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "admin123"),
        role: "ADMIN",
      },
    });
  }

  const masterEmail = "master@next.in";
  let master = await prisma.user.findUnique({ where: { email: masterEmail } });
  if (!master) {
    master = await prisma.user.create({
      data: {
        email: masterEmail,
        name: "Master Admin",
        passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "admin123"),
        role: "MASTER_ADMIN",
      },
    });
  }

  // Seed Categories
  const catTees = await prisma.category.upsert({
    where: { slug: "t-shirts" },
    update: {},
    create: { name: "T-Shirts", slug: "t-shirts", description: "Casual & graphic tees" },
  });

  const catDenim = await prisma.category.upsert({
    where: { slug: "jeans-denim" },
    update: {},
    create: { name: "Jeans & Denim", slug: "jeans-denim", description: "Classic & relaxed fit denim" },
  });

  const catSneakers = await prisma.category.upsert({
    where: { slug: "sneakers" },
    update: {},
    create: { name: "Sneakers", slug: "sneakers", description: "Footwear & kicks" },
  });

  // Seed Products with generated image paths
  const demoProducts = [
    {
      name: "Essential Heavyweight Oversized Tee",
      slug: "essential-heavyweight-oversized-tee",
      description: "Crafted from 280GSM heavy combed cotton with relaxed shoulders and a structured fit.",
      price: 1499,
      compareAtPrice: 1999,
      barcode: "SKU-TEE-001",
      stock: 25,
      categoryId: catTees.id,
      images: ["/tshirt_product_sample_1785257457017.png"],
      isFeatured: true,
      isPublished: true,
    },
    {
      name: "Relaxed Fit Indigo Selvedge Denim",
      slug: "relaxed-fit-indigo-selvedge-denim",
      description: "Custom dark indigo wash denim featuring Japanese selvedge detailing and reinforced stitching.",
      price: 3499,
      compareAtPrice: 4299,
      barcode: "SKU-DNM-002",
      stock: 12,
      categoryId: catDenim.id,
      images: ["/denim_product_sample_1785257473858.png"],
      isFeatured: true,
      isPublished: true,
    },
    {
      name: "Monochrome Low-Top Leather Kicks",
      slug: "monochrome-low-top-leather-kicks",
      description: "Minimalist black and white full-grain leather sneakers with cushioned soles and tonal laces.",
      price: 4999,
      compareAtPrice: 5999,
      barcode: "SKU-SNK-003",
      stock: 8,
      categoryId: catSneakers.id,
      images: ["/sneakers_product_sample_1785257488411.png"],
      isFeatured: true,
      isPublished: true,
    },
  ];

  for (const p of demoProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { images: p.images, isFeatured: true, isPublished: true },
      create: p,
    });
  }

  // Seed Demo Coupons
  const demoCoupons = [
    {
      code: "WELCOME10",
      description: "10% OFF Welcome Discount (Max ₹500)",
      discountType: "PERCENTAGE",
      value: 10,
      maxDiscountAmount: 500,
      minOrderAmount: 0,
      isActive: true,
    },
    {
      code: "SAVE500",
      description: "Flat ₹500 OFF on orders above ₹2,000",
      discountType: "FIXED",
      value: 500,
      minOrderAmount: 2000,
      isActive: true,
    },
    {
      code: "VIP25",
      description: "25% OFF VIP Special (Max ₹1,500)",
      discountType: "PERCENTAGE",
      value: 25,
      maxDiscountAmount: 1500,
      minOrderAmount: 1000,
      perUserLimit: 1,
      isActive: true,
    },
  ];

  for (const c of demoCoupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  console.log("Seeding with images & coupons completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
