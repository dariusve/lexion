# Lexion Pricing Model

## Purpose

This document proposes a pricing model for Lexion based on:

- the current Lexion codebase and package surface
- the live pricing structure of Tiptap, CKEditor, and TinyMCE reviewed on March 9, 2026
- Lexion's current maturity as a developer-first headless rich text editor platform

This is a product and packaging recommendation, not a legal or billing implementation spec.

## Current Product Baseline

Lexion currently ships a strong developer-platform foundation:

- headless editor core with JSON document APIs
- extension contract with commands, plugins, and lifecycle hooks
- starter-kit editing features:
  - paragraphs
  - headings
  - bold
  - italic
  - links
  - bullet lists
  - ordered lists
  - undo and redo
- HTML and plain-text import/export helpers
- provider-agnostic AI suggestion flow
- Yjs collaboration extension with sync, cursors, and collaborative undo/redo
- backend API service for document conversion and command execution
- collaboration WebSocket server
- official adapters for web, React, Vue, Vue 2, Angular, Svelte, Solid, Astro, Next, and Nuxt

That means Lexion is already credible as a developer platform, but it is not yet feature-complete enough to price like CKEditor's higher-end plans or like Tiptap's managed document platform.

## Recommended Commercial Strategy

### Positioning

Lexion should compete as:

- a developer-first headless rich text editor platform
- a cross-framework alternative to building directly on ProseMirror
- a lower-friction commercial option than CKEditor
- a simpler licensing model than usage-metered cloud products

### Licensing Recommendation

Recommended packaging direction:

- keep a free community tier for adoption
- offer commercial terms for paid tiers
- avoid document-count or editor-load pricing until Lexion ships a real managed cloud platform with hosted persistence, admin tooling, and usage observability

Why:

- Tiptap can meter cloud documents because its managed platform is part of the product
- CKEditor and TinyMCE monetize mature premium feature suites and hosted services
- Lexion today is closer to a framework/platform toolkit than to a finished managed editor cloud

## Recommended Tier Structure

| Tier | Monthly | Annual | Delivery Status | Core Positioning |
| --- | ---: | ---: | --- | --- |
| Community | $0 | $0 | Mostly current | Free developer adoption tier |
| Pro | $29 | $290 | Partial | Commercial license + developer productivity tier |
| Team | $99 | $990 | Partial | Collaboration and review workflows |
| Business | $299 | $2,990 | Mostly future | Security, admin, and support tier |
| Enterprise | Custom | Custom | Future | Private deployment and custom contract tier |

Annual pricing is intentionally simple: roughly 2 months free versus monthly billing.

## Tier Summary

### Community

Price:

- monthly: $0
- annual: $0

Target buyer:

- individual developers
- prototypes
- internal proofs of concept
- teams evaluating Lexion before purchase

Recommended included features:

- headless editor core
- starter-kit editing commands
- JSON document model
- extension authoring API
- HTML and text import/export
- official adapters:
  - web
  - React
  - Vue
  - Vue 2
  - Angular
  - Svelte
  - Solid
  - Astro
  - Next
  - Nuxt
- docs, examples, and sample apps
- community support only

Why this tier works:

- it maximizes developer adoption
- it proves the multi-framework value proposition
- it keeps Lexion competitive with Tiptap OSS and free editor options

### Pro

Price:

- monthly: $29
- annual: $290

Target buyer:

- small SaaS teams
- startups launching one commercial product
- teams that need commercial terms but do not need collaboration governance yet

Recommended included features:

- everything in Community
- commercial license for one product/application
- AI extension and AI service abstractions
- API server
- richer authoring feature pack:
  - tables
  - code blocks
  - blockquotes
  - task lists
  - slash commands
  - mentions
  - markdown import/export
- 3 developer seats
- email support

Why this tier works:

- it gives buyers a meaningful reason to pay beyond legal terms alone
- it is materially cheaper than CKEditor and below TinyMCE's higher-value bundles
- it keeps pricing simple enough for early Lexion adoption

### Team

Price:

- monthly: $99
- annual: $990

Target buyer:

- product teams shipping collaborative editing experiences
- workflow tools
- internal document and knowledge systems
- SaaS products where multi-user editing is part of the core workflow

Recommended included features:

- everything in Pro
- collaboration extension
- collaboration server
- collaborative presence and cursor support
- comments
- suggested edits / track changes
- revision history
- version restore
- team workspaces and environments
- 10 developer seats
- priority support

Why this tier works:

- this is the first plan where Lexion can monetize workflow value instead of only editor primitives
- this aligns with how the market prices collaboration and review features as premium

### Business

Price:

- monthly: $299
- annual: $2,990

Target buyer:

- growing B2B SaaS vendors
- teams with security review requirements
- larger organizations standardizing on one editor platform across products

Recommended included features:

- everything in Team
- SSO and identity integrations
- role-based access control
- audit logs
- admin console
- tenant and environment management
- backup/export workflows
- SLA-backed support
- onboarding and architecture guidance

Why this tier works:

- it monetizes operational and compliance value
- it is still far below heavy enterprise incumbents while remaining credible

### Enterprise

Price:

- custom quote
- annual contracts by default

Target buyer:

- large regulated companies
- customers requiring private deployment
- customers with procurement, legal, or security exceptions

Recommended included features:

- everything in Business
- on-premises or private cloud deployment
- air-gapped deployment option
- multi-region architecture
- advanced security review support
- custom legal and procurement terms
- dedicated support channel
- migration and implementation assistance
- long-term support release policy

Why this tier works:

- enterprise customers buy deployment control, risk reduction, and support depth
- those requirements do not fit self-serve pricing well

## Suggested Add-Ons

These should be optional only after the base tier model is stable.

### Additional Developer Seats

Recommended price:

- $15 per seat per month
- $150 per seat per year

Use case:

- lets small teams expand gradually without jumping tiers too early

### Onboarding Package

Recommended price:

- one-time services engagement
- suggested starting point: $1,500 to $5,000 depending on scope

Use case:

- helps business customers integrate faster
- creates a services revenue path before enterprise scale

### Future Managed Cloud Add-On

Do not launch this until Lexion provides:

- hosted document persistence
- usage metering
- tenant administration
- billing visibility
- production support processes

When those exist, managed collaboration or managed document storage can become a separate add-on or new plan family.

## Packaging Rules

To keep the model coherent:

- do not put every advanced authoring feature in the free tier
- do not lock the basic editor core behind a paywall
- do not introduce usage pricing before Lexion has real hosted infrastructure value
- do not make collaboration a Pro feature if comments and revision history are still absent

## Recommended Messaging

### Core Message

Lexion should be described as:

"A headless, cross-framework rich text editor platform for teams that want ProseMirror flexibility without rebuilding the editor stack from scratch."

### Pricing Message

The pricing page should emphasize:

- free community adoption
- straightforward commercial upgrade path
- lower complexity than usage-metered competitors
- collaboration and enterprise controls as paid value layers

## Delivery Notes

Practical delivery status today:

- Community: mostly ready now
- Pro: partially ready, but richer authoring and commercial packaging are still missing
- Team: partially ready, because core collaboration plumbing exists but comments, review, and versioning do not
- Business: mostly future
- Enterprise: future

For the build plan behind those gaps, see `docs/PRICING_GAP_ANALYSIS.md`.
