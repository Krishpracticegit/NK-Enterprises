import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./src/models/Category.js";
import Product from "./src/models/Product.js";
import Coupon from "./src/models/Coupon.js";
import StoreSettings from "./src/models/StoreSettings.js";

dotenv.config();

// ─────────────────────────────────────────────────────────
//  CATEGORIES
// ─────────────────────────────────────────────────────────
const categoriesData = [
  {
    name: "Baby Walkers",
    slug: "baby-walkers",
    description: "Safe, anti-rollover & interactive activity walkers for babies",
    image: "/images/img10.webp"
  },
  {
    name: "Baby Bottles",
    slug: "baby-bottles",
    description: "BPA-free anti-colic glass & silicone feeding bottles for infants",
    image: "/images/img8.jpg"
  }
];

// ─────────────────────────────────────────────────────────
//  PRODUCTS (User Specified Catalog: Baby Walkers & Baby Bottles)
// ─────────────────────────────────────────────────────────
const productsData = [
  // ━━━ 1. BABY WALKERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "Ergonomic Anti-Rollover Baby Walker with Adjustable Height",
    slug: "ergonomic-anti-rollover-baby-walker-adjustable-height",
    description: "Padded 3D breathable seat cushion, 3-level height adjustment, and silent 360-degree swivel wheels.",
    price: 4299,
    discountPrice: 3699,
    categorySlug: "baby-walkers",
    images: ["/images/img9.jpg"],
    stock: 15,
    ageGroup: "6-12m",
    brand: "SafeStep Baby",
    ratingsAverage: 4.9,
    numReviews: 24,
    isFeatured: true
  },
  {
    name: "Wooden Push & Learn Baby Learning Walker",
    slug: "wooden-push-learn-baby-learning-walker",
    description: "Crafted from eco-friendly premium wood with sorting blocks, xylophone, and non-slip rubber edges.",
    price: 2999,
    discountPrice: 2499,
    categorySlug: "baby-walkers",
    images: ["/images/baby-stroller.jpg"],
    stock: 12,
    ageGroup: "1-3y",
    brand: "EcoBaby",
    ratingsAverage: 4.7,
    numReviews: 15,
    isFeatured: false
  },
  {
    name: "Foldable Multi-Speed Baby Walker with Soft Cushion",
    slug: "foldable-multi-speed-baby-walker-soft-cushion",
    description: "Ultra-compact folding walker for easy travel, washable seat pad, and soft toy bar.",
    price: 2799,
    discountPrice: 2299,
    categorySlug: "baby-walkers",
    images: ["/images/img10.webp"],
    stock: 20,
    ageGroup: "6-12m",
    brand: "NK Enterprises",
    ratingsAverage: 4.6,
    numReviews: 11,
    isFeatured: false
  },

  // ━━━ 2. BABY BOTTLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "BPA-Free Wide-Neck Silicone Baby Bottle (250ml)",
    slug: "bpa-free-wide-neck-silicone-baby-bottle-250ml",
    description: "Ultra-soft medical grade silicone body mimicking natural breastfeeding latch.",
    price: 899,
    discountPrice: 699,
    categorySlug: "baby-bottles",
    images: ["/images/img7.jpg"],
    stock: 40,
    ageGroup: "0-6m",
    brand: "PureCare",
    ratingsAverage: 4.8,
    numReviews: 27,
    isFeatured: true
  },
  {
    name: "Thermal Insulated Stainless Steel Baby Bottle (200ml)",
    slug: "thermal-insulated-stainless-steel-baby-bottle-200ml",
    description: "Double-wall vacuum insulated bottle keeping milk warm for up to 6 hours with leak-proof nipple cap.",
    price: 1299,
    discountPrice: 999,
    categorySlug: "baby-bottles",
    images: ["/images/baby-feeding.jpg"],
    stock: 18,
    ageGroup: "6-12m",
    brand: "NK Enterprises",
    ratingsAverage: 4.7,
    numReviews: 19,
    isFeatured: false
  },
  {
    name: "Newborn Starter Feeding Bottle & Teat Set",
    slug: "newborn-starter-feeding-bottle-teat-set",
    description: "Complete gift set including 2 anti-colic bottles, slow-flow teats, and cleaning brush.",
    price: 1499,
    discountPrice: 1199,
    categorySlug: "baby-bottles",
    images: ["/images/img8.jpg"],
    stock: 22,
    ageGroup: "0-6m",
    brand: "AventCare",
    ratingsAverage: 4.9,
    numReviews: 41,
    isFeatured: false
  }
];

// ─────────────────────────────────────────────────────────
//  COUPONS
// ─────────────────────────────────────────────────────────
const couponsData = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    minOrderValue: 500,
    expiryDate: new Date("2028-12-31"),
    isActive: true
  },
  {
    code: "BABYLOVE15",
    discountPercent: 15,
    minOrderValue: 1000,
    expiryDate: new Date("2028-12-31"),
    isActive: true
  },
  {
    code: "FLAT20",
    discountPercent: 20,
    minOrderValue: 2000,
    expiryDate: new Date("2028-12-31"),
    isActive: true
  }
];

async function seedDB() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nk_enterprises";
    console.log(`\n🌱 Connecting to MongoDB: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log("\n✅ Connected to MongoDB successfully");

    console.log("\nClearing existing categories, products, coupons, and store settings...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await StoreSettings.deleteMany({});
    console.log("✅ Cleared all existing data");

    console.log("\nSeeding store settings...");
    await StoreSettings.create({
      storeName: "NK ENTERPRISES Flagship Store",
      address: "5/2 street-09 Geeta colony , Delhi-110031",
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      email: "support@nkenterprises.com",
      latitude: 28.6538,
      longitude: 77.2730
    });
    console.log("✅ Created store settings with updated address");

    console.log("\nSeeding categories...");
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${createdCategories.length} categories`);

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log("\nSeeding products...");
    const productsWithCatIds = productsData.map(prod => {
      const catId = categoryMap[prod.categorySlug];
      if (!catId) {
        throw new Error(`Category slug "${prod.categorySlug}" not found for product "${prod.name}"`);
      }
      return {
        ...prod,
        category: catId
      };
    });

    const createdProducts = await Product.insertMany(productsWithCatIds);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log("\nSeeding coupons...");
    const createdCoupons = await Coupon.insertMany(couponsData);
    console.log(`✅ Created ${createdCoupons.length} coupons`);

    console.log("\n=============================================");
    console.log("  DATABASE SEEDED WITH USER CATALOG SUCCESSFULLY!");
    console.log("=============================================");
    console.log(`  Categories : ${createdCategories.length}`);
    console.log(`  Products   : ${createdProducts.length}`);
    console.log(`  Coupons    : ${createdCoupons.length}`);
    console.log("=============================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed error:", error);
    process.exit(1);
  }
}

seedDB();
