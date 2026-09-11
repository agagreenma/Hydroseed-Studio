# HYDROSEED Content Hub

HYDROSEED Studio — Adapt FIRMA Studio into HYDROSEED Studio

You are working on the HYDROSEED project.

I will provide you with a ZIP containing the existing FIRMA Studio implementation and its Source of Truth / architecture documentation.

Your job is to use that ZIP as the canonical implementation baseline and adapt it into HYDROSEED Studio.

This is NOT a request to build a new application from scratch.

This is NOT a request to redesign the application.

This is NOT a request to copy FIRMA branding into another project.

The goal is to preserve the useful architecture, UX patterns, components, navigation philosophy, content-management logic, and existing implementation quality from FIRMA Studio, while transforming the product into a Studio specifically designed for the HYDROSEED / HYDROSEED.APP ecosystem.

1. CORE PRODUCT DEFINITION

The resulting product must be called:

HYDROSEED Studio

Its purpose is:

The internal marketing, content, SEO, publishing and growth workspace for HYDROSEED.APP.

HYDROSEED Studio is an internal platform that manages the public-facing marketing and knowledge content of HYDROSEED.APP.

It is NOT the HYDROSEED operational application.

It is NOT the HYDROSEED Field App.

It is NOT a CRM.

It is NOT an ERP.

It is NOT a job-management system.

It is NOT a farm/project operations system.

The Studio should remain a clearly separated product boundary.

2. VERY IMPORTANT — HYDROSEED.APP IS THE TARGET

The existing FIRMA Studio implementation must be adapted specifically for:

HYDROSEED

and its public ecosystem:

hydroseed.app

Do NOT leave FIRMA-specific product assumptions, branding, terminology, domains, examples, copy, metadata, routes, labels, documentation references, or business concepts in the resulting HYDROSEED Studio unless they are clearly generic and intentionally reusable.

The application must feel like it was originally designed for HYDROSEED.

Do not simply perform a superficial global find-and-replace from:

FIRMA → HYDROSEED

Instead, audit the existing implementation and adapt the actual product context.

3. SOURCE OF TRUTH

The ZIP and its Source of Truth document are the canonical reference.

Before changing anything:

Inspect the complete project structure.

Read the Source of Truth / architecture documentation.

Understand the existing FIRMA Studio implementation.

Identify what is actually implemented versus conceptual, mocked, planned, or coming soon.

Identify FIRMA-specific assumptions.

Identify reusable architecture and components.

Identify routes, navigation definitions, data models, services, hooks, queries and UI components that are already implemented.

Do not invent a parallel architecture.

The Source of Truth defines the intended architecture.

The existing code defines what is actually implemented.

Use both.

If the Source of Truth says something is planned but the code does not implement it, do NOT pretend it is implemented.

4. STRICT PRODUCT BOUNDARY

HYDROSEED Studio MUST NOT become part of the operational HYDROSEED OS / Field system.

Do NOT introduce or expose operational functionality such as:

Jobs

Field Jobs

Field App

Crews

Equipment

Materials operations

Recipes

Mix Engine

Batches

QA execution

Run timers

Operational scheduling

Production operations

Operational customers/projects

Hydroseeding job execution

Field photos used for operational QA

Operational intelligence

Farm production data

Operational recommendations

Those belong to the HYDROSEED operational product, not HYDROSEED Studio.

Studio should focus on:

Marketing

Public website content

Landing pages

Blog

Resources

Case studies

SEO

Analytics

Media

Publishing

Content governance

Growth infrastructure

Team/settings

Maintain this separation throughout the architecture.

5. TARGET NAVIGATION

The primary active navigation should be:

Workspace

Overview

Publishing

Landing Pages

Blog

Resources

Case Studies

Growth

SEO

Analytics

Media Library

System

Team

Settings

This is the core HYDROSEED Studio scope.

Do NOT add new top-level modules such as:

Campaigns

Leads

CRM

Brand

Social Media Manager

Ads Manager

AI Assistant

Sales

Customers

Operations

unless they already exist as required internal architecture from the canonical FIRMA implementation and are explicitly part of the source-of-truth architecture.

Do not invent new products or modules.

6. IMPORTANT — DO NOT DELETE THE OTHER ARCHITECTURE

There are modules from the original FIRMA Studio architecture that are not part of the initial active HYDROSEED Studio scope.

Examples include:

Architecture

Documentation

Academy

Newsletter

Integrations

Redirects

Taxonomy

These should NOT simply be deleted from the architecture or codebase without a technical reason.

Instead:

Preserve their architecture/code where it is already useful and safe.

Do NOT fully implement unfinished modules.

Mark them clearly as:

Coming Soon

The user-facing navigation should make it clear that these modules are future functionality.

For example:

Documentation Coming Soon

Academy Coming Soon

