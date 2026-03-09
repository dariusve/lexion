# Lexion Pricing Gap Analysis

## Purpose

This document maps the recommended pricing tiers in `docs/PRICING_MODEL.md` to the current Lexion implementation and identifies what is still missing per tier.

The goal is to answer:

- what Lexion can credibly sell today
- what each paid tier still lacks
- what features need to be built to justify each tier commercially

## Current Implemented Capability Inventory

### Core Platform

Implemented now:

- headless editor core
- command registration and execution
- schema-driven JSON document model
- extension system with commands, ProseMirror plugins, and lifecycle hooks
- plugin-style customization and framework-independent behavior delivery

What that means commercially:

- Lexion already has the bones of a platform product
- this is enough to support a free developer tier and the foundation of paid licenses

### Starter-Kit Editing

Implemented now:

- paragraphs
- headings
- bold
- italic
- links
- bullet lists
- ordered lists
- list indent / outdent behavior
- undo and redo

Current limitation:

- this is still a minimal editing feature set compared with commercial incumbents

### Adapters and Framework Coverage

Implemented now:

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

What that means commercially:

- Lexion has a strong portability story already
- this is one of the best differentiators to keep in every tier

### Conversion and Service Layer

Implemented now:

- HTML import
- HTML export
- text import
- text export
- API service for conversion and command execution
- collaboration server with WebSocket + Yjs updates

Current limitation:

- no Word import/export
- no PDF export
- no markdown pipeline
- no persistence, tenancy, auth, or admin model in the backend services

### AI

Implemented now:

- provider-agnostic AI request interface
- selection-aware suggestion generation
- command to apply suggestion text into the current selection

Current limitation:

- no built-in AI UI
- no prompt preset system
- no review/accept/reject workflow
- no usage tracking or billing hooks
- no safety, audit, or provider management features

### Collaboration

Implemented now:

- Yjs sync plugin
- awareness/cursor plugin
- collaborative undo and redo
- collaboration server transport

Current limitation:

- no comments
- no track changes
- no revision history
- no room permissions
- no auth
- no durable storage or restore model
- no admin controls

## High-Level Gap Summary

The biggest missing capability groups are:

- richer authoring features
- review and collaboration workflows
- document conversion and import/export pipelines
- billing, licensing, and admin controls
- security, compliance, and deployment features

Those gaps are normal for an early platform, but they matter because paid tiers must bundle value that is visible to customers, not just to engineers.

## Missing Features By Tier

### Community Tier

### Commercial Position

The Community tier is mostly viable today if positioned as:

- a free developer toolkit
- a headless editor starter platform
- a multi-framework ProseMirror abstraction layer

### Missing Features

These are not strict blockers for launch, but they would make the free tier much stronger.

#### Markdown Import and Export

Description:

- convert between Lexion JSON and Markdown
- preserve common formatting safely

Why it matters:

- developers expect Markdown interoperability in modern editor stacks
- it improves migration and import/export credibility

Current status:

- missing

Implementation scope:

- Markdown parser to internal JSON
- Markdown serializer from internal JSON
- schema mapping rules for links, headings, lists, inline styles, and code

#### Broader Basic Content Blocks

Description:

- code blocks
- blockquotes
- horizontal rules
- task lists
- inline code
- strikethrough

Why it matters:

- these features are often viewed as "baseline modern editor" capabilities
- without them, Lexion feels incomplete next to free alternatives

Current status:

- missing

Implementation scope:

- schema additions
- commands
- keymaps/input rules
- adapter compatibility testing

#### Better Developer Starter UX

Description:

- sample toolbars
- starter menu examples
- richer demo compositions

Why it matters:

- Lexion is headless, but headless products still need strong starting points
- better examples reduce time-to-value and improve adoption

Current status:

- partial, because sample apps exist but productized starter UIs do not

Implementation scope:

- optional starter toolbar package or reference components
- demo recipes for common app patterns

### Pro Tier

### Commercial Position

The Pro tier should be the first true commercial tier:

- one paid product license
- productivity-oriented authoring features
- AI tooling
- operationally usable server endpoints

### Missing Features

#### Commercial Licensing and Billing Layer

Description:

- paid account management
- commercial terms and entitlement checks
- seat counting
- upgrade and renewal flows

Why it matters:

- you cannot sell Pro as a real product without packaging, legal terms, and entitlement handling

Current status:

- missing

Implementation scope:

- billing provider integration
- license records
- seat assignment model
- docs for OSS vs commercial usage

