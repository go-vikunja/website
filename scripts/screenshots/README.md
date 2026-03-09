# Help Page Screenshot Automation

Automated screenshot capture for Vikunja help documentation using Playwright.

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

## Output

Screenshots are saved to `src/assets/images/help/` in the website root.

## Adding New Screenshots

1. Create a new spec file in `specs/` (or add to an existing one)
2. Use the `test` and `screenshot` fixtures from `support/fixtures.ts`
3. Use `createPopulatedProject()` from `support/seed-helpers.ts` to seed realistic data
4. Use `element.screenshot()` for cropped shots of specific UI elements
5. Use `page.screenshot({ clip })` for custom-cropped areas
6. Run the spec to verify the screenshot looks correct