Newsletter Coming Soon

etc.

The badge should be visually small, subtle and consistent with the existing design system.

Do NOT make the Coming Soon badge dominate the navigation.

Do NOT create fake functionality behind these modules.

Do NOT create fake data just to make them appear implemented.

Do NOT remove useful architecture simply because a module is not part of the current MVP.

The principle is:

Preserve architecture, limit current scope, clearly communicate future functionality.

7. FIRMA-SPECIFIC CONTENT MUST NOT SURVIVE

This is extremely important.

The resulting application must not feel like a FIRMA product.

Audit and adapt all FIRMA-specific:

App name

Logo/branding references

Product names

Domains

URLs

Metadata

SEO metadata

Page titles

Descriptions

Navigation labels

Empty states

Demo content

Placeholder content

Documentation references

Example articles

Example resources

Example case studies

Author/company references

Footer references

Internal copy

Settings defaults

Workspace references

Any FIRMA-specific terminology

Replace/adapt these to HYDROSEED where appropriate.

The target mental model should be:

“This is HYDROSEED's internal marketing and content operating system.”

NOT:

“This is FIRMA Studio with a different logo.”

8. HYDROSEED BRAND CONTEXT

The application should understand that the public ecosystem is:

HYDROSEED

Public website:

hydroseed.app

Studio:

HYDROSEED Studio

The Studio manages content that can ultimately support the public HYDROSEED.APP presence.

Use HYDROSEED terminology consistently.

Do not introduce unrelated FIRMA terminology.

Do not introduce firma.farm, studio.firma.farm, or other FIRMA domains into the HYDROSEED implementation unless they are inside historical/source documentation that must remain untouched.

User-facing application behavior should be HYDROSEED-specific.

9. DO NOT REDESIGN

Preserve the existing FIRMA Studio:

Design system

Layout patterns

Sidebar behavior

Header patterns

Cards

Tables

Forms

Modals

Empty states

Badges

Typography

Spacing

Responsive behavior

Interaction patterns

Component architecture

Only adapt what is necessary for HYDROSEED.

Do not introduce a completely new visual system.

Do not redesign the sidebar just because the product name changed.

Do not replace working components unnecessarily.

Reuse existing components whenever possible.

10. DO NOT REBUILD EXISTING FEATURES

If a module already works in the ZIP:

reuse it.

Do not rebuild it from scratch.

Do not create duplicate components.

Do not create duplicate routes.

Do not create a second implementation of the same feature.

First understand the existing implementation.

Then modify only what is required to make it correct for HYDROSEED.

11. ARCHITECTURE PRESERVATION

Preserve the existing:

Framework

React architecture

TypeScript

Routing

State management

Query patterns

Supabase integration

Authentication patterns

UI component library

Styling system

Utilities

Existing folder structure

Existing feature boundaries

Existing data access patterns

Do NOT migrate frameworks.

Do NOT replace the router.

Do NOT replace the database layer.

Do NOT replace the UI system.

Do NOT add a new state-management library.

Do NOT add a new CMS.

Do NOT add a new backend.

Do NOT add packages unless absolutely necessary and justified.

12. DATA / BACKEND RULE

Do not make unnecessary database changes.

Before modifying schemas, migrations, RLS, queries or persistence:

Inspect what already exists.

Determine whether the existing architecture already supports the required HYDROSEED behavior.

Reuse existing structures wherever possible.

Only make a database change if it is actually required.

Do not create operational tables.

Do not connect Studio to operational HYDROSEED OS data.

Do not create cross-product coupling merely to make a feature easier.

13. ACTIVE VS FUTURE MODULES

Use this scope model:

ACTIVE NOW

Overview

Landing Pages

Blog

Resources

Case Studies

SEO

Analytics

Media Library

Team

Settings

COMING SOON

Preserve existing architecture for appropriate FIRMA Studio modules such as:

Architecture

Documentation

Academy

Newsletter

Integrations

Redirects

Taxonomy

These modules should have a subtle:

Coming Soon

badge.

They should NOT pretend to be fully functional.

If a Coming Soon route already exists, keep the route architecture but prevent accidental access to unfinished functionality if necessary.

If the current architecture already has a clean disabled-navigation mechanism, reuse it.

14. NO DEAD / BROKEN NAVIGATION

After adapting the navigation:

Active modules must work.

Coming Soon modules must clearly communicate their status.

There must be no broken links.

There must be no duplicate menu entries.

There must be no orphaned active routes exposed accidentally.

Do not expose unfinished functionality as production-ready.

Do not silently remove routes that are still needed by the architecture.

15. RESPONSIVE + LOCALIZATION READINESS

Preserve the existing readiness for:

English

French

Spanish

Arabic

RTL

Do not break RTL layouts.

Do not hard-code English-only assumptions into reusable components.

Do not remove existing localization architecture.