#### Tables

Description:

- table node model
- row/column editing
- insert/delete row and column actions
- cell merge and split if desired

Why it matters:

- tables are one of the clearest markers of a usable commercial editor
- many B2B buyers will expect them immediately

Current status:

- missing

Implementation scope:

- ProseMirror table schema and plugins
- commands and key handling
- serialization support

#### Slash Commands

Description:

- command menu triggered from `/`
- insert blocks and run editor actions from a searchable list

Why it matters:

- modern productivity products often expect this interaction pattern
- it helps Lexion feel like a current-generation product

Current status:

- missing

Implementation scope:

- extension for trigger handling
- suggestion/filter UI contract
- adapter examples

#### Mentions

Description:

- inline references to people, entities, or records
- schema attributes for ids and labels

Why it matters:

- common requirement in workflow, ticketing, CRM, and internal tooling apps

Current status:

- missing

Implementation scope:

- mention node/mark design
- async suggestion source contract
- keyboard navigation
- serialization rules

#### Markdown Pipeline

Description:

- markdown import
- markdown export
- optional markdown shortcuts while typing

Why it matters:

- strong migration and interoperability feature
- especially useful for developer and documentation products

Current status:

- missing

Implementation scope:

- parser/serializer
- optional input rules
- content fidelity tests

#### AI Review Workflow

Description:

- show suggested change before insertion
- accept or reject actions
- prompt presets such as rewrite, summarize, expand, and simplify

Why it matters:

- the current AI feature is technically useful, but commercially thin
- buyers pay for controlled workflows, not only provider abstraction

Current status:

- partial

Implementation scope:

- structured suggestion objects
- preview UI contract
- prompt preset registry
- provider error handling

#### API Hardening

Description:

- auth
- rate limiting
- product or tenant scoping
- API keys
- quotas and logging

Why it matters:

- the current API server is useful for local development, not commercial SaaS operations

Current status:

- missing

Implementation scope:

- authentication middleware
- usage records
- tenant-aware request model
- operational documentation

### Team Tier

### Commercial Position

The Team tier should monetize collaboration and review workflows, not just raw sync.

### Missing Features

#### Comments

Description:

- anchored comments on ranges or blocks
- threads
- resolve and reopen states

Why it matters:

- comments are one of the clearest reasons teams buy paid editor products
- they convert plain editing into team workflow

Current status:

- missing

Implementation scope:

- comment data model
- range anchoring strategy
- server persistence
- UI patterns for inline markers and side panel threads

#### Suggested Edits / Track Changes

Description:

- record insertions and deletions as proposed edits
- accept or reject changes individually or in bulk

Why it matters:

- this is a premium capability in CKEditor and TinyMCE-style positioning
- it is essential for review-heavy workflows

Current status:

- missing

Implementation scope:

- change model in document or metadata layer
- review commands
- rendering of change ranges
- merge and conflict rules

#### Revision History

Description:

- named or timestamped document versions
- compare current document against previous versions
- restore older states

Why it matters:

- teams want safety, auditability, and rollback
- it increases trust in collaborative editing

Current status:

- missing

Implementation scope:

- persistent version snapshots
- diff engine
- restore workflow
- retention policy

#### Durable Collaboration Persistence

Description:

- room state durability across restarts
- document storage backend
- reconnect and recovery behavior

Why it matters:

- current collaboration transport is not enough for a commercial team tier by itself

Current status:

- partial

Implementation scope:

- storage adapter layer
- persistence model for Yjs state
- room lifecycle management
- backup strategy

#### Presence and Multi-User UX

Description:

- user identity in cursors
- avatar and color management
- active collaborator lists
- reconnect and stale-presence handling

Why it matters:

- collaboration feels unfinished without user-facing team context

Current status:

- partial

Implementation scope:

- presence metadata contracts
- timeout/recovery rules
- sample UI integrations

#### Workspace and Environment Controls

Description:

- teams
- projects or workspaces
- environment separation

Why it matters:

- this is required if Team is sold to organizations rather than individuals

Current status:

- missing

Implementation scope:

- account model
- environment records
- permission scaffolding

### Business Tier

### Commercial Position

Business should sell operational trust:

- admin controls
- security posture
- support guarantees

### Missing Features

#### Single Sign-On

Description:

- SAML or OIDC integration
- managed identity and provisioning options

Why it matters:

- security-conscious buyers expect centralized identity

Current status:

- missing

Implementation scope:

