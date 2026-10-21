# ANTIGRAVITY PROJECT RULES

This file contains permanent development rules for this project.

Every coding agent must read and follow these instructions before making changes.

These rules apply to all future tasks unless a task explicitly overrides a specific rule.

---

# 1. PROJECT CONTEXT

We are building a production-grade automotive marketplace using:

Backend:
- Medusa v2
- TypeScript
- PostgreSQL
- Redis
- Elasticsearch
- RabbitMQ

Frontend:
- Storefront: Next.js + React + TypeScript
- Seller Portal: Next.js + React + TypeScript
- Backoffice: Medusa Admin

Infrastructure:
- Docker
- Docker Compose
- Nginx
- Local development domains

The project must remain modular, maintainable, secure, upgrade-friendly, and easy for future developers to understand.

---

# 2. CORE ARCHITECTURE

Medusa is the commerce source of truth.

Use Medusa for standard commerce functionality such as:

- products
- product variants
- categories
- collections
- pricing
- inventory
- customers
- carts
- orders
- promotions
- payments
- fulfillment
- sales channels

Do NOT recreate Medusa functionality in custom tables unless there is a proven business requirement.

Marketplace-specific functionality should be implemented using custom Medusa modules, workflows, APIs, and related services.

Examples:

- sellers
- seller employees
- seller permissions
- seller-product relationships
- seller inventory rules
- seller orders
- commissions
- company accounts
- B2B permissions
- RFQ
- quotations
- approval workflows
- spending/credit rules

---

# 3. NEVER ASSUME MEDUSA APIs

This is a critical rule.

Never assume that a Medusa:

- API
- module
- service
- workflow
- workflow step
- CLI command
- admin extension API
- authentication method
- configuration option
- package

exists.

Before using Medusa-specific functionality:

1. Inspect the installed Medusa version.
2. Inspect the existing codebase.
3. Inspect installed package types/source when useful.
4. Verify against current official Medusa documentation when uncertain.
5. Use the API supported by the installed version.

Never invent Medusa APIs based on older versions or tutorials.

---

# 4. INSPECT BEFORE IMPLEMENTING

Before modifying code:

1. Inspect relevant existing files.
2. Understand the current implementation.
3. Check existing utilities/modules/services.
4. Check whether functionality already exists.
5. Determine the smallest clean change required.

Do not immediately generate code based only on the task description.

Prefer modifying existing patterns over creating duplicate architecture.

---

# 5. FEATURE CLASSIFICATION

Before implementing a significant feature, determine where it belongs.

Possible locations:

- existing Medusa capability
- custom Medusa module
- Medusa workflow
- API route
- subscriber/event handler
- Medusa Admin extension
- Storefront
- Seller Portal
- external search/recommendation service

Use the correct layer.

Do not place all logic in API handlers or generic services.

---

# 6. MEDUSA CORE MUST NOT BE MODIFIED

Never modify:

- node_modules
- Medusa framework source
- third-party package source

All custom behavior must use supported extension mechanisms.

Examples:

- custom modules
- workflows
- workflow hooks
- subscribers
- API routes
- Admin extensions

The goal is to keep Medusa upgrades as low-risk as possible.

---

# 7. WORKFLOW RULES

Use Medusa workflows for operations that:

- modify multiple entities
- contain multiple business steps
- require validation before mutation
- trigger multiple side effects
- may require compensation/rollback
- interact with multiple modules/services

Prefer existing Medusa workflows when they already solve the problem.

Do not rebuild existing Medusa workflows unnecessarily.

Simple read operations do not require workflows without reason.

---

# 8. API ROUTES MUST REMAIN THIN

API handlers should mainly perform:

1. authentication
2. request parsing
3. validation
4. authorization
5. workflow/service invocation
6. response formatting

Do not put substantial business logic directly inside route handlers.

Bad:

route -> hundreds of lines of business logic

Preferred:

route
-> validation
-> authorization
-> workflow/module
-> response

---

# 9. SELLER SECURITY IS CRITICAL

Seller Portal is a custom Next.js application.

Never expose unrestricted Medusa Admin functionality to marketplace sellers.

Seller-facing APIs must always enforce seller scope server-side.

A seller must never be able to access another seller's:

- products
- inventory
- orders
- employees
- settings
- analytics
- commissions
- private marketplace data

