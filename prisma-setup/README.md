

   "include": ["src/**/*", "lib/**/*","src"],
   "exclude": ["node_modules", "dist"]

 npm install express @prisma/client prisma zod jsonwebtoken bcrypt dotenv


 npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/bcrypt


 docker run --name local-postgres -e POSTGRES_USER=shiva -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=assignment1 -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres:latest

 PS C:\Users\shiva kushwah\Desktop\dev-practies\day1> docker run --name local-postgres -e POSTGRES_USER=shiva -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=assignment1 -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres:latest
 3347d425b93ce9ef872ef354f8cbb9adafc5bf8461e69d69536264ddeb6896ee       
// PS C:\Users\shiva kushwah\Desktop\dev-practies\day1>




// generator client {
//   provider = "prisma-client"
//   output   = "../src/generated/prisma"
// }

// datasource db {
//   provider = "postgresql"
// }
//  this  to this  ====> 
// 
// generator client {
//   provider = "prisma-client-js"
//   engineType = "binary"
// }
// datasource db {
//   provider = "postgresql"
// }

// npx prisma generate ------> PS C:\Users\shiva kushwah\Desktop\dev-practies\day1> npx prisma generate
// Loaded Prisma config from prisma.config.ts.

// Prisma schema loaded from prisma\schema.prisma.

// ✔ Generated Prisma Client (v7.4.0) to .\node_modules\@prisma\client in 181ms

// Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)



//  PS C:\Users\shiva kushwah\Desktop\dev-practies\day1>------> npx  prisma migrat
// e dev
// Loaded Prisma config from prisma.config.ts.

// Prisma schema loaded from prisma\schema.prisma.
// Datasource "db": PostgreSQL database "assignment1", schema "public" at "localhost:5432"

// PostgreSQL database assignment1 created at localhost:5432

// √ Enter a name for the new migration: ... init
// Applying migration `20260219160457_init`

// The following migration(s) have been created and applied from new schema changes:

// prisma\migrations/
//   └─ 20260219160457_init/
//     └─ migration.sql

// Your database is now in sync with your schema.

// PS C:\Users\shiva kushwah\Desktop\dev-practies\day1> 


// PS C:\Users\shiva kushwah\Desktop\dev-practies\day1> npm install pg @prisma/adapter-pg

// added 17 packages, and audited 267 packages in 16s

// 43 packages are looking for funding
//   run `npm fund` for details

// 12 vulnerabilities (8 moderate, 4 high)

// To address issues that do not require attention, run:
//   npm audit fix

// To address all issues possible (including breaking changes), run:
//   npm audit fix --force

// Some issues need review, and may require choosing
// a different dependency.

// Run `npm audit` for details.
// PS C:\Users\shiva kushwah\Desktop\dev-practies\day1> npm install -D @types/pg

// added 1 package, and audited 268 packages in 4s

// 43 packages are looking for funding
//   run `npm fund` for details

// 12 vulnerabilities (8 moderate, 4 high)

// To address issues that do not require attention, run:
//   npm audit fix

// To address all issues possible (including breaking changes), run:
//   npm audit fix --force

// Some issues need review, and may require choosing
// a different dependency.

// Run `npm audit` for details.
// PS C:\Users\shiva kushwah\Desktop\dev-practies\day1>