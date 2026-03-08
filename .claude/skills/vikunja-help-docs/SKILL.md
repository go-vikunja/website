---
name: vikunja-help-docs
description: Research a Vikunja feature area in the codebase and update or create end-user help documentation. Use when asked to document a feature, expand help pages, or when a review identifies under-documented areas.
---

# Vikunja Help Documentation Writer

## Overview

Research how a Vikunja feature actually works by reading the frontend and backend source code, then update the help documentation to accurately reflect the feature's behavior. This ensures docs stay grounded in what the code does, not assumptions.

The target reader is a new Vikunja user who is comfortable with computers but not deeply technical. They want to get answers quickly. Optimize for:

- Fast information retrieval
- Plain language
- Minimal jargon
- Clear UI-oriented explanations
- Short paths to likely answers

Do not write help pages as API reference, admin reference, or source-code commentary unless the page is explicitly meant for that audience.

If content is primarily for administrators, developers, API consumers, or self-hosters, it belongs in `src/content/docs`, not `src/content/help`.

## Key Paths

- **Help docs**: `src/content/help/*.mdoc` (in the website repo)
- **Frontend source**: `~/www/vikunja/vikunja/main/frontend/src/`
- **Backend source**: `~/www/vikunja/vikunja/main/pkg/`
- **Changelogs**: `src/content/help/../changelog/` (useful for feature history)

If any of these paths does not exist, ask the user where they are located.

## The Process

### 1. Audit Existing Documentation

Read the help page(s) that cover the feature area. Identify:
- What is already documented
- What is missing or incomplete
- What might be inaccurate
- What slows a user down when scanning for an answer
- What assumes too much prior knowledge
- What uses unnecessary jargon or internal terms
- What should be moved later because it is advanced, technical, or niche

Check for mentions across all help pages, not just the obvious one — features often get referenced in multiple places (e.g., kanban buckets are mentioned in views.mdoc, settings.mdoc, and tasks.mdoc).

While auditing, explicitly review the page from this persona:

- White-collar knowledge worker
- Uses computers daily
- Has tried Vikunja a bit
- Does not know Vikunja deeply
- Does not want fluff or unnecessary technical language

Ask these questions for every page:

- Can the user tell within 10-15 seconds whether this page answers their question?
- Does the opening explain what the feature is in plain language?
- Does the page lead with the practical answer before edge cases and implementation detail?
- Are the headings scannable enough that the user can jump to the right section?
- Are advanced or technical details deferred until after basic usage is clear?
- Are links, anchors, and feature names consistent?

```bash
# Find all mentions of the feature across help docs
grep -ri "feature_name" src/content/help/
```

### 2. Research the Codebase

Use the Explore agent to search the **current** frontend and backend source code. Focus on:

- **Vue components**: What UI elements exist? What options/fields are shown?
- **TypeScript models/interfaces**: What properties does the feature have?
- **Services**: What API operations are available? (create, update, delete, get)
- **Stores**: What business logic exists? (validation, side effects, computed state)
- **Backend models and handlers**: What constraints exist server-side?

Spawn an Explore agent with a detailed prompt listing specific questions about the feature. For example:

```
Search ~/www/vikunja/vikunja/main/frontend for components related to [feature].
What properties exist? What can users create/edit/delete? What validation exists?
What side effects happen (e.g., marking a task as done when moved to a bucket)?
```

Also check changelogs for feature additions that might not be documented yet:

```bash
grep -ri "feature_name" src/content/changelog/
```

### 3. Identify Gaps

Compare what the code supports against what the docs say. Common gaps:

- Features added in later releases that never got documented
- Settings or options that exist in the UI but aren't mentioned in help pages
- Behavioral details (what happens when X? what are the constraints?)
- Cross-references to related settings or features on other help pages
- Openings that start too technically instead of helping the user decide if the page is relevant
- Pages that mix normal-user help with API, admin, or developer material too early
- Missing quick-orientation aids like short summaries, examples, or comparison tables
- Broken anchors, vague wording, or naming inconsistencies that reduce trust and speed

### 4. Ask Clarifying Questions

