import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 4000;
app.use(express.json());
const { Pool } = pg;
const DATABASE_URL = process.env.DATABASE_URL;
console.log(DATABASE_URL);
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}
const pool = new Pool({
    connectionString: DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const createPrismaClient = () => new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
});
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
app.get("/health", async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return res.status(200).json({
            status: "ok",
            environment: process.env.NODE_ENV,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Database not reachable",
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map