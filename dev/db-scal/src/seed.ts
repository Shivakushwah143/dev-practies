import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const { Pool } = pg;

const DATABASE_URL: string | undefined = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const TOTAL_RECORDS = 500_000;
const BATCH_SIZE = 5_000;

function generateUsers(count: number, offset: number) {
  const users: { email: string; name: string }[] = [];

  for (let i = 0; i < count; i++) {
    const id = offset + i;
    users.push({
      email: `user${id}@example.com`,
      name: `User ${id}`,
    });
  }

  return users;
}

async function main() {
  console.log("Seeding started...");

  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batch = generateUsers(BATCH_SIZE, i);

    await prisma.user.createMany({
      data: batch,
    });

    console.log(`Inserted: ${i + BATCH_SIZE}`);
  }

  console.log("Seeding completed.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