Before writing, ask the user about anything that is unclear:

- Ambiguous behavior where the code could be interpreted multiple ways
- Features that appear in the code but might be deprecated or behind a flag
- Tone/scope preferences (brief mention vs. detailed subsection)
- Whether to update one page or split content across multiple pages

Keep the questions focused and specific. Present what you found and what you're unsure about.

### 5. Draft the Documentation

Write documentation that follows these conventions (derived from the existing help pages):

#### Structure
- Use `##` for major sections, `###` for subsections, `####` for detailed topics within a subsection
- Lead with a brief plain-language explanation of what the feature is, who it is for, and when to use it
- Put the fastest practical answer near the top
- Use headings that match likely user questions where possible
- Follow with how to use it (UI steps, options, configuration)
- Put advanced details, technical reference, and edge cases later
- If helpful, add a short orientation aid near the top:
  - “Use this when...”
  - “What you can do here”
  - a small comparison table
  - a concrete example

#### Style
- Write in second person ("you can", "click the...")
- Keep sentences short and direct
- Prefer common words over technical terms
- Explain unavoidable jargon in one short sentence before using it
- Cut filler, marketing language, and playful wording that does not help the user act
- Use **bold** for UI element names and option labels
- Use `{% callout type="info" %}` for important notes that don't fit the main flow
- Link to related help pages with relative paths: `[Views](/help/views)`
- Use anchor links for specific sections: `[Kanban view](/help/views#kanban-view)`
- Use `--` for em dashes (Markdoc convention in this project)
- Use colons (not em dashes) in list items to separate the label from the description

#### Content
- Document what the user can do, not how the code works internally
- Prioritize helping the user find information quickly over being exhaustive in the first section
- Mention constraints (e.g., "you cannot delete the last bucket")
- Explain side effects (e.g., "deleting a bucket moves its tasks to the default bucket")
- Note where state is stored if it affects the user (e.g., "saved in your browser" vs. server-side)
- Cross-reference related settings or pages where relevant
- Keep API details, raw protocol terms, internal property names, and admin/security details out of the opening unless essential
- If a page must include advanced material, clearly separate it under a heading like `## Advanced` or another specific label
- Prefer concrete examples when a feature could otherwise feel abstract
- If a topic is mainly admin or developer documentation, move it to `src/content/docs` or document it there instead of expanding `src/content/help`

#### Information Scent
- Make sure the page title and opening match what users are likely searching for
- Prefer consistent names for the same UI area across pages
- Fix broken or misleading in-page links and anchors
- Avoid references like “see below” unless the referenced section is obvious and actually present
- If a feature behaves differently in multiple places, state that difference early

### 6. Update Related Pages

After updating the primary help page, check whether other pages need updates too:

- **settings.mdoc**: If the feature has a user setting, ensure it's documented there
- **permissions.mdoc**: If the feature interacts with permission levels
- Other pages that reference the feature area

### 7. Present Changes for Review

Show the user what you changed with a summary of:
- Which files were modified
- What was added/changed in each
- Any gaps you intentionally left (and why)

Do NOT commit automatically. Let the user review and request adjustments first.

## Key Principles

- **Code is the source of truth**: Always verify behavior against the actual source code, not assumptions or changelogs alone
- **Don't invent features**: Only document what the code actually supports
- **Match existing tone**: Read nearby sections before writing to match the voice
- **Minimal changes**: Expand what's there rather than rewriting entire sections unnecessarily
- **Cross-reference**: Help pages should link to each other where relevant
- **Ask when unsure**: A clarifying question is better than wrong documentation
- **Speed matters**: A new user should be able to find the likely answer quickly without reading the whole page
- **User help first**: End-user help comes before API, admin, or developer reference
- **Put docs in the right place**: Admin, self-hosting, API, and developer-focused content belongs in `src/content/docs`
- **Clarity over completeness in the opening**: Start simple, then go deeper
- **No unnecessary jargon**: If a technical term is not helping the user act, remove it or defer it
- **Consistency builds trust**: Use stable names, working links, and predictable structure across pages
