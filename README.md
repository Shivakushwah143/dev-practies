📘 Database Scaling Lab — 500K Rows + Index + Redis
🚀 Goal

Simulate real-world backend scaling from:

❌ Full table scan (4s per request)

✅ Indexed lookup (~300ms)

🚀 Redis cached lookup (~50ms)

📈 500+ requests/sec under load

This project demonstrates how backend performance evolves through layered optimizations.

🏗 Tech Stack

Node.js (compiled TypeScript)

Express

PostgreSQL (Neon Cloud)

Prisma (with pg adapter)

Redis (Upstash)

Autocannon (load testing)

📊 What We Built
1️⃣ Seeded 500,000 Users

Inserted in 5k batch chunks

Simulated realistic production dataset

2️⃣ Baseline (No Index)

Query:

GET /users/:email


Result:

~4000ms response time

Full table scan

System collapses under 50 concurrent users

3️⃣ Added Index on email
email String @unique


Result:

~300ms response time

O(log n) B-Tree lookup

Massive improvement

Still DB-bound under concurrency

4️⃣ Added Redis Caching

Flow:

Request → Redis → (if miss) DB → Store in Redis → Return


TTL: 60 seconds

Results:

Stage	Throughput	Avg Latency
No index	❌ crash	~4s
With index	~20 req/sec	~1.3s under load
With Redis	~500 req/sec	~98ms

Autocannon test:

npx autocannon -c 50 -d 20 http://localhost:4000/users/user499999@example.com


Result:

10,000 requests in 20 seconds

~500 req/sec

~98ms avg latency


<img width="750" height="573" alt="image" src="https://github.com/user-attachments/assets/c8340399-eea8-4c45-a364-85f6a2c8dc74" />
