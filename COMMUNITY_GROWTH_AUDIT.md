# Community-Led Growth Audit: Vikunja

## Executive Summary
1. **Add a “5‑minute self‑hosted quickstart” on the homepage with a one‑line Docker command and direct demo CTA** to shorten time‑to‑first‑value. Current CTAs point to long‑form docs and the demo is only in the nav. `src/pages/index.astro`, `src/components/partials/CloudOrSelfHosted.astro`, `src/components/Navigation.astro`, `src/content/docs/setup/install.mdoc`
2. **Create a “Homelab → Production” guide with an architecture diagram and migration checklist** to bridge personal installs to workplace deployment. Existing production‑relevant docs are scattered and not framed as a migration path. `src/content/docs/setup/full-docker-example.mdoc`, `src/content/docs/setup/backups.mdoc`, `src/content/docs/setup/reverse-proxies.mdoc`, `src/content/docs/setup/systemd-hardening.mdoc`, `src/content/docs/setup/k8s.mdoc`
3. **Publish a “Convince your boss” page + one‑pager** with ROI, security posture, compliance, and a clear OSS vs Cloud vs Enterprise comparison table. This is a high‑leverage gap for internal champions. `src/pages/features.astro`, `src/components/partials/Plans.astro`, `src/pages/security.md`, `src/pages/privacy.md`
4. **Add targeted SEO landing pages and comparisons** (“self‑hosted task management”, “Vikunja vs Todoist/Trello/Asana”) to pull homelab users into the funnel and arm champions with competitive context. There are no comparison pages or hobbyist‑targeted content today. `src/pages/index.astro`, `src/pages/features.astro`
5. **Introduce social proof and trust signals** (logos, case studies, adoption stories, public roadmap, status page). The site has strong open‑source credibility but minimal enterprise‑grade proof. `src/pages/index.astro`, `src/pages/features.astro`, `src/pages/security.md`, `public/security.txt`

## Detailed Findings

### First-touch experience audit
**Current state**  
Homepage clearly states “open‑source, self‑hostable to‑do app” and shows multiple product screenshots plus FAQ that confirms free self‑hosting. Primary CTAs are “Get Started” and “Meet Vikunja Cloud.” There is a demo link in the nav. `src/pages/index.astro`, `src/components/partials/CloudOrSelfHosted.astro`, `src/components/FAQSection.astro`, `src/components/Navigation.astro`  
The install docs include a `docker run` one‑liner and a Docker walkthrough, but they are not surfaced on the homepage. `src/content/docs/setup/install.mdoc`, `src/content/docs/setup/docker-start-to-finish.mdoc`

**Gaps**  
The hero message is poetic and the concrete “what it does” appears one line lower; clarity is good but not instant for a scanning visitor. There is no “5‑minute quickstart” block or visible one‑liner on the homepage. `src/pages/index.astro`  
No “what you’ll have in 5 minutes” or system requirements are present. `src/pages/index.astro`, `src/content/docs/setup/install.mdoc`

**Recommendations (priority)**  
1. [Critical] Add a “5‑minute self‑hosted quickstart” strip on the homepage with a copy‑paste `docker run` and a link to the Docker walkthrough. `src/pages/index.astro`, `src/content/docs/setup/install.mdoc`, `src/content/docs/setup/docker-start-to-finish.mdoc`  
2. [High] Elevate the demo CTA into the hero with “Try the live demo (no signup)” to accelerate the aha moment. `src/components/Navigation.astro`, `src/pages/index.astro`  
3. [High] Add a short “System requirements” callout in install docs and link it from the homepage. `src/content/docs/setup/install.mdoc`, `src/pages/index.astro`  

**Examples**  
```
Hero quickstart block:

Get running in 5 minutes (self‑hosted)
docker run -p 3456:3456 -v $PWD/files:/app/vikunja/files -v $PWD/db:/db vikunja/vikunja
Then open http://localhost:3456
```

### Homelab-to-production bridge
**Current state**  
There is solid production‑adjacent documentation: backups, reverse proxy setups, systemd hardening, fail2ban, metrics, LDAP, and OpenID, plus a full Docker Compose example and Helm chart. `src/content/docs/setup/backups.mdoc`, `src/content/docs/setup/reverse-proxies.mdoc`, `src/content/docs/setup/systemd-hardening.mdoc`, `src/content/docs/setup/fail2ban.mdoc`, `src/content/docs/setup/metric.mdoc`, `src/content/docs/setup/ldap.mdoc`, `src/content/docs/setup/openid.mdoc`, `src/content/docs/setup/full-docker-example.mdoc`, `src/content/docs/setup/k8s.mdoc`

