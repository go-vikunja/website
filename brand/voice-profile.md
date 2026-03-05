# Vikunja Voice Profile

Last updated: 2026-03-05

## Brand Identity Summary

Vikunja is an open-source, self-hostable to-do / task management app built by a solo founder (Konrad) who writes and communicates as a single person, not a faceless company. The brand voice reflects a bootstrapped, independent project that prioritizes users over investors, privacy over data harvesting, and substance over hype.

---

## Tone Attributes

### Primary Tone: Technically Confident, Personally Warm

Vikunja writes like a knowledgeable developer sharing updates with peers. The voice is direct, competent, and unadorned -- never puffed up with marketing buzzwords, never stiff or corporate.

**Spectrum positions:**

| Dimension | Position | Evidence |
|-----------|----------|----------|
| Formal <-> Casual | Leans casual | "Long time no see!", "Let's dive in!", contractions throughout |
| Serious <-> Playful | Mostly serious, with dry wit | "Plan your projects with the elegance of a sloth on a sunny day", "How hard could hosting a Git server be?" |
| Technical <-> Accessible | Technical but approachable | Explains CVEs and breaking changes clearly; never dumbs down but also never gatekeeps |
| Humble <-> Assertive | Honest and self-aware | "I still would not consider it 'done'", acknowledges things that "don't work quite right" |
| Corporate <-> Personal | Distinctly personal | First-person singular ("I'm proud to announce", "I built Vikunja because"), names the founder |

### Secondary Tone: Principled Pragmatist

The voice takes clear stances on privacy, open source, and business ethics, but does so without preaching. Arguments are grounded in practical reasoning rather than ideology.

**Example:** "Most free products either have limited functionality to nag you to buy a premium version that is actually usable or just sell your data to advertising companies. In those cases, you're not the user, you're the product. We don't do any of this."

---

## Voice Patterns

### Signature Phrases and Constructions

**Recurring openers for release posts:**
- "I'm proud to announce Vikunja [version]!"
- "Just [time period] after the [previous] release, we're back with [version]!"
- "Barely two weeks after [link], we're back with [version]!"
- "Long time no see!"

**Recurring closers for release posts:**
- "If you have any questions about this release, please reach out either in the community forum, Bluesky, or Mastodon."
- "Thank you for using Vikunja, and I look forward to bringing you more enhancements in future updates!"
- "Please tell me what you think of this release"

**Transition phrases:**
- "Let's dive in!"
- "Let's dive right in!"
- "Read on to learn more!"
- "Here's what you need to know"
- "Check out [the docs] to learn more"

**"New to Vikunja?" boilerplate** (used in most release posts):
> "Vikunja is the open-source, self-hostable to-do app. It lets you organize all kinds of things, from your shopping list to a multi-month project with multiple team members. Different ways to view, filter and share your tasks make this a breeze."

### Sentence Patterns

1. **Short declarative sentences followed by elaboration.** The voice leads with a crisp statement, then explains.
   - "The Gantt chart got a major overhaul. It looks almost exactly like the old one but should work a lot more reliably."
   - "We built Vikunja with speed in mind -- every interaction takes less than 100ms. No more loading spinners."

2. **Direct address using "you" and "your."** The reader is always spoken to, never spoken about.
   - "You can show your tasks in the classic list view"
   - "Remember that thing you have to do every week but can't get the hang of it?"
   - "If that's your jam, great!"

3. **Parenthetical asides and conversational interjections.** Natural, human-sounding interruptions.
   - "(I'm sure I forgot some)"
   - "(you know how well estimates work in software development)"
   - "(As long as you're allowed to create lists in the other namespace, that is)"
   - "Now all of you night owls won't feel like a sun blaring in your face at night."

4. **Imperatives that empower, not command.** Instructions are framed as invitations.
   - "Check it out in the project settings!"
   - "Go over to the repo, grab a release and take it for a spin!"
   - "Check out the examples and explanations in Vikunja and play with it!"

5. **Quantitative specificity.** Numbers and commit counts are used naturally, lending credibility without bragging.
   - "This release contains a total of 188 commits, of which 30 have been dependency updates."
   - "This release contains a whopping 2,652 commits since the last stable release."
   - "With just 15 commits, this is a very small release"

### Paragraph Style

- Paragraphs are short (2-4 sentences typically).
- Release posts use a consistent structure: intro, new-to-vikunja blurb (for major releases), highlights with H3 subheads, how-to-upgrade, closing.
- Technical details are explained through concrete examples rather than abstract descriptions.
- Lists (bullet points) are used liberally for features and changes.

---

## Vocabulary

### Words and Phrases Vikunja Uses

