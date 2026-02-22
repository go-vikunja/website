# Vikunja Community-Led Growth Website Audit

## Executive Summary

The Vikunja website is a well-built Astro static site with solid technical foundations -- good SEO basics, structured data, responsive design, and comprehensive documentation. However, it has significant gaps in the **homelab-to-enterprise adoption funnel** that is critical for community-led growth.

### Top 5 Recommendations (Ranked by Impact)

1. **Create a dedicated Quickstart page** -- The path from homepage to a running instance requires 2-3 clicks and scrolling past ~150 lines of binary install docs to find the Docker command. A single-page "5-minute quickstart" would dramatically reduce first-touch friction.

2. **Fix the broken OG image** -- `src/layouts/Layout.astro:24` references `/images/vikunja.jpg` which doesn't exist anywhere in the repo. Every shared link to vikunja.io shows a broken preview image on social media. This is the highest-ROI quick fix.

3. **Create comparison/alternative pages** -- Zero "Vikunja vs X" or "alternative to X" pages exist. These are critical for SEO discovery by people searching for Todoist/Trello/Asana alternatives, which is exactly the audience most likely to become champions.

4. **Build a "Convince Your Boss" toolkit** -- No enterprise-justification content exists. No ROI content, no comparison table between self-hosted and cloud, no one-pager for decision-makers. This is the critical missing piece for the homelab-to-enterprise bridge.

5. **Add a real blog** -- The blog was migrated entirely into the changelog. There are 35 release notes and 1 essay. Zero topical content (homelab guides, productivity tips, migration stories, community spotlights). This is a major missed opportunity for organic discovery and community building.

---

## Section 1: First-Touch Experience

### Current State

**Homepage** (`src/pages/index.astro`):
- H1: "Plan your projects with the elegance of a sloth on a sunny day" -- playful but doesn't mention "task management" or what the product actually is
- H2: "Vikunja, the fluffy, open-source, self-hostable to-do app" -- the actual value proposition is buried in the H2
- The meta description says "open-source, self-hostable to-do app" but the on-page H1 doesn't
- Two CTAs above the fold via `CloudOrSelfHosted` component: "Get Started" (self-host) and "Meet Vikunja Cloud"
- Auto-rotating carousel of 9 screenshots with no interaction controls
- No video content anywhere on the site

**Demo Access** (`Navigation.astro:31`):
- Demo link at `try.vikunja.io/demo-account-create/` lives only in the navigation bar with "No sign-up required" sub-text
- Not mentioned in the homepage body content at all

**Social Proof**:
- Only the founder's personal blockquote on the homepage (`index.astro:161-177`)
- No customer testimonials, user counts, company logos, or press mentions anywhere

### Gaps

- H1 is branding-focused rather than SEO/value-focused
- Demo is hidden in the nav, not promoted as a CTA
- No video walkthrough or interactive preview
- Zero third-party social proof
- No GitHub star badge or download count visible

### Recommendations

1. Move the product descriptor into the H1 or make the H2 more prominent
2. Add a "Try the Demo" CTA alongside the existing Cloud/Self-host CTAs on the homepage
3. Add a GitHub stars badge and/or download count to the homepage
4. Collect and display user testimonials or community quotes

---

## Section 2: Homelab-to-Production Bridge

### Current State

**Installation Path**:
- "Get Started" button links to `/docs/installing` (full install page, not a quickstart)
- Docker `run` command is buried ~150 lines deep after binary install instructions (`install.mdoc:146-156`)
- Docker Compose walkthrough is 3 clicks deep: Homepage -> Install -> Docker Walkthrough (`docker-start-to-finish.mdoc`)
- Kubernetes docs are minimal (20 lines, just links to external Helm chart repos) at `k8s.mdoc`

**Production Documentation** (present):
- Backup/Restore: `backups.mdoc`
- Reverse Proxies: `reverse-proxies.mdoc` (NGINX, Apache, Caddy)
- Systemd Hardening: `systemd-hardening.mdoc`
- Fail2Ban: `fail2ban.mdoc`
- Prometheus/Grafana: `metric.mdoc`
- SSO/OIDC: `openid.mdoc` (374 lines, comprehensive)
- LDAP/AD: `ldap.mdoc` (220 lines, includes Active Directory)
- Full-text Search: `paradedb.mdoc`