**Gaps**  
There is no single “production readiness” or “homelab → production” guide that ties these pieces together. No HA or scaling guidance (replication, multi‑node, failover), no explicit disaster recovery plan, and no architecture diagram. `src/content/docs/setup/*`  
Enterprise‑only features are only visible in the pricing section and not contrasted against OSS in a clear matrix. `src/components/partials/Plans.astro`, `src/pages/features.astro`

**Recommendations (priority)**  
1. [Critical] Create a “Homelab → Production” guide that sequences: data storage choice, reverse proxy + TLS, backups, monitoring, SSO, and scaling expectations. `src/content/docs/setup/*`  
2. [High] Add a high‑level architecture page with a simple diagram for infra/IT review. `src/pages/docs.md`  
3. [High] Add an OSS vs Cloud vs Enterprise comparison table and link it from docs and pricing. `src/components/partials/Plans.astro`, `src/pages/features.astro`

**Examples**  
```
Homelab → Production checklist (outline):
1) Choose DB (Postgres recommended) → link to Full Docker Example
2) Configure reverse proxy + TLS → link to Reverse Proxies
3) Set up backups + retention → link to What to Backup
4) Enable SSO (OIDC/LDAP) → link to OpenID + LDAP
5) Add monitoring → link to Metrics
6) Plan scaling/HA → add new section
```

### Internal champion enablement ("Convince your boss" toolkit)
**Current state**  
Security and privacy are documented; enterprise support is mentioned in Support. `src/pages/security.md`, `src/pages/privacy.md`, `src/pages/support.md`  
Enterprise pricing/feature list exists inside the Pricing section of Features. `src/components/partials/Plans.astro`, `src/pages/features.astro`

**Gaps**  
No “Convince your boss” page, no ROI/TCO narrative, no procurement‑friendly assets, and no case studies or logos. `src/pages/*`  
No downloadable one‑pager or security/compliance sheet. `src/pages/security.md`, `src/pages/support.md`

**Recommendations (priority)**  
1. [Critical] Create a “Convince your boss” page with ROI, cost comparison, and deployment options. `src/pages`  
2. [High] Add a one‑page PDF and a short slide deck for internal sharing. `public/`  
3. [High] Add a security/compliance section that summarizes data handling, hosting region, and vendor risk (even if SOC2 is not available). `src/pages/security.md`, `src/pages/privacy.md`  

**Examples**  
```
Convince your boss page sections:
- Summary: Why Vikunja for teams
- Cost model: SaaS vs self‑hosted
- Security & compliance: GDPR, hosting region, security practices
- Deployment options: single node, Docker, Kubernetes
- Comparison: Vikunja vs Todoist/Trello/Asana
- Proof: user logos or short quotes
```

### Community & champion funnel
**Current state**  
Community links exist in footer and Contact page (forum, Matrix, social), and a newsletter signup is present. `src/components/Footer.astro`, `src/pages/contact.md`, `src/components/partials/SubscribeToNewsletter.astro`  
Changelog has RSS for updates. `src/pages/changelog.astro`

**Gaps**  
No champion/ambassador program, no referral incentive, and no homelab‑targeted content stream (blog/tutorials). `src/pages/*`, `src/content/*`  
GitHub/Gitea “star/contribute” prompts are minimal (only a “Code” link in footer). `src/components/Footer.astro`

**Recommendations (priority)**  
1. [High] Add a “Community” page that centralizes forum, Matrix, Git repos, and contribution pathways. `src/pages`  
2. [High] Launch a lightweight “Champion” program with badges, swag, and recognition. `src/pages/support.md`  
3. [Medium] Add homelab‑focused tutorials (Raspberry Pi, TrueNAS, Proxmox). `src/content/`  

**Examples**  
```
Community page quick CTA copy:
- Join the forum
- Get help on Matrix
- Star the repo
- Become a Champion (swag + recognition)
```

### Conversion & upgrade path
**Current state**  
Pricing is available on `/features#pricing` with Personal/Organization/Enterprise tiers and a 14‑day trial for cloud. `src/components/partials/Plans.astro`, `src/pages/features.astro`  
Enterprise CTA is a mailto link. `src/components/partials/Plans.astro`

**Gaps**  
No dedicated `/pricing` page for SEO or shareability. No explicit “OSS → Enterprise” upgrade narrative or feature matrix. `src/pages/features.astro`  
No self‑serve enterprise trial/POC or guidance for pilot runs. `src/components/partials/Plans.astro`