| Category | Examples |
|----------|----------|
| Product descriptors | "open-source", "self-hostable", "fluffy", "the to-do app" |
| Value language | "privacy", "your data under your control", "openly licensed", "bootstrapped" |
| Feature language | "tasks", "projects", "views" (list/kantt/table/kanban), "Quick Add Magic", "labels", "filters", "buckets" |
| Action words | "organize", "collaborate", "share", "view", "customize", "upgrade", "check out" |
| Enthusiasm markers | "whopping", "thrilled", "proud", "great", "a breeze" |
| Hedging/honesty | "still would not consider it done", "room for improvement", "don't work quite right", "admittedly" |
| Community language | "contributing", "shoutout", "thanks to", "help is appreciated" |
| EU identity | "Made and hosted in the EU" |

### Words and Phrases Vikunja Avoids

| Category | Why |
|----------|-----|
| "Revolutionary", "disruptive", "game-changing" | Too hyperbolic, too startup-culture |
| "Leverage", "synergy", "ecosystem" (in marketing context) | Corporate jargon |
| "We" as anonymous corporate entity | Uses "I" (Konrad) or "we" only when genuinely meaning the project/community |
| "Users" in an objectifying sense | Prefers "you" direct address |
| Exclamation-heavy sales copy | Enthusiasm is natural, not forced; exclamation marks are used sparingly and authentically |
| Fear-based urgency | "Act now!", "Don't miss out!" -- never appears |

---

## Content-Type Voice Variations

### Landing Page / Marketing Copy
- More poetic and playful ("Plan your projects with the elegance of a sloth on a sunny day")
- Short, punchy sentences
- Benefit-focused ("Stay organized", "Collaborate with peers", "Use it how you need it")
- Balances whimsy with substance

### Release Blog Posts
- Developer-to-developer tone
- Structured and scannable (H2/H3 headers, bullet lists)
- First person singular from Konrad
- Credits contributors by name with links
- Includes specific commit counts and version numbers
- Honest about the scope of changes ("This release is smaller than the last one and does not have a lot of new, big features")

### Feature Descriptions
- Second person ("you can", "you'll")
- Concrete rather than abstract
- Explains what the feature does, not why it is theoretically important
- Uses rhetorical questions to create relatability ("Know that feeling when you have a dozen things to do but can't decide on what to work next?")

### Security Disclosures
- Serious and precise
- Clear about the severity and impact
- Includes CVE numbers and links to advisories
- Thanks reporters by name
- Direct recommendation to upgrade without inducing panic

### Pricing / Business Copy
- Transparent and principled
- Directly addresses the "why not free?" question
- Anti-VC positioning: "Being completely bootstrapped, the users of the software are the top priority and not some VC"
- Frames paid offering as supporting the project, not buying a product
- "Free 14 day trial. Cancel anytime." -- no pressure

### Editorial / Opinion Pieces (e.g., the GitHub migration post)
- Most personal and reflective
- Shares the reasoning process openly
- Acknowledges counterarguments ("But Microsoft is evil!")
- Uses concrete anecdotes and data (18k spam accounts)
- Self-deprecating when appropriate ("How hard could hosting a Git server be?")

---

## Personality Traits

1. **Builder, not marketer.** Vikunja talks about what it builds, not what it promises to build. Feature descriptions focus on concrete capabilities.

2. **Transparent about imperfections.** The voice acknowledges bugs, limitations, and things that "don't work quite right" rather than pretending everything is polished.

3. **Grateful to contributors.** Almost every release post thanks specific people by name and links to their profiles. Community contributions are highlighted, not buried.

4. **Privacy-principled without being preachy.** Privacy is stated as a value, but the argument is made through action (open source, self-hostable, EU-hosted) rather than moralizing.

5. **Dry humor.** Occasional wit surfaces naturally -- llama imagery, sloth metaphors, parenthetical observations -- but never overshadows substance.

6. **Solo founder energy.** The voice carries the authenticity of one person who built something and is genuinely proud of it. "I built Vikunja because there was no good Open-Source Tool to do what I wanted."

---

## Mascot and Visual Language

- Vikunja (the animal, a South American camelid related to llamas and alpacas) is the mascot
- Llama/alpaca imagery is used throughout (hero images, screenshots with llama photos attached to tasks)
- The word "fluffy" is used as a brand descriptor ("Vikunja, the fluffy, open-source, self-hostable to-do app")
- This whimsical visual identity contrasts with the technical substance, creating a distinctive and memorable brand feel

---

## Do / Don't Quick Reference

### Do

- Write in first person (singular for Konrad's posts, plural when referring to "the project")
- Use contractions naturally (it's, you'll, we're, don't)
- Lead with what the feature does, not why it matters abstractly
- Credit contributors by name
- Be specific with numbers and technical details
- Use "Check out [link] to learn more" for directing readers
- Maintain a consistent release post structure
- Address the reader as "you"
- Acknowledge limitations honestly

### Don't

- Use corporate plural "we" to sound bigger than one person
- Add artificial urgency or scarcity
- Use buzzwords or marketing jargon
- Over-explain things the audience already understands
- Hide behind passive voice ("a decision was made" -- instead: "I decided" or "we decided")
- Use emojis heavily in prose (occasional use in social media is fine; the website copy uses almost none)
- Promise features that don't exist yet without hedging
- Talk down to the reader or assume they don't understand technical concepts
