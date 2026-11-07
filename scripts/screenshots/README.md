# Screenshot Automation

Automated screenshot capture for the Vikunja website using Playwright.

## Prerequisites

Start the disposable test instance from `docker-compose.yml`. It serves API and frontend on one port:

```bash
cd scripts/screenshots
UNSPLASH_ACCESS_TOKEN=$(cat ~/.unsplash-key) docker compose up -d
export BASE_URL=http://localhost:3456 API_URL=http://localhost:3456/api/v1/
```

- Set `VIKUNJA_PORT` if `3456` is taken, and adjust `BASE_URL`/`API_URL` to match.
- `UNSPLASH_ACCESS_TOKEN` is optional, but without it the background picker screenshot is empty.
- Before every test, all tables are wiped and the same base dataset is seeded (`seedBaseData()` in `support/seed-helpers.ts`): Lisa plus three teammates, the Office Move, Team Retreat Planning and Personal projects with tasks, labels, assignees, comments, an attachment, kanban buckets and the "My Open Tasks" saved filter. Specs get it through the `base` fixture and only add extras on top, without truncating.

## Usage

```bash
# Install dependencies
pnpm install

# Run all screenshot specs
pnpm screenshots

# Run a specific spec
pnpm screenshots -- specs/dashboard.spec.ts

# Run in headed mode (see the browser)
pnpm screenshots:headed

# Run with Playwright inspector for debugging
pnpm screenshots:debug
```

## Spec Files

### Help page specs (`specs/*.spec.ts`)

Generate screenshots for the end-user help documentation. Output: `src/assets/images/help/`

### Homepage carousel (`specs/homepage-carousel.spec.ts`)

Generates 8 full-page (1280×900) screenshots used in the homepage image carousel. Output: `src/assets/images/vikunja/`

| File | What it shows |
|------|---------------|
| `01-task-overview.png` | Dashboard with recently viewed projects + current tasks |
| `02-task-list.png` | List view of project |
| `03-task-gantt.png` | Gantt chart view |
| `04-task-table.png` | Table view |
| `05-task-kanban.png` | Kanban board with 3 buckets |
| `06-task-detail.png` | Task detail with description and embedded image |
| `07-quick-add.png` | Ctrl+K quick-add/search overlay |
| `08-task-kanban-background.png` | Kanban board with project background image |

### Features page (`specs/features-page.spec.ts`)

Generates 5 cropped content-area screenshots for the features page. Output: `src/assets/images/vikunja/features/`

| File | What it shows |
|------|---------------|
| `task.png` | Task detail — title, breadcrumb, description, embedded image |
| `list.png` | List view — task list with quick-add input, labels, assignees |
| `gantt.png` | Gantt chart — timeline area |
| `kanban.png` | Kanban board — buckets with task cards |
| `table.png` | Table view — sortable columns |

### Flathub images

After all specs run, `copy-flathub.ts` copies select homepage carousel images to `public/flathub-images/` for the Flathub app listing.

## Output Directories

The `screenshot` fixture accepts a `dir` option to control the output subdirectory under `src/assets/images/`:

```ts
await screenshot('my-shot', page, {dir: 'vikunja'})       // → src/assets/images/vikunja/my-shot.png
await screenshot('my-shot', page, {dir: 'vikunja/features'}) // → src/assets/images/vikunja/features/my-shot.png
await screenshot('my-shot', page)                          // → src/assets/images/help/my-shot.png (default)
```

## Test Image Assets

Two test images are stored in `support/` for use in specs that need task attachments or project backgrounds:

- `test-image.jpg` — Used as an inline task attachment in task detail screenshots
- `test-background.jpg` — Used as a project background in the kanban background screenshot

To replace them, drop in new JPEG files with the same filenames and re-run the specs.

## Adding New Screenshots

1. Create a new spec file in `specs/` (or add to an existing one)
2. Use the `test` and `screenshot` fixtures from `support/fixtures.ts`
3. Use the `base` fixture for data; seed extras with `truncate = false` and ids that don't clash with the base dataset
4. Pass `{dir: 'your/subdir'}` to `screenshot()` for non-help output directories
5. Use locator targets for cropped shots of specific UI elements
6. Use `page.screenshot({ clip })` via the options parameter for custom-cropped areas
7. Run the spec to verify the screenshot looks correct

## Vikunja 2.8.0 help screenshots

`trash.spec.ts` captures the task and project trash, expanded sub-projects,
task deletion undo, the deleted-task notice, and project deletion and empty-trash
confirmations. `linked-accounts.spec.ts` captures linked accounts settings and
the provider account confirmation. Both generate light and dark variants.

Run against a disposable **Vikunja 2.8.0** instance with the testing token enabled.
The factories truncate tables; use a separate database from your normal instance.
Set `VIKUNJA_RATELIMIT_NOAUTHLIMIT=1000` on that test instance to allow repeated
capture runs. The release binary includes the frontend, so it can serve both URLs:

```bash
cd scripts/screenshots
pnpm --ignore-workspace install --frozen-lockfile
pnpm --ignore-workspace exec playwright install chromium
BASE_URL=http://localhost:3456 API_URL=http://localhost:3456/api/v1/ \
  pnpm --ignore-workspace exec playwright test specs/trash.spec.ts specs/linked-accounts.spec.ts
```

The linked-accounts spec supplies sample provider configuration, linked identity,
and identity preview responses, and redirects the provider authorization back to
Vikunja. It renders the real settings and confirmation UI without an external
identity provider. Trash screenshots use the real API and seeded data.

The other help changes in 2.8.0 (shortcuts, permissions, natural-language dates,
and webhook events) are adequately explained by their text and existing images.
