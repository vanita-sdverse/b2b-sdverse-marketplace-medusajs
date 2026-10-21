# B2B Marketplace (MedusaJS)

A production-grade B2B multi-vendor marketplace platform built on **MedusaJS 2.0**, designed with a modular architecture supporting Medusa Backend, Backoffice Admin, Seller Portal, Storefront, and event-driven infrastructure.

---

## Architecture Overview

- **Commerce Engine**: MedusaJS 2.0 (`@medusajs/framework` v2.18+)
- **Database**: PostgreSQL 16 (persistent named volumes)
- **Caching & In-Memory Store**: Redis 7
- **Search & Indexing**: Elasticsearch 8.15 (single-node development profile)
- **Message Broker & Events**: RabbitMQ 3.13 (with Management UI)
- **Reverse Proxy / Local Routing**: Nginx (domain-based routing on port 80)
- **Runtime Environment**: Node.js 20+ / Docker containers

---

## Repository Structure

```text
b2b-marketplace-medusajs/
├── apps/
│   ├── backend/                     # MedusaJS 2.0 backend application
│   ├── storefront/                  # Next.js customer-facing automotive marketplace (Port 3000)
│   ├── seller-portal/               # Next.js multi-vendor operational hub (Port 7002)
│   └── backoffice/                  # Next.js platform admin & governance portal (Port 7001)
├── packages/
│   └── shared-ui/                   # Reusable UI primitives (Button, Input, Select, Card, etc.)
├── docker/
│   └── nginx/                       # Local reverse proxy configuration
│       ├── nginx.conf
│       └── conf.d/
│           ├── storefront.conf      # Virtual host: marketplace.local
│           ├── api.conf             # Virtual host: api.marketplace.local
│           ├── admin.conf           # Virtual host: admin.marketplace.local
│           ├── seller.conf          # Virtual host: seller.marketplace.local
│           └── default.conf         # Default catch-all & /health check
├── compose.yaml                     # Docker Compose infrastructure definition
├── .env.example                     # Root environment template
├── .gitignore
├── .dockerignore
└── README.md
```

---

## Prerequisites

Before setting up the project, ensure you have the following installed on your host machine:

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (version 24+ recommended with Docker Compose v2)
- **Git**
- *(Optional)* **Node.js 20+** and **Yarn** (if running commands directly on host instead of inside Docker)

---

## Getting Started / Setup Guide

Follow these steps to set up and run the project locally after cloning the repository.

### 1. Clone the Repository

```bash
git clone <repository-url> b2b-marketplace-medusajs
cd b2b-marketplace-medusajs
```

### 2. Configure Environment Files

Create the required environment files from their respective examples:

```bash
# 1. Root environment configuration (used by Docker Compose)
cp .env.example .env

# 2. Backend environment configuration (used by MedusaJS)
cp apps/backend/.env.example apps/backend/.env
```

Verify that `DATABASE_URL` in `apps/backend/.env` points to the PostgreSQL container:
```env
DATABASE_URL=postgresql://marketplace:change_me@postgres:5432/marketplace?sslmode=disable
DATABASE_DRIVER_OPTIONS={"connection":{"ssl":false}}
REDIS_URL=redis://redis:6379
```

### 3. Configure Local Domains (`/etc/hosts`)

The Nginx reverse proxy routes traffic based on local development domains. Add the following entries to your `/etc/hosts` file:

```bash
sudo sh -c 'cat <<EOF >> /etc/hosts

# B2B Marketplace Local Domains
127.0.0.1 marketplace.local
127.0.0.1 api.marketplace.local
127.0.0.1 admin.marketplace.local
127.0.0.1 seller.marketplace.local
EOF'
```

### 4. Start the Infrastructure Services

Boot up the required infrastructure (PostgreSQL, Redis, Elasticsearch, RabbitMQ, and Nginx) in the background:

```bash
docker compose up -d
```

Verify that all containers are healthy:
```bash
docker compose ps
```

All services (`postgres`, `redis`, `elasticsearch`, `rabbitmq`, `nginx`) should report `Up (healthy)`.

### 5. Install Backend Dependencies

Install the project dependencies inside the Docker environment:

```bash
docker run --rm -v "$PWD/apps/backend":/app -w /app node:20-alpine yarn install
```

### 6. Run Database Migrations

Apply the database migrations (including core Medusa tables and custom modules like `seller`):

```bash
docker run --rm --network marketplace-network --env-file apps/backend/.env -v "$PWD/apps/backend":/app -w /app node:20-alpine npx medusa db:migrate
```

### 7. Verify Typecheck & Tests

Run the TypeScript typecheck and unit test suites inside Docker:

```bash
# Typecheck
docker run --rm -v "$PWD/apps/backend":/app -w /app node:20-alpine npx tsc --noEmit

# Unit tests
docker run --rm -v "$PWD/apps/backend":/app -w /app node:20-alpine yarn test:unit

# Build validation
docker run --rm --network marketplace-network --env-file apps/backend/.env -v "$PWD/apps/backend":/app -w /app node:20-alpine yarn build
```

### 8. Start the Medusa Backend

Start the Medusa development server inside the Docker network:

```bash
docker run -it --rm \
  --name medusa-backend \
  --network marketplace-network \
  --env-file apps/backend/.env \
  -p 9000:9000 \
  -v "$PWD/apps/backend":/app \
  -w /app \
  node:20-alpine yarn dev
```

---

## Service Endpoints & Port Mappings