- auth integration layer
- org-level settings
- access mapping to roles

#### Role-Based Access Control

Description:

- admin, editor, reviewer, viewer, and service roles
- permission checks for workspace, document, and environment actions

Why it matters:

- necessary for safe multi-user deployments and customer trust

Current status:

- missing

Implementation scope:

- permission model
- enforcement in backend services
- admin UI/API

#### Audit Logs

Description:

- who changed what
- admin actions
- authentication and configuration events

Why it matters:

- required for many B2B and compliance-sensitive workflows

Current status:

- missing

Implementation scope:

- structured event schema
- retention strategy
- export/search access

#### Admin Console

Description:

- manage products, environments, seats, usage, and integrations

Why it matters:

- business customers need self-service administration

Current status:

- missing

Implementation scope:

- admin APIs
- frontend console
- usage summaries

#### Backup and Export Operations

Description:

- full document exports
- workspace exports
- scheduled backups

Why it matters:

- reduces vendor-risk concerns
- supports regulated and migration-sensitive buyers

Current status:

- missing

Implementation scope:

- background jobs
- archive formats
- permission-controlled restore/export flows

#### SLA and Observability Foundations

Description:

- uptime targets
- monitoring
- alerting
- incident visibility

Why it matters:

- support promises require operational tooling behind them

Current status:

- missing

Implementation scope:

- service metrics
- logs and tracing
- operational runbooks

### Enterprise Tier

### Commercial Position

Enterprise should sell deployment control, procurement flexibility, and deep support.

### Missing Features

#### On-Premises and Private Cloud Deployment

Description:

- supported customer-managed deployment model
- installation docs, images, upgrade path, and configuration support

Why it matters:

- many enterprise customers cannot rely on shared SaaS infrastructure

Current status:

- missing as a productized offering

Implementation scope:

- deployment packaging
- environment variable and secret management
- upgrade/migration process
- support boundaries

#### Air-Gapped Readiness

Description:

- deployment model without outbound internet dependency
- documented update and support procedures

Why it matters:

- required for some security-sensitive customers

Current status:

- missing

Implementation scope:

- dependency review
- offline asset and model strategies
- support package design

#### Multi-Region and High Availability

Description:

- regional deployment choices
- failover and disaster recovery guidance

Why it matters:

- larger customers evaluate resilience and residency requirements early

Current status:

- missing

Implementation scope:

- infrastructure architecture
- storage replication approach
- documented recovery objectives

#### Enterprise Security Package

Description:

- security documentation
- questionnaire responses
- architecture diagrams
- vulnerability management process

Why it matters:

- enterprise sales often fail before features are evaluated if security review is weak

Current status:

- missing as a formal package

Implementation scope:

- security program materials
- customer-facing review workflow
- release and patch commitments

#### Long-Term Support Release Policy

Description:

- supported release windows
- backport policy
- compatibility guarantees

Why it matters:

- enterprises prefer predictable maintenance over rapid churn

Current status:

- missing

Implementation scope:

- release train definition
- branch/support process
- maintenance commitments

#### Dedicated Support Channel

Description:

- named contacts
- escalation path
- optional private Slack or ticket queue

Why it matters:

- enterprise pricing must include a support experience that matches the contract size

Current status:

- missing as a formal offering

Implementation scope:

- support operations
- response policies
- customer success workflow

## Recommended Build Sequence

To align product delivery with pricing credibility:

1. Strengthen Community
   - markdown pipeline
   - broader basic block set
   - starter UI references
2. Ship Pro
   - tables
   - mentions
   - slash commands
   - commercial licensing
   - AI review flow
   - hardened API
3. Ship Team
   - comments
   - suggested edits
   - revision history
   - durable collaboration persistence
4. Ship Business
   - SSO
   - RBAC
   - audit logs
   - admin console
   - backup/export operations
5. Ship Enterprise
   - on-prem/private deployment
   - HA and multi-region
   - LTS
   - enterprise support model

## Practical Readiness Summary

### Can be sold soon

- Community
- a narrow Pro tier, if marketed carefully around developer productivity and commercial licensing

### Needs more product work before it is credible

- full Pro bundle
- Team
- Business
- Enterprise

## Conclusion

Lexion already has enough platform value to justify a free community tier and the start of a paid commercial story.

The biggest monetization gap is not the core editor engine. It is the absence of:

- premium authoring features
- review workflows
- admin and security controls
- deployment and support packaging

Those are the features that convert a strong developer toolkit into a durable software business.
