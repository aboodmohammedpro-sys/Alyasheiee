# 33. Future Scalability

## Roadmap for Scale

### 1. Database Sharding
In the future, if the number of movements grows into the tens of millions, we can shard current stock vs historical movements or shard by Region/Branch.

### 2. Service Extraction
The current **Modular Monolith** architecture allows extracting the `Procurement` or `Warehouse` module into a standalone Microservice using Laravel side-by-side or Go. Shared models should be moved to a shared package.

### 3. Materialized Views
For complex reports (e.g., "Monthly Fuel Consumption by Project Type"), use PostgreSQL Materialized Views refreshed via background jobs to provide sub-second dashboard loads.

### 4. CDN & Asset Management
Storage of high-resolution site photos should be moved to S3-compatible storage (DigitalOcean Spaces, AWS S3) to keep the local server load low.