| Service | Local URL / Host Port | Purpose |
| :--- | :--- | :--- |
| **Storefront Gateway** | [http://marketplace.local](http://marketplace.local) (Port 80) | Storefront web application |
| **Backend API Gateway** | [http://api.marketplace.local](http://api.marketplace.local) (Port 80) | Medusa API & Admin dashboard |
| **Admin Backoffice Gateway** | [http://admin.marketplace.local](http://admin.marketplace.local) (Port 80) | Backoffice admin portal |
| **Seller Portal Gateway** | [http://seller.marketplace.local](http://seller.marketplace.local) (Port 80) | Multi-vendor seller portal |
| **Medusa Direct Port** | [http://localhost:9000](http://localhost:9000) | Medusa backend direct access |
| **RabbitMQ Management UI** | [http://localhost:15672](http://localhost:15672) | Credentials: `marketplace` / `change_me` |
| **RabbitMQ AMQP** | `amqp://localhost:5672` | Asynchronous message broker |
| **Elasticsearch** | [http://localhost:9200](http://localhost:9200) | Marketplace search & catalog indexing |
| **PostgreSQL** | `localhost:5432` | Credentials: `marketplace` / `change_me` / db: `marketplace` |
| **Redis** | `redis://localhost:6379` | Cache and pub/sub |

---

## Custom Modules

### Seller Module (`apps/backend/src/modules/seller`)

The `seller` module is implemented as a native Medusa 2.0 custom module using the Data Modeling Language (DML):

- **Model**: `apps/backend/src/modules/seller/models/seller.ts`
  - `id`: Text (Primary Key)
  - `name`: Text
  - `handle`: Text (Unique)
  - `status`: Enum (`pending`, `active`, `suspended`, `inactive` — default: `pending`)
  - `created_at`, `updated_at`, `deleted_at`: Timestamps (Soft deletes enabled)
- **Service**: `apps/backend/src/modules/seller/service.ts` (`SellerModuleService` extending `MedusaService`)
- **Module Definition**: `apps/backend/src/modules/seller/index.ts` (`SELLER_MODULE = "seller"`)
- **Database Table**: `public.seller`

#### Generating New Migrations for Modules

When modifying or adding DML models:
```bash
docker run --rm --network marketplace-network --env-file apps/backend/.env -v "$PWD/apps/backend":/app -w /app node:20-alpine npx medusa db:generate <module-name>
docker run --rm --network marketplace-network --env-file apps/backend/.env -v "$PWD/apps/backend":/app -w /app node:20-alpine npx medusa db:migrate
```

---

## Common Development Commands

| Action | Command |
| :--- | :--- |
| **Start Infrastructure** | `docker compose up -d` |
| **Stop Infrastructure (Preserve data)** | `docker compose down` |
| **View Infrastructure Logs** | `docker compose logs -f [service-name]` |
| **Restart a Specific Service** | `docker compose restart [postgres\|redis\|nginx...]` |
| **Run Unit Tests** | `docker run --rm -v "$PWD/apps/backend":/app -w /app node:20-alpine yarn test:unit` |
| **Run Integration Tests** | `docker run --rm --network marketplace-network --env-file apps/backend/.env -v "$PWD/apps/backend":/app -w /app node:20-alpine yarn test:integration:modules` |
| **Typecheck Backend** | `docker run --rm -v "$PWD/apps/backend":/app -w /app node:20-alpine npx tsc --noEmit` |
| **Build Backend** | `docker run --rm --network marketplace-network --env-file apps/backend/.env -v "$PWD/apps/backend":/app -w /app node:20-alpine yarn build` |
| **Run Storefront (Dev)** | `docker run -it --rm --name storefront --network marketplace-network -p 3000:3000 -v "$PWD":/repo -w /repo/apps/storefront node:20-alpine npm run dev` |
| **Run Seller Portal (Dev)**| `docker run -it --rm --name seller-portal --network marketplace-network -p 7002:7002 -v "$PWD":/repo -w /repo/apps/seller-portal node:20-alpine npm run dev` |
| **Run Backoffice (Dev)** | `docker run -it --rm --name backoffice --network marketplace-network -p 7001:7001 -v "$PWD":/repo -w /repo/apps/backoffice node:20-alpine npm run dev` |
| **Build All Frontends** | `docker run --rm -v "$PWD":/repo -w /repo/apps/storefront node:20-alpine npm run build && docker run --rm -v "$PWD":/repo -w /repo/apps/seller-portal node:20-alpine npm run build && docker run --rm -v "$PWD":/repo -w /repo/apps/backoffice node:20-alpine npm run build` |

---

## Key Development Guidelines

1. **Docker Environment**: Run package installations, database migrations, and builds inside Docker to maintain consistent dependencies across developer environments.
2. **Medusa Source of Truth**: Keep core commerce concepts (products, variants, orders, carts, customers) in Medusa core. Implement B2B concepts (sellers, companies, RFQs, approvals) as isolated Medusa custom modules.
3. **Data Persistence**: `docker compose down` preserves all named volumes (`marketplace_postgres_data`, `marketplace_elasticsearch_data`, `marketplace_rabbitmq_data`). Do **not** use `docker compose down -v` unless you intentionally want to wipe development data.
4. **Local Database SSL**: For local Docker development, ensure `sslmode=disable` is included in `DATABASE_URL` and `databaseDriverOptions: { connection: { ssl: false } }` is set in `medusa-config.ts`.
5. **Frontend Styling Standard**: **NO inline styles (`style={{ ... }}`) allowed**. All styling across `storefront`, `seller-portal`, `backoffice`, and `shared-ui` must use dedicated separate SCSS files (`*.module.scss` for components and pages, or global SCSS in `styles/globals.scss`). Any new or future components must strictly follow this convention.

