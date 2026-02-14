import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient, type RedisClientType } from "redis";

dotenv.config();

/* ----------------------------- App Setup ----------------------------- */

const app = express();
app.use(express.json());

const PORT: number = Number(process.env.PORT) || 4000;

/* ----------------------------- Environment ---------------------------- */

const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
const REDIS_URL: string | undefined = process.env.REDIS_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

/* ----------------------------- PostgreSQL ----------------------------- */

const { Pool } = pg;

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased from 2000 to 10000
  // Add these options
  allowExitOnIdle: true,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

/* ------------------------------- Redis ------------------------------- */

const redis: RedisClientType = createClient({
  url: REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

/* ----------------------------- Routes ----------------------------- */

app.get("/users/:email", async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const cacheKey: string = `user:${email}`;
  const start = Date.now();

  try {
    // 1️⃣ Check Redis
    let cached: string | null = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (redisError) {
      console.error("Redis get error:", redisError);
      // Continue to database if Redis fails
    }

    if (cached) {
      const duration = Date.now() - start;
      return res.status(200).json({
        source: "cache",
        durationMs: duration,
        user: JSON.parse(cached),
      });
    }

    // 2️⃣ Fetch from DB
    let user;
    try {
      user = await prisma.user.findFirst({
        where: { email: email as string },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        message: "Database error occurred",
        error: dbError instanceof Error ? dbError.message : "Unknown database error"
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Store in Redis (60 sec TTL)
    try {
      await redis.set(cacheKey, JSON.stringify(user), {
        EX: 60,
      });
    } catch (redisError) {
      console.error("Redis set error:", redisError);
      // Continue even if Redis fails - just don't cache
    }

    const duration = Date.now() - start;
    return res.status(200).json({
      source: "database",
      durationMs: duration,
      user,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Add a test endpoint to check database connection
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Test Redis connection
    await redis.ping();
    
    res.json({ 
      status: "healthy", 
      database: "connected", 
      redis: "connected" 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "unhealthy", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Add a test endpoint to create a user (for testing)
app.post("/users", async (req: Request, res: Response) => {
  const { email, name } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
      },
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ 
      message: "Failed to create user",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/* --------------------------- Graceful Shutdown --------------------------- */

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  await pool.end();
  await redis.quit();
  process.exit(0);
});

/* --------------------------- Server Bootstrap --------------------------- */

async function startServer(): Promise<void> {
  try {
    await redis.connect();
    console.log("✅ Redis connected successfully");

    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 Create test user: POST http://localhost:${PORT}/users`);
      console.log(`📍 Get user: GET http://localhost:${PORT}/users/test@example.com`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();