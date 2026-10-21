# Locked Architecture Decisions

Backend: Medusa v2

Database: PostgreSQL

Cache / infrastructure: Redis

Search: Elasticsearch

Async messaging: RabbitMQ

Reverse proxy: Nginx

Storefront:
Next.js + React + TypeScript

Seller Portal:
Next.js + React + TypeScript

Backoffice:
Medusa Admin.
Do not build separate Next.js Backoffice.

Products:
Use Medusa Product.

Seller:
Custom marketplace Medusa module.

Seller Product:
Link Seller to Medusa Product.
Do not create a duplicate marketplace Product model.

Seller authorization:
Always enforced server-side.

Frontend:
Never directly accesses database/infrastructure.

Search / recommendations / future LLM:
External intelligence layer.
Medusa remains commerce source of truth.

Custom functionality:
Never modify Medusa core or node_modules.