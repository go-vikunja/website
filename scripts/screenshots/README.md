# Screenshot Automation

Automated screenshot capture for the Vikunja website using Playwright.

## Prerequisites

- Vikunja backend running on `:3456` with testing token enabled:
  ```yaml
  service:
    testingtoken: averyLongSecretToSe33dtheDB
    interface: ":3456"
  ```
- Vikunja frontend served on `:4173` (e.g. `pnpm build && pnpm preview` or `pnpm dev`)

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
3. Use `createPopulatedProject()` from `support/seed-helpers.ts` to seed realistic data
4. Pass `{dir: 'your/subdir'}` to `screenshot()` for non-help output directories
5. Use locator targets for cropped shots of specific UI elements
6. Use `page.screenshot({ clip })` via the options parameter for custom-cropped areas
7. Run the spec to verify the screenshot looks correct
