import "dotenv/config";
import { db } from "@/db";
import { links, type NewLink } from "@/db/schema";
import { eq } from "drizzle-orm";

const SEED_USER_ID = "user_37eJO4MXCcqwUtDj0UFOGKuARUV";

const seedData: NewLink[] = [
  {
    userId: SEED_USER_ID,
    shortCode: "gh-repo",
    url: "https://github.com/vercel/next.js",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "yt-vid",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "x-post",
    url: "https://x.com/vercel/status/1234567890",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "medium-ai",
    url: "https://medium.com/@example/understanding-ai-transformers-2024",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "so-question",
    url: "https://stackoverflow.com/questions/12345678/how-to-use-async-await",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "docs-next",
    url: "https://nextjs.org/docs/app/building-your-application",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "linkedin-prof",
    url: "https://www.linkedin.com/in/example-developer",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "reddit-web",
    url: "https://www.reddit.com/r/webdev/comments/example/best-practices-2026",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "devto-tutorial",
    url: "https://dev.to/example/building-fullstack-apps-with-nextjs-2024",
  },
  {
    userId: SEED_USER_ID,
    shortCode: "product-page",
    url: "https://www.stripe.com/products/billing",
  },
];

async function seed() {
  try {
    console.log("🌱 Starting seed script...");
    console.log("🔍 Checking for existing seed data...");

    // Check if seed data already exists for the seed user
    const existingSeed = await db
      .select()
      .from(links)
      .where(eq(links.userId, SEED_USER_ID))
      .limit(1);

    if (existingSeed.length > 0) {
      console.log("✅ Seed data already exists. Skipping seed.");
      process.exit(0);
    }

    console.log("📝 Inserting seed data...");

    const inserted = await db.insert(links).values(seedData).returning();

    console.log("✅ Seed completed successfully!");
    console.log(`   Inserted ${inserted.length} links for user ${SEED_USER_ID}`);
    console.log("\n📋 Seeded links:");
    inserted.forEach((link) => {
      console.log(`   - ${link.shortCode} → ${link.url}`);
    });
  } catch (error) {
    console.error("❌ Seed failed:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);

      if (error.message.includes("connect")) {
        console.error("💡 Check your DATABASE_URL environment variable");
      }
      if (error.message.includes("unique")) {
        console.error("💡 Seed data might already exist. Delete records manually if needed.");
      }
    } else {
      console.error("   Unknown error:", error);
    }
    process.exit(1);
  }
}

// Execute seed function
seed();
