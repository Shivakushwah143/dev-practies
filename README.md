

<img width="750" height="573" alt="image" src="https://github.com/user-attachments/assets/c8340399-eea8-4c45-a364-85f6a2c8dc74" />

 System Performance Benchmark (Scaling Lab)
 Phase 1 — No Index, No Cache

500,000 rows

Single request latency: ~4000ms

50 concurrent users: ❌ system collapse

Throughput: ~0 req/sec (all errors)

Conclusion:
Full table scan → system unusable under concurrency.

🟡 Phase 2 — With Index (No Cache)

500,000 rows

Single request latency: ~328ms

30 concurrent users:

Avg latency: ~1384ms

Throughput: ~20 req/sec

Errors present

Conclusion:
Index improved query 12x,
but DB still bottleneck under load.

🟢 Phase 3 — With Redis Cache

500,000 rows

First request: ~3721ms (DB)

Cached request: ~46ms

Load Test (50 concurrent users, 20s)

Avg latency: 98ms

P50 latency: 79ms

P99 latency: 839ms

Throughput: ~500 req/sec

10,000 requests served in 20s

No collapse

🚀 Capability Comparison
Stage	Avg Latency	Req/Sec	Stability
No Index	~4000ms	0	❌ Collapse
With Index	~1384ms	~20	⚠ Limited
With Redis	~98ms	~500	✅ Stable
📈 Improvement Summary

From baseline → Redis:

⚡ Latency improved ~40x

🚀 Throughput improved ~25x

🧠 DB load reduced massively

🔥 System became horizontally scalable

📌 Current Capability

On your current machine + Neon + Upstash:

System can handle ~500 requests/sec
at 50 concurrent users
with ~100ms average latency.
