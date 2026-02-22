# User Guide Help Pages Design

## Goal

Replace the current "Usage" docs section with a "User Guide" section aimed at end users (both Vikunja Cloud and self-hosted). The current usage docs are mostly API/technical-focused. The new section adds end-user UI documentation so we can point people to specific pages when they ask questions.

## Section Rename

- Current: **Usage** (`src/content/docs/usage/`)
- New: **User Guide**

The sidebar group name changes. Setup and Development sections remain untouched.

## Page Overview

### New Pages (10)

| Page | Slug | Description |
|---|---|---|
| Dashboard | `dashboard` | Home screen, upcoming tasks, adding tasks |
| Projects | `projects` | Creating, editing, sub-projects, archiving, duplicating, backgrounds |
| Tasks | `tasks` | Task detail view, all task attributes, comments, editor |
| Dates & Reminders | `dates-and-reminders` | Due dates, start/end, reminders, repeating |
| Views | `views` | List, Gantt, Table, Kanban, configuring views |
| Labels | `labels` | Creating, editing, browsing by label |
| Sharing & Teams | `sharing-and-teams` | Users, teams, link shares, permissions |
| Search & Navigation | `search-and-navigation` | Global search, keyboard shortcuts, notifications |
| Settings | `settings` | Full user settings walkthrough |
| Import & Export | `import-and-export` | Importing from other tools, exporting data |

### Moved/Renamed Pages (11)

These existing pages move into the User Guide section as-is (unless noted):

| Page | Current Slug | Change |
|---|---|---|
| Quick Add Magic | `quick-add-magic` | As-is |
| Filters | `filters` | As-is |
| CalDAV | `caldav` | As-is |
| Webhooks | `webhooks` | As-is |
| Permissions | `rights` → `permissions` | Rename from "rights" to "permissions", keep API-focused |
| Task Relations | `task-relation-kinds` | As-is, also covered in new Tasks page |
| API | `api` | As-is |
| CLI | `cli` | As-is |
| Integrations | `integrations` | As-is |
| n8n | `n8n` | As-is |
| Errors | `errors` | As-is |

## Content Outlines

### 1. Dashboard

- What you see after logging in: greeting, quick-add input, upcoming tasks
- Upcoming tasks: all tasks across all projects, sorted by due date (overdue first)
- Adding a task from the homepage goes to your default inbox project
- Customizing the dashboard filter (only see certain tasks instead of everything)
- Recently viewed projects section
- Link to Quick Add Magic docs for the input syntax

### 2. Projects

- What a project is (container for tasks)
- Default inbox project
- Creating a project (from sidebar, from project overview)
- Project settings: title, parent project, description, identifier (prefix for task numbers), color
- Sub-projects: nesting, moving via drag & drop in sidebar or via parent project setting
- Background images: upload custom, or search Unsplash (instance-dependent)
- Archiving: what it does (read-only, hidden from default view)
- Duplicating: what gets copied (tasks, views, sub-projects)
- Favoriting: star icon, appears at top of sidebar
- Deleting a project
- Project context menu (three dots) is where most of these options live
- Brief mention + link to: Sharing, Views, Webhooks

### 3. Tasks

- Opening a task (click from any view)
- Editing title (click on it) and description (rich text editor)
- Editor capabilities: headings, bold/italic/underline/strikethrough, code, file uploads
- Marking as done
- Subscribing (get notifications on changes/comments)
- Favoriting
- Priority (1-5)
- Progress percentage
- Color (used in Kanban/Gantt)
- Assignees (must have project access)
- Attachments (file uploads)
- Relations (link to Task Relations reference for the full list)
- Moving a task to another project (via detail view or drag & drop)
- Comments: same editor as description, mentioning users with @, notification on mention, sorting order (oldest/newest first)
- Checklists in description: checkbox list items, progress shown in list view

### 4. Dates & Reminders

- Due date: what it means, when a task becomes overdue
- Start & end date: defines the time range for working on the task, primarily used in Gantt view
- Reminders: absolute (specific date/time) and relative (e.g. 1 hour before due date)
- Reminder delivery: email notifications (must be enabled in settings)
- Repeating tasks: every day, every X days/weeks/months, specific weekday patterns (every 2 weeks on Tuesday, first Tuesday of the month, etc.)
- Note that Quick Add Magic can set all of these inline when creating a task

### 5. Views

