import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./src/models/Category.js";
import Product from "./src/models/Product.js";
import Coupon from "./src/models/Coupon.js";

dotenv.config();

// ─────────────────────────────────────────────────────────
//  CATEGORIES
// ─────────────────────────────────────────────────────────
const categoriesData = [
  {
    name: "Baby Furniture",
    slug: "baby-furniture",
    description: "Cribs, bassinets, changing tables & nursery furniture",
    image: "/images/img1.png"
  },
  {
    name: "Organic Apparel",
    slug: "baby-clothing",
    description: "100% organic cotton rompers, swaddles, jhablas & mittens",
    image: "/images/img4.webp"
  },
  {
    name: "Feeding & Gear",
    slug: "feeding-nursing",
    description: "Anti-colic bottles, sterilisers, weaning sets & breast pumps",
    image: "/images/img8.jpg"
  },
  {
    name: "Strollers & Travel",
    slug: "strollers-travel",
    description: "Lightweight strollers, 3-in-1 travel systems & car seats",
    image: "/images/img10.webp"
  },
  {
    name: "Bath & Skincare",
    slug: "bath-skincare",
    description: "Tear-free washes, cradle cap oils, body lotions & bath gift sets",
    image: "/images/img14.jpg"
  }
];

// ─────────────────────────────────────────────────────────
//  PRODUCTS (User Specified Catalog)
// ─────────────────────────────────────────────────────────
const productsData = [
  // ━━━ 1. NURSERY & FURNITURE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "Nordic 4-in-1 Convertible Pinewood Crib",
    slug: "nordic-4in1-convertible-pinewood-crib",
    description: "Solid pinewood crib with adjustable mattress height; converts to a toddler bed and daybed as your child grows",
    price: 14999,
    discountPrice: 12999,
    categorySlug: "baby-furniture",
    images: ["/images/img1.png"],
    stock: 15,
    ageGroup: "1-3y",
    brand: "Nordic Nursery",
    ratingsAverage: 4.9,
    numReviews: 42,
    isFeatured: true
  },
  {
    name: "Soft-Close Nursery Glider Rocking Chair",
    slug: "soft-close-nursery-glider-rocking-chair",
    description: "Cushioned glider with matching ottoman, smooth soft-close motion for late-night feeds",
    price: 14499,
    discountPrice: 12499,
    categorySlug: "baby-furniture",
    images: ["/images/baby-crib.jpg"],
    stock: 12,
    ageGroup: "0-6m",
    brand: "ComfortNursery",
    ratingsAverage: 4.8,
    numReviews: 28,
    isFeatured: true
  },
  {
    name: "Adjustable-Height Baby Cot with Storage Drawer",
    slug: "adjustable-height-baby-cot-storage-drawer",
    description: "Engineered wood cot with under-bed storage drawer and teething-safe rails",
    price: 9999,
    discountPrice: 8499,
    categorySlug: "baby-furniture",
    images: ["/images/img2.jpg"],
    stock: 4,
    ageGroup: "6-12m",
    brand: "NK Enterprises",
    ratingsAverage: 4.7,
    numReviews: 35,
    isFeatured: false
  },
  {
    name: "Cloud & Stars Cotton Crib Mobile with Music Box",
    slug: "cloud-stars-cotton-crib-mobile-music-box",
    description: "Hand-stitched hanging mobile with soft chimes and a wind-up lullaby box",
    price: 1299,
    discountPrice: 999,
    categorySlug: "baby-furniture",
    images: ["/images/img3.jpg"],
    stock: 25,
    ageGroup: "0-6m",
    brand: "DreamyBabies",
    ratingsAverage: 4.9,
    numReviews: 64,
    isFeatured: false
  },

  // ━━━ 2. ORGANIC APPAREL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "GOTS-Certified Organic Romper Set (Pack of 3)",
    slug: "gots-certified-organic-romper-set-3pack",
    description: "100% organic cotton rompers, breathable and gentle on newborn skin, sizes 0–12 months",
    price: 1299,
    discountPrice: 1099,
    categorySlug: "baby-clothing",
    images: ["/images/img4.webp"],
    stock: 35,
    ageGroup: "6-12m",
    brand: "OrganicKids",
    ratingsAverage: 4.8,
    numReviews: 88,
    isFeatured: true
  },
  {
    name: "Organic Muslin Swaddle Wrap (Set of 2)",
    slug: "organic-muslin-swaddle-wrap-2pack",
    description: "Soft, breathable muslin wraps for swaddling and everyday use",
    price: 899,
    discountPrice: 699,
    categorySlug: "baby-clothing",
    images: ["/images/img6.webp"],
    stock: 40,
    ageGroup: "0-6m",
    brand: "GreenSprout",
    ratingsAverage: 4.9,
    numReviews: 112,
    isFeatured: true
  },
  {
    name: "Newborn Jhabla & Pyjama Gift Set",
    slug: "newborn-jhabla-pyjama-gift-set",
    description: "5-piece organic cotton gift set — jhabla, pyjama, cap, mittens, and booties",
    price: 1599,
    discountPrice: 1299,
    categorySlug: "baby-clothing",
    images: ["/images/img5.webp"],
    stock: 20,
    ageGroup: "0-6m",
    brand: "NK Organic",
    ratingsAverage: 4.7,
    numReviews: 45,
    isFeatured: false
  },
  {
    name: "Organic Cotton Booties & Mittens Combo",
    slug: "organic-cotton-booties-mittens-combo",
    description: "Ribbed-ankle booties and scratch-proof mittens for infants 0–6 months",
    price: 399,
    discountPrice: 299,
    categorySlug: "baby-clothing",
    images: ["/images/baby-clothing.jpg"],
    stock: 5,
    ageGroup: "0-6m",
    brand: "LittleToes",
    ratingsAverage: 4.6,
    numReviews: 29,
    isFeatured: false
  },

  // ━━━ 3. FEEDING & GEAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "Anti-Colic Glass Feeding Bottle Set (Pack of 3)",
    slug: "anti-colic-glass-feeding-bottle-set-3pack",
    description: "BPA-free glass bottles with anti-colic vent system, 125ml/250ml sizes",
    price: 1799,
    discountPrice: 1499,
    categorySlug: "feeding-nursing",
    images: ["/images/img8.jpg"],
    stock: 30,
    ageGroup: "0-6m",
    brand: "AventCare",
    ratingsAverage: 4.9,
    numReviews: 94,
    isFeatured: true
  },
  {
    name: "6-Bottle Electric Steam Steriliser & Dryer",
    slug: "6bottle-electric-steam-steriliser-dryer",
    description: "Kills 99.9% germs in under 10 minutes; keeps contents sterile for 24 hours",
    price: 3499,
    discountPrice: 2999,
    categorySlug: "feeding-nursing",
    images: ["/images/img7.jpg"],
    stock: 18,
    ageGroup: "0-6m",
    brand: "PureSteam",
    ratingsAverage: 4.8,
    numReviews: 56,
    isFeatured: true
  },
  {
    name: "Silicone Weaning Bowl & Spoon Set",
    slug: "silicone-weaning-bowl-spoon-set",
    description: "Suction-base bowl with soft-tip spoons for mess-free first foods",
    price: 699,
    discountPrice: 499,
    categorySlug: "feeding-nursing",
    images: ["/images/baby-feeding.jpg"],
    stock: 50,
    ageGroup: "6-12m",
    brand: "BabyBites",
    ratingsAverage: 4.7,
    numReviews: 78,
    isFeatured: false
  },
  {
    name: "Manual Breast Pump with Storage Bags",
    slug: "manual-breast-pump-storage-bags",
    description: "Comfort-fit manual pump with 20 reusable breastmilk storage bags",
    price: 1299,
    discountPrice: 999,
    categorySlug: "feeding-nursing",
    images: ["/images/baby-feeding.jpg"],
    stock: 6,
    ageGroup: "0-6m",
    brand: "MotherTouch",
    ratingsAverage: 4.6,
    numReviews: 32,
    isFeatured: false
  },

  // ━━━ 4. STROLLERS & TRAVEL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "UltraFold Lightweight Travel Stroller",
    slug: "ultrafold-lightweight-travel-stroller",
    description: "Under-8kg one-hand fold, 5-point harness, ideal for daily use and flights",
    price: 6999,
    discountPrice: 5999,
    categorySlug: "strollers-travel",
    images: ["/images/img10.webp"],
    stock: 22,
    ageGroup: "1-3y",
    brand: "FlyBaby",
    ratingsAverage: 4.9,
    numReviews: 105,
    isFeatured: true
  },
  {
    name: "3-in-1 Travel System with Car Seat",
    slug: "3in1-travel-system-with-car-seat",
    description: "Stroller frame + infant car seat + carry cot combo, birth to 4 years",
    price: 18999,
    discountPrice: 15999,
    categorySlug: "strollers-travel",
    images: ["/images/img9.jpg"],
    stock: 10,
    ageGroup: "3y+",
    brand: "OmniRide",
    ratingsAverage: 4.9,
    numReviews: 72,
    isFeatured: true
  },
  {
    name: "Compact Cabin-Friendly Umbrella Stroller",
    slug: "compact-cabin-friendly-umbrella-stroller",
    description: "Ultra-compact fold, fits carry-on luggage limits, self-standing when folded",
    price: 4499,
    discountPrice: 3799,
    categorySlug: "strollers-travel",
    images: ["/images/baby-stroller.jpg"],
    stock: 15,
    ageGroup: "6-12m",
    brand: "TravelLite",
    ratingsAverage: 4.7,
    numReviews: 48,
    isFeatured: false
  },
  {
    name: "All-Terrain Jogging Stroller",
    slug: "all-terrain-jogging-stroller",
    description: "Shock-absorbing wheels with adjustable canopy and large storage basket",
    price: 11999,
    discountPrice: 9999,
    categorySlug: "strollers-travel",
    images: ["/images/baby-stroller.jpg"],
    stock: 3,
    ageGroup: "3y+",
    brand: "ActiveBaby",
    ratingsAverage: 4.8,
    numReviews: 38,
    isFeatured: false
  },

  // ━━━ 5. BATH & SKINCARE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "Tear-Free Baby Shampoo & Body Wash (400ml)",
    slug: "tear-free-baby-shampoo-body-wash-400ml",
    description: "Gentle head-to-toe cleanser, paraben-free, dermatologically tested",
    price: 399,
    discountPrice: 299,
    categorySlug: "bath-skincare",
    images: ["/images/img14.jpg"],
    stock: 60,
    ageGroup: "0-6m",
    brand: "PurePure",
    ratingsAverage: 4.9,
    numReviews: 120,
    isFeatured: true
  },
  {
    name: "Cradle Cap Care Massage Oil (200ml)",
    slug: "cradle-cap-care-massage-oil-200ml",
    description: "Nourishing oil blend to soften scalp scales, safe for daily massage",
    price: 349,
    discountPrice: 249,
    categorySlug: "bath-skincare",
    images: ["/images/baby-bathcare.jpg"],
    stock: 45,
    ageGroup: "0-6m",
    brand: "OrganicRoots",
    ratingsAverage: 4.8,
    numReviews: 82,
    isFeatured: true
  },
  {
    name: "Hypoallergenic Body Lotion with Shea Butter",
    slug: "hypoallergenic-body-lotion-shea-butter",
    description: "24-hour moisture lock for sensitive, delicate skin",
    price: 449,
    discountPrice: 349,
    categorySlug: "bath-skincare",
    images: ["/images/care.jpg"],
    stock: 50,
    ageGroup: "0-6m",
    brand: "BeGreen",
    ratingsAverage: 4.7,
    numReviews: 65,
    isFeatured: false
  },
  {
    name: "Organic Baby Bath Time Gift Set (4-in-1)",
    slug: "organic-baby-bath-time-gift-set-4in1",
    description: "Wash, lotion, oil, and powder in a reusable gift box",
    price: 1199,
    discountPrice: 899,
    categorySlug: "bath-skincare",
    images: ["/images/img11.webp"],
    stock: 4,
    ageGroup: "0-6m",
    brand: "BeGreen",
    ratingsAverage: 4.9,
    numReviews: 54,
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

    console.log("\nClearing existing categories, products, and coupons...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    console.log("✅ Cleared all existing data");

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