**Production Documentation** (missing):
- No HA/scaling documentation
- No load balancing guide
- No database replication/clustering docs
- No system requirements page (no minimum RAM/CPU/disk stated anywhere)
- No version-to-version upgrade guide (just "replace binary, check changelog" in 7 lines at `install.mdoc:138-144`)

**Homelab Ecosystem**:
- The term "homelab" appears exactly once -- in an external link at `install.mdoc:347`
- Zero references to: Raspberry Pi, Unraid, Proxmox, TrueNAS
- "Synology" appears only in a Docker Compose example

### Gaps

- No quickstart page -- the fastest path is buried in a comprehensive install doc
- No system requirements page
- No "Running Vikunja on a Raspberry Pi" or similar homelab-targeted content
- The upgrade guide is dangerously minimal (7 lines)
- No architecture diagrams for production deployment

### Recommendations

1. Create a `/docs/quickstart` page with a single Docker command and a "you're done" confirmation
2. Create a system requirements page (min RAM, CPU, disk, supported databases, supported OS)
3. Write homelab-targeted guides (Raspberry Pi, Unraid, Proxmox)
4. Expand the upgrade documentation with version-specific notes and rollback procedures
5. Add architecture diagrams showing deployment topologies

---

## Section 3: Internal Champion Enablement

### Current State

**Enterprise Content**:
- Enterprise pricing lives only as the third card in `Plans.astro:104-143`, embedded in the Features page
- Enterprise CTA is a bare `mailto:hello@vikunja.io` link -- no contact form, no demo request flow
- Enterprise features listed: dedicated instance, unlimited storage, team billing, admin interface, BYOS, GDPR DPA, priority support, team training
- No standalone enterprise page, no standalone pricing page

**"Convince Your Boss" Content**: None exists.
- No ROI calculator or TCO analysis
- No business case template
- No feature comparison matrix (self-hosted vs cloud vs enterprise)
- No PDF/downloadable one-pager for decision makers
- No case studies or customer success stories

**Security/Compliance for Enterprise**:
- Security page (`security.md`) covers basic practices and vulnerability reporting
- References Hetzner's ISO 27001 (hosting provider's cert, not Vikunja's own)
- GDPR DPA mentioned in Enterprise pricing card but no linked template
- No SOC 2, no penetration testing reports, no compliance certifications
- Privacy policy (`privacy.md`) is a basic generated template

### Gaps

- Zero content helping a champion justify the purchase internally
- No contact form or structured enterprise inquiry flow
- No enterprise trial/POC offering (14-day trial only for standard plans)
- No security whitepaper or compliance documentation
- No feature comparison between tiers

### Recommendations

1. Create a `/enterprise` page with detailed feature descriptions, security info, and a contact form
2. Create a "Why Vikunja" or "Convince Your Boss" page with:
   - Feature comparison matrix (self-hosted vs cloud tiers)
   - Security and compliance overview
   - Migration ease (imports from Todoist, Trello, MS To-Do)
3. Replace the `mailto:` enterprise CTA with a proper contact/demo request form
4. Create a downloadable PDF one-pager for champions to share internally
5. Offer an enterprise trial or POC program

---

## Section 4: Community & Champion Funnel

### Current State

**Community Channels** (linked in footer on every page):
- Community Forum: `community.vikunja.io`
- Matrix Chat: `matrix.to/#/#vikunja:matrix.org`
- Social: Instagram, Mastodon, LinkedIn, Bluesky, X

**Blog/Content**:
- No blog content collection exists -- the old `/blog/` was redirected to `/changelog/` (50 redirect rules in `_redirects`)
- 35 release notes + 1 essay ("Why Vikunja is moving from Gitea to GitHub") = entire content output
- Zero topical blog posts (no productivity tips, homelab guides, migration stories, community spotlights)

**Contributor Engagement**:
- Development docs exist (`development/development.mdoc`) with fork/PR workflow
- No contributor program, ambassador program, or champion program
- No structured onboarding or recognition for contributors

