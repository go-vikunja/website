# Vikunja Positioning

Last updated: 2026-03-10 by /positioning-angles

---

## Primary Positioning

**Angle: The Todoist Alternative You Actually Own**

**Statement:** Vikunja gives you everything you love about Todoist -- lists, labels, reminders, quick add -- running on your own server. And when your team needs it too, it's already there: shared projects, multiple views, and enterprise features like SSO without needing 500 employees to unlock them.

**Psychology:** Self-hosters searching for a Todoist replacement have high intent and a known pain point. The "you actually own it" framing resonates specifically with the self-hosting audience -- ownership isn't just a feature, it's why they self-host in the first place. The growth story (personal tool that scales to your team) differentiates Vikunja from simpler self-hosted alternatives like Kanboard or WeKan that stay single-user or basic.

**Headline direction:** "Your to-do list, your server. And when your team needs it -- enterprise features without the enterprise price tag."

**Best for:** Website hero, SEO content, comparison posts, product directories, self-hosting community outreach.

### How the angle layers

The primary angle has three layers that surface in different contexts:

**Layer 1 -- Lead: Self-hosted Todoist alternative**
- Captures high-intent search traffic ("Todoist alternative", "self-hosted task manager", "open source to-do app")
- Speaks directly to self-hosters comparing options for their stack
- Framing: "Your to-do list, your server, your rules"

**Layer 2 -- Secondary: Grows with your team**
- Differentiates from other self-hosted to-do apps that stay single-user or basic
- Tells a natural story: "Works for your grocery list AND your team's sprint board"
- NOT enterprise-first language -- it's a natural extension of the personal tool
- Surfaces when describing features, on the features page, in comparison content

**Layer 3 -- When relevant: Enterprise features at any team size**
- Surfaces on pricing pages, enterprise pages, and B2B content -- not the hero
- Targets regulated SMEs who need SSO and audit logs but have 8 employees, not 800
- Framing: "Your compliance requirements don't care how many employees you have"
- Strongest differentiator against OpenProject (25-user minimum), Plane (Fortune 10 positioning), Planka (1,000-user enterprise minimum)

---

## Target Audience

### Primary: Self-hosters and home-labbers

People who already run Nextcloud, Gitea, Immich, and similar tools on their own infrastructure. They self-host by conviction, not convenience. They're looking for a proper task manager that fits their stack. They compare options in r/selfhosted, awesome-selfhosted lists, and homelab YouTube channels.

**They won't pay for the product directly -- but they are the unpaid sales force.** Every home-labber who loves Vikunja is a potential advocate inside their workplace.

### Secondary: Small tech companies (5-30 people)

Companies that self-host by policy or preference. They need something between "personal to-do app" and "full Jira." They're the ones who actually buy the enterprise self-hosted tier. Often discovered Vikunja because someone on the team already runs it at home.

### Tertiary: Individual Todoist/TickTick users discovering self-hosting

People who find Vikunja through "Todoist alternative" searches. Some will use Cloud, some will start self-hosting. They expand the community and contribute to the reputation that makes SMEs comfortable buying.

---

## Go-to-Market: Home-labber to SME Revenue

### The core insight

Home-labbers are not a cost center. They are the distribution channel. The same go-to-market that built Docker, Tailscale, and GitLab: free self-hosted users create community, credibility, and workplace advocates.

```
Home-labber discovers Vikunja
(r/selfhosted, awesome-selfhosted, Fediverse)
        |
        v
Uses it personally, loves it
(free, self-hosted, part of their stack)
        |
        v
+-------+--------+
|                |
v                v
BOTTOM-UP        DIRECT SME
(Trojan Horse)   (Separate funnel)
|                |
v                v
Brings it to     IT lead / founder
work, tells      searches for
their boss       "self-hosted PM
|                with SSO"
v                |
Company needs    v
SSO, support,    Finds Vikunja,
SLA              sees large community
|                as proof it works
v                |
Buys enterprise  v
self-hosted      Same buyer
        |
        v
   ENTERPRISE REVENUE
```

### Conversion strategies

**Strategy 1: Make the Trojan Horse frictionless**

- Create a "Bring Vikunja to Work" page -- give home-labbers ammunition to pitch their boss. A one-pager they can forward: "You're already using Vikunja at home. Here's what the enterprise tier adds for your team."
- Write up the existing success story as a case study: "How one developer brought Vikunja from their home lab to a 15-person team."
- Make enterprise features visible to free users at the natural discovery point. When someone in a self-hosted instance tries to configure SSO or needs audit logs, show "Available in the Enterprise tier" with a clear path. The feature gate IS the marketing.

