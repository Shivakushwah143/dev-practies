docker run --name local-postgres1 -e POSTGRES_USER=shiva -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=assignment2 -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres:latest

-------->
PS C:\Users\shiva kushwah\Desktop\dev-practies\day2> docker run --name local-postgres1 -e POSTGRES_USER=shiva -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=assignment2 -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres:latest
3af2a9d308c6f20500d294e3c37b23d193071188165ead37a32adcf5d1b7bbe6
PS C:\Users\shiva kushwah\Desktop\dev-practies\day2>
----->

step 2 
------->
PS C:\Users\shiva kushwah\Desktop\dev-practies\day2> npm install express @prisma/client prisma zod jsonwebtoken bcrypt dotenv

PS C:\Users\shiva kushwah\Desktop\dev-practies\day2> npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/bcrypt
------->

step 3 
----------------->
generator client {
  provider = "prisma-client-js"
  engineType = "binary"
}
datasource db {
  provider = "postgresql"
}

----------------------->

step 4
-------> ----------------------------------------------------------------------->
-------> ----------------------------------------------------------------------->
import type { Request, Response } from "express";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const app = express();

const PORT: number = Number(process.env.PORT) || 4000;

app.use(express.json());

const { Pool } = pg;

const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
console.log(DATABASE_URL)

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: "ok",
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return res.status(500).json({
    
      message: "Database not reachable",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


-------> ----------------------------------------------------------------------->
-------> ----------------------------------------------------------------------->

step 5

![alt text](image.png)

PS C:\Users\shiva kushwah\Desktop\dev-practies\day2>   npx prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma\schema.prisma.

✔ Generated Prisma Client (v7.4.0) to .\node_modules\@prisma\client in 84ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)


PS C:\Users\shiva kushwah\Desktop\dev-practies\day2>

------------------------------------------>>-------------------------------------------------->
PS C:\Users\shiva kushwah\Desktop\dev-practies\day2> npx prisma migrate dev
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma\schema.prisma.

Prisma schema loaded from prisma\schema.prisma.
Datasource "db": PostgreSQL database "assignment2", schema "public" at "localhost:5432"

PostgreSQL database assignment2 created at localhost:5432

√ Enter a name for the new migration: ... init
Applying migration `20260219172312_init`

The following migration(s) have been created and applied from new schema changes:
![alt text](image-1.png)

----------------------------------------->------------------------------------>------------------------>

step end 
PS C:\Users\shiva kushwah\Desktop\dev-practies\day2> npm run dev

> day2@1.0.0 dev
> tsc  -b && node dist/index.js

[dotenv@17.3.1] injecting env (2) from .env -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2
postgresql://shiva:secretpassword@localhost:5432/assignment2
Server running on port 4000

------------------------------------------------------------------------------------->