**Recommendations (priority)**  
1. [High] Create a dedicated `/pricing` page with a clear OSS/Cloud/Enterprise comparison table. `src/pages`  
2. [High] Add a “Run a team pilot” CTA with steps and success criteria. `src/pages/features.astro`  
3. [Medium] Publish a transparent note on usage analytics and scaling signals (telemetry/opt‑in). `src/pages/privacy.md`, `src/layouts/Layout.astro`

**Examples**  
```
Pilot CTA:
“Run a 2‑week team pilot”
- 10–50 users
- Success metrics
- Migration plan
- Contact for support
```

### SEO & discoverability for the target persona
**Current state**  
Homepage and Features mention “open‑source” and “self‑hostable,” and the site has OG tags, schema, sitemap, and robots.txt. `src/pages/index.astro`, `src/pages/features.astro`, `src/layouts/Layout.astro`, `public/robots.txt`  
Docs include Docker and Helm deployment guides but aren’t framed as SEO landing pages. `src/content/docs/setup/*`

**Gaps**  
No explicit “self‑hosted task management” or “homelab” keyword targeting in landing pages. `src/pages/index.astro`, `src/pages/features.astro`  
No comparison pages (Vikunja vs alternatives) or category landing pages. `src/pages/*`

**Recommendations (priority)**  
1. [High] Add dedicated SEO pages for “self‑hosted task manager,” “open source to‑do app,” and “Vikunja Docker.” `src/pages`  
2. [High] Publish comparison pages: Vikunja vs Todoist/Trello/Asana/ClickUp. `src/pages`  
3. [Medium] Add homelab‑specific blog/tutorial content. `src/content/`  

**Examples**  
```
Page title example:
“Vikunja — Self‑Hosted Task Management (Docker & Kubernetes)”
Meta description:
“Open‑source task management you can self‑host. 5‑minute Docker setup, LDAP/SSO, backups, and full control.”
```

### Trust & transparency signals
**Current state**  
Open‑source license is referenced; code repo is linked; security page and security.txt exist; privacy policy is present. `src/pages/features.astro`, `src/components/Footer.astro`, `src/pages/security.md`, `public/security.txt`, `src/pages/privacy.md`  
Founder quote on homepage builds authenticity. `src/pages/index.astro`

**Gaps**  
No public roadmap, no team/company page, no uptime/status page for SaaS. `src/pages/*`  
No customer logos or case studies to signal production use. `src/pages/*`

**Recommendations (priority)**  
1. [High] Publish a public roadmap (even a simple “Now/Next/Later” page). `src/pages`  
2. [High] Add a status/uptime page link for Vikunja Cloud. `src/components/Footer.astro`  
3. [Medium] Add a lightweight “About the team/company” page. `src/pages`  

**Examples**  
```
Roadmap structure:
Now: 3–5 items with expected quarter
Next: 3–5 items
Later: 3–5 items
```

## Quick Wins
1. Add a homepage quickstart strip with the Docker one‑liner and “Open in demo” CTA. `src/pages/index.astro`, `src/components/Navigation.astro`, `src/content/docs/setup/install.mdoc`  
2. Add a short “System requirements” callout to the install doc. `src/content/docs/setup/install.mdoc`  
3. Add a “Production readiness” checklist callout at the top of the full Docker example. `src/content/docs/setup/full-docker-example.mdoc`  
4. Add a one‑screen OSS/Cloud/Enterprise comparison table under Pricing. `src/components/partials/Plans.astro`  
5. Add explicit “Star/Contribute” links in the footer. `src/components/Footer.astro`

## Suggested New Pages / Content
1. **/quickstart** (Critical). A 5‑minute self‑hosting guide with one‑line Docker command, browser URL, and “what you’ll see” screenshots. Links out to Docker walkthrough and full Docker example.  
2. **/homelab-to-production** (Critical). A migration playbook that sequences storage, reverse proxy/TLS, backups, monitoring, SSO, and scaling guidance, with a diagram and checklist.  
3. **/convince-your-boss** (High). Internal champion kit: ROI/TCO, security posture, deployment options, and a printable one‑pager.  
4. **/pricing** (High). Dedicated pricing page with OSS vs Cloud vs Enterprise comparison table, pilot CTA, and procurement FAQ.  
5. **/compare/vikunja-vs-todoist**, **/compare/vikunja-vs-trello**, **/compare/vikunja-vs-asana** (High). SEO‑friendly comparisons focusing on self‑hosting, privacy, and team features.  
6. **/security-and-compliance** (Medium). A vendor‑friendly overview: data residency, hosting provider, security practices, DPA availability, and incident response.  
7. **/case-studies** (Medium). Short “homelab → work adoption” stories with metrics and quotes.