- What views are: per-project display configurations
- Default views: List, Gantt, Table, Kanban (created with every project)
- Switching between views
- Creating custom views: title, type, optional filter
- Editing and deleting views, reordering with drag & drop
- **List view**: all tasks in a flat list, drag & drop to reorder, hover popup with summary, done tasks hidden by default
- **Table view**: spreadsheet-like, configurable columns (choose which task attributes to show)
- **Gantt view**: tasks on timeline based on start/end date, drag to adjust dates, date range picker, option to show tasks without dates, create tasks from the view
- **Kanban view**: buckets (columns), drag tasks between buckets, creating new buckets, collapsing buckets, bucket limits (WIP limits), done-bucket (auto-marks tasks done), default bucket (where new tasks land), cover images on cards (set from task attachments), task card details (color, due date, comments, labels)
- Per-view filters: each view can have its own filter, link to Filters reference
- Saved Filters vs Views: saved filters are personal cross-project queries in sidebar, views are per-project

### 6. Labels

- What labels are: tags/markers for categorization
- Creating labels: from label overview page or inline when adding to a task
- Label properties: title, color, description
- Editing and deleting labels
- Browsing by label: click a label in the overview to see all tasks with that label
- Labels work across projects
- Can be added via Quick Add Magic (`*labelname`)

### 7. Sharing & Teams

- Sharing a project: via three-dot menu on project title
- Sharing with users: search by username (or name/email if the other user enabled it in privacy settings)
- Sharing with teams: any team you're a member of
- Permission levels: Read (view only), Read & Write (edit tasks), Admin (manage sharing settings)
- Link shares: generate a link, no account needed; optional name (shown on comments), optional password
- Teams: creating a team, adding/removing members, team admin role (can manage members), team name
- Brief mention that permissions are also available via API (link to Permissions reference)

### 8. Search & Navigation

- Global search: Ctrl+K / Cmd+K, or click the search icon
- What you can search: tasks and projects across everything
- Search results: grouped by projects and tasks, navigate with arrow keys + Enter
- Quick actions from search: create a new task, project, or team
- Combining search with labels and project names for scoped results
- Keyboard shortcuts: reference popup accessible from bottom-right icon, shortcuts are context-dependent (some only in task detail view)
- Notifications: bell icon top-right, triggered by subscriptions, reminders, and @mentions

### 9. Settings

- Accessing settings: top-right username menu
- General: name (may be read-only with external auth), default project, default view (list/gantt/table/kanban), minimum priority filter, email reminders + overdue summary (with time picker), language, timezone, week start day, date format, color scheme (system/light/dark), Quick Add Magic mode
- Privacy: discoverability by name search, discoverability by email
- Password & email: updating (disabled with external auth like Vikunja Cloud)
- Avatar: initials, default, Gravatar, marble (color gradients), custom upload
- Data export: ZIP with all projects/tasks/attachments, requires password confirmation
- API tokens: creating tokens with specific permissions, token shown only once, link to API docs
- Account deletion (may be disabled with external auth)

### 10. Import & Export

- Import sources: Vikunja export, TickTick, Todoist, Trello, Microsoft To Do
- How to import: settings page, select source, follow the steps
- Export: download all data as ZIP (projects, tasks, attachments)
- Re-importing a Vikunja export

## Implementation Notes

### Directory Structure

All pages live in `src/content/docs/usage/` (the directory name stays, only the sidebar group label changes). New pages are added as `.mdoc` files alongside existing ones.

### Sidebar Group Rename

The sidebar currently groups pages by directory name. The label "Usage" needs to change to "User Guide" in whatever config controls sidebar group names.

### Cross-linking

New pages should link to existing reference pages where relevant:
- Dashboard, Tasks → Quick Add Magic
- Views → Filters
- Tasks → Task Relations
- Sharing & Teams → Permissions
- Projects → Webhooks, Sharing, Views
- Settings → CalDAV, API
- Dates & Reminders → Quick Add Magic

### Source Material

The transcript in `explainer-transcript.txt` is the authoritative source for all new pages. When writing new pages, the transcript content is mandatory to follow -- it defines what features exist, how they work, and what details to cover. The content outlines above are derived from it, but when in doubt, defer to the transcript.

### Tone

- End-user focused, not API-focused
- Describe UI actions ("click the three-dot menu", "drag the task to another bucket")
- Avoid technical jargon unless necessary
- When mentioning something that differs between Cloud and self-hosted, note it explicitly (e.g. "this may be disabled if you're using Vikunja Cloud")

### `rights.mdoc` Rename

Rename `rights.mdoc` to `permissions.mdoc`, update slug to `permissions`, update title to "Permissions". Keep content API-focused. This is a separate change from the new pages.