Do not trust seller IDs supplied by the frontend.

Where possible, derive seller identity from authenticated context.

Frontend filtering is never authorization.

---

# 10. AUTHORIZATION

All important permissions must be enforced server-side.

Never rely on:

- hidden buttons
- disabled UI elements
- frontend route guards alone

Authorization decisions belong in backend code.

Return appropriate HTTP responses:

401 - unauthenticated
403 - unauthorized
404 - unavailable/not found when appropriate
409 - business conflict

---

# 11. FRONTEND RESPONSIBILITIES

Storefront and Seller Portal must communicate through APIs.

They must never connect directly to PostgreSQL, Redis, Elasticsearch, or RabbitMQ.

Frontend responsibilities:

- presentation
- user interaction
- API calls
- local UI state

Business truth belongs in the backend.

---

# 12. BACKOFFICE

Backoffice uses Medusa Admin.

Do NOT create a custom Next.js Backoffice unless the architecture decision is explicitly changed.

Use supported Medusa Admin extensions for custom marketplace functionality.

Do not heavily hack or override Medusa Admin internals.

---

# 13. SEARCH AND INTELLIGENCE

Elasticsearch handles search/retrieval infrastructure.

Recommendation and future LLM/agentic capabilities must remain outside Medusa's core commerce logic where practical.

Medusa validates:

- product truth
- price
- inventory
- cart
- order
- customer/company eligibility

Search/recommendation systems may suggest or retrieve candidates but must not become the commerce source of truth.

---

# 14. RABBITMQ

RabbitMQ should be used for appropriate asynchronous/event-driven processing.

Do not use RabbitMQ for simple synchronous operations that do not need messaging.

Do not create unnecessary queues or consumers.

Prefer simple architecture until scale/requirements justify additional messaging complexity.

---

# 15. DATABASE RULES

Before creating a new database table ask:

Can Medusa already represent this data correctly?

If yes:
Use Medusa.

If no:
Use a custom module.

Custom tables must have a clear domain responsibility.

When creating tables/models consider:

- primary key
- required fields
- relationships
- uniqueness
- indexes
- timestamps
- deletion behavior

Do not create speculative fields for possible future use.

---

# 16. TYPE SCRIPT QUALITY

Use TypeScript strictly.

Avoid:

- any
- unsafe casts
- unexplained non-null assertions
- loosely typed objects

Prefer:

- explicit interfaces/types
- typed API responses
- typed request schemas
- shared domain types where useful

Do not create enormous generic type abstractions unnecessarily.

---

# 17. CODE ORGANIZATION

Prefer:

- small focused files
- small focused functions
- descriptive names
- clear module boundaries
- dependency injection where supported
- separation of business logic and transport logic

Avoid:

- giant service classes
- giant route files
- utility dumping grounds
- circular dependencies
- copy-pasted logic

---

# 18. DEPENDENCY RULE

Do not install a new package unless necessary.

Before adding a dependency check whether the same capability already exists in:

- Node.js
- Next.js
- Medusa
- existing project dependencies
- existing shared packages

Do not add libraries merely for convenience.

Never change package manager unnecessarily.

---

# 19. DO NOT OVER-ENGINEER

Implement today's requirement cleanly.

Do not build infrastructure for hypothetical future requirements unless explicitly requested.

Avoid unnecessary:

- microservices
- abstractions
- factories
- generic frameworks
- event buses
- repositories
- adapters
- layers

Simple, clear code is preferred.

---

# 20. NO SCOPE CREEP

Every task has a strict boundary.

Implement only what the task requests.

Do not:

- implement adjacent features
- rewrite unrelated files
- rename unrelated code
- restructure unrelated folders
- upgrade packages
- refactor unrelated modules
- add future functionality automatically

Stop when the requested task is complete.

---

# 21. MOCK DATA

Mock data is allowed only when required for frontend development.

Rules:

- keep it isolated
- clearly mark it as mock data
- make replacement easy
- do not mix mock data with production business logic

Do not create fake backend architectures just to support mock screens.

---

# 22. ERROR HANDLING

Use predictable errors.

Handle known business failures explicitly.

Do not:

- silently swallow errors
- return successful responses for failed operations
- expose internal stack traces to clients

Log useful server-side context when appropriate.

---

# 23. PERFORMANCE