**Newsletter** (Footer, every page):
- Listmonk-backed newsletter with Turnstile captcha
- "We'll email you about releases and news about Vikunja. Low traffic."
- RSS feed exists for changelog at `/changelog/rss.xml`
- Missing: RSS autodiscovery `<link>` tag in HTML head

**Missing**:
- No Discord (only Matrix)
- No GitHub Discussions link
- No social sharing buttons on any page
- No GitHub star CTA anywhere
- No Reddit community linked

### Gaps

- No blog means no organic content discovery beyond product pages
- No content to nurture the journey from "interested user" to "champion"
- No social sharing functionality to amplify content
- RSS autodiscovery missing (browsers/readers can't auto-detect the feed)

### Recommendations

1. Launch a blog section with content targeting:
   - Homelab/self-hosting audience: "Best open-source task managers for your homelab"
   - Migration guides: "Switching from Todoist to Vikunja"
   - Productivity tips using Vikunja features
   - Community spotlights and use cases
2. Add social sharing buttons to changelog/blog entries
3. Add a GitHub stars badge to the homepage and/or footer
4. Add RSS autodiscovery `<link>` tag to the Layout head
5. Consider a contributor recognition/spotlight program

---

## Section 5: Conversion & Upgrade Path

### Current State

**Three conversion paths exist**:
1. Self-hosted install: "Get Started" -> `/docs/installing`
2. Cloud signup: "Meet Vikunja Cloud" / "Buy" -> `app.vikunja.cloud`
3. Enterprise inquiry: "Get a quote" -> `mailto:hello@vikunja.io`

**Pricing** (`Plans.astro`, embedded in Features page):
- Personal: 4 EUR/month (40 EUR/year)
- Organization: 5 EUR/user/month (50 EUR/user/year)
- Enterprise: Custom pricing
- 14-day free trial for Personal and Organization
- "Why is there no free version?" FAQ explains the business model well

**Cloud Hosting Affiliate** (`CloudHostingAffiliate.astro`):
- Embedded in Docker walkthrough with affiliate links to Hetzner and DigitalOcean

### Gaps

- No standalone pricing page (embedded as `#pricing` anchor on features page)
- No lead capture form anywhere
- No gated content or newsletter-gated downloads
- No way to track or nurture enterprise leads
- No free tier funnel that naturally upgrades to paid
- No in-product upgrade prompts documented

### Recommendations

1. Create a standalone `/pricing` page for better SEO and conversion tracking
2. Replace the enterprise `mailto:` with a proper lead capture form
3. Consider a "freemium" cloud tier or extended trial for team evaluation
4. Add conversion-focused CTAs within documentation (e.g., "Managing a team? Try Vikunja Cloud")

---

## Section 6: SEO & Discoverability

### Current State

**Strengths**:
- Canonical URLs on all pages (`Layout.astro:26,56`)
- Full Open Graph tag set (title, description, url, image, type)
- Twitter Cards with `summary_large_image`
- Sitemap auto-generated via `@astrojs/sitemap`
- robots.txt blocks `/_astro/`, references sitemap
- JSON-LD structured data: Organization (global), SoftwareApplication (homepage), FAQPage (homepage)
- All docs have frontmatter `title` and `description` (flows to meta tags)
- Content-rich documentation (42 doc pages, 35 changelog entries)

**Issues**:
- **Broken OG image**: `Layout.astro:24` defaults to `/images/vikunja.jpg` which doesn't exist in `public/`
- **Broken `/stickers` link**: Footer links to `/stickers` (`Footer.astro:140`) but no page or redirect exists
- **Missing `twitter:site`/`twitter:creator`** meta tags
- **Missing RSS autodiscovery** `<link>` tag
- **No Article/BlogPosting schema** on changelog entries
- **No BreadcrumbList schema** for navigation hierarchy
- **Features page title** is just "Features" -- doesn't include "Vikunja"
- **H1 is branding, not keywords**: The keyword-rich "open-source, self-hostable to-do app" is in the H2

**Keyword Presence**:
- "self-hosted/self-hostable": 30+ locations -- well-targeted
- "open source": 28 occurrences across 15 files
- "homelab": 1 instance (external link only)
- "docker": 146 occurrences
- "task management": mentioned in meta description but not in visible homepage text

**Missing Content for SEO**:
- Zero comparison pages ("Vikunja vs Todoist", "Vikunja vs Trello")
- Zero "alternative to X" pages
- No standalone pricing page URL
- Minimal homelab/self-hosting ecosystem keywords

### Recommendations

1. **Fix the OG image** -- add a proper default image at `public/images/vikunja.jpg` or update the fallback path
2. **Fix the `/stickers` link** -- either create the page or add a redirect in `_redirects`
3. Create comparison landing pages targeting "[competitor] alternative" keywords
4. Add Article/BlogPosting JSON-LD to changelog entries
5. Add BreadcrumbList schema for documentation navigation
6. Add RSS autodiscovery link to Layout head
7. Include "Vikunja" in all page titles (e.g., "Vikunja Features" not just "Features")

---

## Section 7: Trust & Transparency Signals

### Current State

**Present**:
- License clearly stated (AGPLv3) on features page (2x), FAQ, plans section, homepage JSON-LD
- Source code link in footer (every page), features page, contact page
- Security page (`security.md`) with vulnerability reporting, PGP key, `security.txt`
- Privacy policy (`privacy.md`) with GDPR compliance info
- Legal imprint (`imprint.md`) with German business registration, VAT ID
- Founder identified by name on homepage with personal philosophy quote
- "Made and hosted in the EU" tagline

**Missing**:
- No About/Team page (founder identity is scattered across homepage quote and imprint)
- No Roadmap page (only a `<!-- TODO Roadmap -->` HTML comment at `features.astro:275`)
- No Terms of Service
- No Status/Uptime page
- No trust badges or certification logos
- No customer testimonials or logos
- No SOC 2 or own ISO certification (only references Hetzner's)
- Privacy policy is a basic generated template

### Recommendations

1. Create an About page with team info, company history, and mission
2. Create a public roadmap (or link to an external one like a GitHub project board)
3. Add Terms of Service
4. Set up a status/uptime page for the cloud service
5. Pursue and display relevant compliance certifications for enterprise sales

---

## Quick Wins (Implementable in a Day)

1. **Fix broken OG image**: Add a real image file at the path referenced in `Layout.astro:24`, or update the path
2. **Fix broken `/stickers` link**: Add a redirect in `public/_redirects`
3. **Add "Vikunja" to all page titles**: Update title props in `features.astro`, `changelog.astro`, etc.
4. **Add RSS autodiscovery**: Add `<link rel="alternate" type="application/rss+xml" ...>` to `Layout.astro`
5. **Add `twitter:site` meta tag**: Add `@vikunjaio` to Layout.astro
6. **Promote the Demo on homepage**: Add "Try the Demo" as a third CTA option alongside Cloud/Self-host

---

## Suggested New Pages/Content (10 Items)

| # | Page | Brief | Target Audience |
|---|------|-------|-----------------|
| 1 | `/docs/quickstart` | 5-minute guide: single Docker command -> working instance -> first task created | First-time self-hosters |
| 2 | `/compare/todoist` | Feature-by-feature comparison: Vikunja vs Todoist (pricing, privacy, features) | Users searching for alternatives |
| 3 | `/compare/trello` | Feature-by-feature comparison: Vikunja vs Trello | Users searching for alternatives |
| 4 | `/enterprise` | Dedicated enterprise page: features, security overview, compliance, contact form | IT decision makers |
| 5 | `/why-vikunja` | "Convince your boss" page: business value, migration ease, security, open-source advantages | Internal champions |
| 6 | `/about` | Team page, company story, mission, sustainability model | Enterprise evaluators, press |
| 7 | `/roadmap` | Public roadmap showing planned features and development direction | Champions, enterprise buyers |
| 8 | `/blog` | Blog section for topical content beyond release notes | Organic search visitors |
| 9 | `/docs/system-requirements` | Hardware/software requirements, supported databases, supported OS | IT administrators |
| 10 | `/pricing` | Standalone pricing page with full feature comparison matrix | All buyers |