**Strategy 2: Direct SME acquisition**

- SEO for SME-specific queries: "self-hosted project management GDPR", "open source task manager SSO", "Jira alternative self-hosted small team"
- EU software directories: EUalternative.eu, souverainete-numerique.eu, German public sector procurement lists
- Enterprise landing page that speaks the buyer's language: compliance, SLA, SSO, data residency, DPA. Different buyer than the home page, different copy.

**Strategy 3: Community size as social proof**

- Every self-hosted instance -- even free ones -- is a credibility signal for SME buyers
- Surface proof on the enterprise page: Docker pulls, community size, commit activity, contributor count
- Active community = active development = safe to depend on

**Strategy 4: Pricing that captures the transition**

- Enterprise self-hosted pricing should be a single, easy-to-pitch number
- Avoid per-user pricing that punishes growth (OpenProject's model)
- The home-labber needs to be able to say one number to their boss
- Consider flat-rate or tiered-flat pricing (e.g., "up to 25 users for X EUR/month")

### What free users contribute (even if they never pay)

- Bug reports and feature requests
- Community forum activity (social proof for SME buyers)
- Blog posts, "my homelab stack" videos, recommendations
- SEO amplification through self-hosted guides mentioning Vikunja
- Workplace advocacy (the Trojan Horse)

---

## Competitive Landscape

### Consumer competitors (Layer 1 -- Todoist alternative)

| Competitor | Core Positioning | Vikunja's Advantage |
|-----------|-----------------|---------------------|
| Todoist | "Organize Your Work & Life" -- 30M users, leaning into AI | No self-hosting, closed source, US-based, subscription for filters/reminders |
| TickTick | All-in-one personal productivity (tasks + habits + Pomodoro) | Closed source, China-based (privacy concern), no self-hosting |
| Notion | "All-in-one workspace" -- bloated, slow | Not a task manager, US-based, no self-hosting, complex |
| Trello | "Organize anything, together" -- Kanban only, Atlassian-backed | Kanban-only, lock-in, no self-hosting |

### Self-hosted competitors (Layer 2 -- grows with your team)

| Competitor | Core Positioning | Vikunja's Advantage |
|-----------|-----------------|---------------------|
| OpenProject | Enterprise PM, "secure environment" | 25-user minimum on paid plans, overkill for personal use, heavy |
| Plane | "PM for teams and agents", Fortune 10 references | Targeting upmarket, no personal productivity story, closed-source enterprise |
| Leantime | "For non-project managers", neurodivergent-friendly | Plugin marketplace model, less established, narrow niche |
| Taiga | "Free and open-source, for agile teams" | Agile-only, limited reporting/dashboards, stagnating |
| Huly | "All-in-one Linear/Jira/Slack alternative" | Developer-focused, complex stack to self-host, no personal task story |
| Worklenz | "All in one PM for efficient teams" | Less established, free tier reportedly limits to 5 members |
| WeKan | "Open-Source Kanban" | Kanban only, no project management features |
| Kanboard | Minimalist Kanban | Deliberately limited features, no team features |
| Planka | "Self-hosted Kanban, battle-tested" | Kanban-focused, enterprise starts at 1,000 users |

### Saturated claims (what NOT to lead with)

These are non-differentiating -- every self-hosted PM tool says them:

- "Open source"
- "Self-hosted / own your data"
- "Jira alternative" / "Trello alternative"
- "For all teams" / "teams of any size"
- "Easy to set up" / "deploy in minutes"
- "Privacy / data sovereignty"
- "Customizable workflows"
- "Modern UI"

### White space (what nobody claims)

- **Nobody explicitly targets SMEs (5-50 people).** Positioning is either "for everyone" (generic) or "for enterprise" (excluding small teams).
- **Enterprise features (SSO, audit logs) are locked behind 25-100+ user minimums.** Regulated SMEs can't access them.
- **Nobody owns the personal-to-team transition.** "I outgrew Todoist but OpenProject is overkill" has no answer.
- **EU-hosted + enterprise for SMEs has zero competition** in the self-hosted PM space.
- **Flat-rate enterprise pricing for self-hosted** is almost nonexistent (only Worklenz at $99/month).

---

## Supporting Angles

These support the primary angle in specific contexts. They are not separate campaigns -- they're facets of the same story.

### The Bootstrapped Builder's Journal

**Use for:** Newsletter, Indie Hackers, Hacker News, Bluesky, build-in-public content.

**Statement:** Follow along as a solo founder builds sustainable open-source enterprise software -- funded by users, not VCs.

**Why it matters:** Konrad's solo-founder voice is Vikunja's strongest brand asset. Build-in-public content creates deep audience loyalty and generates organic content that no competitor can replicate. The enterprise pivot makes the story more interesting: "Solo founder adds enterprise features and competes with VC-backed tools."

**Content themes:**
- Revenue/growth transparency
- Technical deep-dives into architectural decisions
- The economics of open-source SaaS
- "Here's what your subscription funded this month"

### The Privacy-First / EU-Made Tool

**Use for:** EU software directories, German tech media (Heise, Golem, t3n), GDPR-related content, privacy communities, public sector outreach.

**Statement:** Task management built, hosted, and supported in Europe -- with enterprise features that don't require an enterprise budget or a US data transfer.

**Why it matters:** Combines two former separate angles (Privacy-First and EU-Made) into one. EU digital sovereignty is accelerating, and Vikunja's "Made in Germany" + self-hostable + open source + enterprise features is a combination no competitor matches.

**Content themes:**
- GDPR compliance for task management
- "What your to-do app knows about you"
- EU digital sovereignty and the CLOUD Act
- Case studies of European teams using Vikunja

### The Flexible Workhorse

**Use for:** Video content, feature demos, productivity subreddits, visual social content.

**Statement:** Four views of your work -- list, Kanban, Gantt, and table -- so you organize however your brain works.

**Why it matters:** Most competitors are associated with a single paradigm (Trello = Kanban, Todoist = lists). Vikunja's four views are visually demonstrable and immediately understandable. Best angle for video and screenshots.

**Content themes:**
- "One tool, four views" demos
- Workflow showcases by profession
- "I replaced Trello + Google Sheets + [Gantt tool]"
- Comparison with Notion (focused and fast vs. bloated and slow)

---

## Channel Strategy

### Primary channels (self-hosting community)

- r/selfhosted, r/homelab (core community, discovery)
- awesome-selfhosted, selfh.st, noted.lol (directory listings)
- Mastodon / Fediverse (strong self-host audience overlap)
- Bluesky (growing tech community)
- YouTube homelab channels

### SEO targets

- "self-hosted Todoist alternative"
- "open source task manager"
- "best homelab apps"
- "Todoist alternative open source"
- "self-hosted project management"
- "open source task manager SSO" (enterprise layer)
- "self-hosted project management GDPR" (enterprise layer)
- "Jira alternative self-hosted small team" (enterprise layer)

### B2B / enterprise channels

- EU software directories (EUalternative.eu, souverainete-numerique.eu)
- German/European tech media (Heise, Golem, t3n)
- LinkedIn (for enterprise/SME content specifically)
- FOSDEM, Open Source Summit Europe

### Brand-building channels

- Newsletter (build-in-public updates)
- Indie Hackers, Hacker News
- Podcasts (indie hacker / open source guests)

---

## Website Implications

The website needs two paths for two audiences:

**Home page / features page:** Speaks to the individual self-hoster. Leads with Todoist alternative positioning (Layer 1). Shows the product working for personal tasks. The growth story (Layer 2) appears naturally when describing team features. Does NOT lead with enterprise language.

**Enterprise page:** Speaks to the IT lead or founder evaluating tools for their company. Leads with Layer 3: compliance, SSO, audit logs, support SLA, data residency, DPA. Shows community size as social proof. Includes the "Bring Vikunja to Work" framing. Different buyer, different conversation.

---

## Recommendation Summary

Lead with **The Todoist Alternative You Actually Own** everywhere. It captures the highest-intent search traffic, speaks to the audience Vikunja already has (self-hosters), and naturally incorporates the growth story and enterprise differentiation as layers rather than separate pitches.

The enterprise self-hosted tier changes the business model but should not change the front door. Home-labbers discover Vikunja through the Todoist alternative angle. Some of them bring it to work. The enterprise features are there when they need them -- not as the first thing they see.

Support with **The Bootstrapped Builder's Journal** for community building, **Privacy-First / EU-Made** for European B2B and directories, and **The Flexible Workhorse** for visual content.