HYDROSEED Studio should remain capable of supporting the same internationalization direction as the original architecture.

16. SEO / PUBLIC WEBSITE RELATIONSHIP

HYDROSEED Studio is the internal content/growth layer.

The public destination is:

hydroseed.app

The Studio should conceptually own/manage:

Landing page content

Blog content

Resources

Case studies

SEO metadata

Media

Analytics configuration/integration architecture

But do not create a completely new public website implementation unless the existing FIRMA Studio architecture already contains the required public publishing layer.

Do not confuse:

Studio

with:

Public HYDROSEED.APP

The Studio manages the content ecosystem; it is not automatically the public website itself.

17. NO FAKE FEATURES

Never create fake implementations to make the product look complete.

Do not claim:

Connected integrations when they are not connected.

Real analytics when there is no analytics connection.

Real publishing when the backend does not support it.

Real SEO data when it is only mock data.

Real CMS functionality when it is not implemented.

Clearly distinguish:

Implemented

Mocked

Conceptual

Planned

Coming Soon

Not Connected

This rule is mandatory.

18. FIRST STEP — AUDIT BEFORE CODING

Before making modifications, perform a complete audit of the ZIP.

Your audit must identify:

A. Current architecture

Framework

Router

Main app structure

Feature structure

Data layer

Authentication

Database

UI system

B. Existing FIRMA Studio modules

For every module, state:

Implemented?

Partial?

Mocked?

Planned?

Coming Soon?

Relevant to HYDROSEED Studio?

Keep / Adapt / Future / Exclude?

C. FIRMA-specific references

Identify where FIRMA-specific:

branding

domains

content

metadata

routes

labels

copy

business logic

exist.

D. Navigation

Map the current navigation against the target HYDROSEED Studio navigation.

E. Risks

Identify:

potential broken routes

dependency issues

database risks

authentication risks

accidental operational coupling

components that should not be changed

19. BEFORE IMPLEMENTATION

Do NOT start randomly editing files.

First provide an audit summary with:

Current architecture

Current module status

HYDROSEED target scope

Modules to keep active

Modules to preserve as Coming Soon

FIRMA-specific elements that must be adapted

Files likely to change

Database changes required, if any

Risks

Exact implementation plan

Do not invent work that is not necessary.

20. IMPLEMENTATION PRINCIPLE

After the audit, implement only the approved transformation:

FIRMA Studio → HYDROSEED Studio

while preserving the existing architecture.

The goal is:

Same strong Studio foundation, correctly adapted to HYDROSEED.APP.

Not:

A new application invented from scratch.

21. ACCEPTANCE CRITERIA

The work is considered correct only if:

Branding

No inappropriate FIRMA branding remains in the user-facing HYDROSEED Studio.

HYDROSEED is the clear product identity.

HYDROSEED.APP is the relevant public ecosystem.

Navigation

The active navigation contains:

Workspace

Overview

Publishing

Landing Pages

Blog

Resources

Case Studies

Growth

SEO

Analytics

Media Library

System

Team

Settings

Future architecture

Appropriate existing modules remain architecturally preserved and are marked:

Coming Soon

rather than being unnecessarily deleted.

Separation

No operational HYDROSEED OS / Field functionality is introduced.

Architecture

Existing FIRMA Studio architecture is reused rather than unnecessarily replaced.

UX

Existing design system and responsive behavior remain intact.

Integrity

No fake integrations, fake data claims or fake production functionality.

Code quality

TypeScript remains clean.

Existing conventions are followed.

No unnecessary dependencies.

No duplicate implementations.

No broken imports.

No broken routes.

Validation

Run the project's available:

typecheck

lint

tests

build

commands.

If a command does not exist, report that instead of pretending it was executed.

22. FINAL REPORT

After implementation, report:

Changed

Files changed

Components changed

Routes changed

Navigation changes

Branding changes

HYDROSEED-specific adaptations

Preserved

Architecture preserved

Components reused

Future modules preserved

Validation

Typecheck result

Lint result

Test result

Build result

Limitations

Clearly list anything still:

Mocked

Planned

Coming Soon

Not Connected

Next recommended task

Recommend only the next logical task for HYDROSEED Studio.

Do not expand scope unnecessarily.

FINAL RULE

When in doubt:

Preserve the existing architecture.

Do not invent features.

Do not delete architecture without a reason.

Do not mix Studio with HYDROSEED OS / Field.

Do not leave FIRMA-specific product identity in the HYDROSEED product.

Do not redesign what already works.

Do not claim something is implemented if it is not.

The final result must feel like:

HYDROSEED Studio — the internal Marketing, Content, SEO and Growth operating system for HYDROSEED.APP.

and not like a renamed FIRMA Studio.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c2712fd5-23fc-4cd9-bd67-84d93ef459bf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