Avoid obvious performance issues:

- N+1 queries
- loading entire tables
- unbounded list endpoints
- repeated identical external calls
- expensive operations inside loops
- unnecessary serialization

List APIs should support pagination.

Do not prematurely optimize without evidence.

---

# 24. DOCKER / INFRASTRUCTURE

Use the existing Docker environment.

Current infrastructure includes:

- PostgreSQL
- Redis
- Elasticsearch
- RabbitMQ
- Nginx

Do not recreate or replace this architecture without explicit instruction.

Containers must communicate using service names, not localhost.

Do not add infrastructure components without a clear requirement.

---

# 25. NGINX / LOCAL DOMAINS

Use existing local routing.

Expected environment may include domains such as:

- marketplace.local
- api.marketplace.local
- seller.marketplace.local

Do not change domain conventions without instruction.

Do not overwrite `/etc/hosts`.

Only append missing entries if explicitly required and safe.

---

# 26. FRONTEND DESIGN

Storefront:
- premium automotive marketplace
- modern
- elegant
- professional
- responsive

Seller Portal:
- professional
- simple
- fast
- low cognitive load
- dashboard-oriented

Company colors:

#FFF451
#111827

Use them sparingly.

Neutral colors should form most of the UI.

Do not flood pages with bright yellow or dark backgrounds.

---

# 27. SHARED CODE

Share code only where it genuinely reduces duplication.

Good shared candidates:

- types
- API client primitives
- validation schemas
- utilities
- brand tokens
- basic primitives

Do not force Storefront and Seller Portal to share complex UI components if their UX differs.

---

# 28. TESTING

After implementation run relevant checks when available:

- TypeScript typecheck
- lint
- unit tests
- integration tests
- build
- migration validation
- Docker/service startup
- API checks

Do not claim success without running available checks.

Fix errors introduced by the current task.

Do not fix unrelated historical failures unless explicitly requested.

---

# 29. REVIEW YOUR OWN DIFF

Before finishing:

Review only the changes you made.

Check for:

- architectural violations
- Medusa misuse
- security problems
- seller scope problems
- duplicate code
- unnecessary dependencies
- TypeScript errors
- performance problems
- accidental unrelated edits
- scope creep

Fix serious issues before completion.

---

# 30. GIT DISCIPLINE

Keep changes small and focused.

Do not combine unrelated features into one implementation.

Before editing, inspect repository status when useful.

After implementation, inspect the diff.

Never discard existing user changes.

Never reset or overwrite unrelated work.

---

# 31. ARCHITECTURAL DECISIONS

Before making architectural changes, read:

docs/architecture-decisions.md

If it exists.

Treat decisions marked as locked as authoritative unless the user explicitly changes them.

Do not repeatedly reconsider settled decisions.

---

# 32. WHEN UNCERTAIN

Do NOT guess.

Instead:

1. inspect the repository
2. inspect installed packages/types
3. check official Medusa documentation if necessary
4. choose the smallest supported solution

If uncertainty remains and materially affects correctness, report it as a blocker rather than inventing an implementation.

---

# 33. TASK EXECUTION FORMAT

For each development task follow:

INSPECT
↓
CLASSIFY
↓
IMPLEMENT
↓
VERIFY
↓
REVIEW DIFF
↓
STOP

Do not continue into another feature automatically.

---

# 34. OUTPUT TOKEN RULE

Keep final responses concise.

Do not explain code line-by-line.

Do not repeat these project rules.

Do not print entire files unless requested.

Final output should normally contain only:

Changed:
- files created/modified

Verified:
- checks performed and result

Decision:
- only important architectural decision, maximum 3 lines

Blockers:
- unresolved issues only

The implementation itself is the primary output.

---

# 35. PRIORITY ORDER

When making engineering decisions prioritize:

1. Correctness
2. Security
3. Compatibility with installed Medusa version
4. Simplicity
5. Maintainability
6. Upgrade safety
7. Performance
8. Extensibility
9. Cleverness

Never sacrifice correctness or security to produce more code.

---

# 36. PRIMARY RULE

Do not measure success by how much code was generated.

Success means:

- correct architecture
- minimal change
- verified functionality
- maintainable code
- no unnecessary complexity
- no hallucinated Medusa APIs
- no unrelated changes

Small correct implementations are preferred over large speculative implementations.