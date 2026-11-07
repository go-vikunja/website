---
name: regenerate-screenshots
description: Retake the website's Vikunja screenshots (help pages, homepage carousel, features page, Flathub) against a given Vikunja release, visually verify every image against the previous version, and fix the specs whose screenshots broke. Use when asked to regenerate, retake, refresh or update screenshots, e.g. for a new Vikunja release.
---

# Regenerate and verify screenshots

The specs live in `scripts/screenshots/` (Playwright, light and dark project). A passing run proves nothing: specs can capture the wrong element, an empty state or a half-faded popup and still pass. Every image gets looked at.

## 1. Test instance

Use `scripts/screenshots/docker-compose.yml` (Vikunja + Postgres, testing token, importers with dummy credentials, optional Unsplash). Never point the specs at a real instance: every test wipes the tables.

- Check the release image exists: `docker pull vikunja/vikunja:<version>`.
- Something else often runs on `3456`. Pick a free port and leave the other instance alone.
- The Unsplash key is in `~/.unsplash-key`. Pass it via env; never print it, commit it or echo it.

```bash
cd scripts/screenshots
UNSPLASH_ACCESS_TOKEN=$(tr -d '[:space:]' < ~/.unsplash-key) VIKUNJA_VERSION=<version> VIKUNJA_PORT=<port> \
  docker compose -p vikunja-screenshots up -d --wait
curl -s localhost:<port>/api/v1/info | jq -c '{version, available_migrators, enabled_background_providers}'
```

All later commands need `BASE_URL=http://localhost:<port> API_URL=http://localhost:<port>/api/v1/`.

## 2. Install and run

```bash
pnpm --ignore-workspace install --frozen-lockfile
pnpm --ignore-workspace exec playwright install chromium
```

If pnpm's `minimumReleaseAge` rejects a freshly bumped lockfile entry, ask the user before bypassing it.

Run each theme on its own, in the background with a long timeout (a theme takes ~10 min). Runs share one database, so never run two at once.

```bash
pnpm --ignore-workspace exec playwright test --project=screenshots-light > /tmp/shots-light.log 2>&1
pnpm --ignore-workspace exec playwright test --project=screenshots-dark > /tmp/shots-dark.log 2>&1
npx -y tsx copy-flathub.ts
```

## 3. Verify every image

Extract the previous images to compare against (light only is enough to review; fix both):

```bash
mkdir -p /tmp/shots-old /tmp/shots-new
for f in $(git ls-files 'src/assets/images/help/*.png' 'src/assets/images/vikunja/*.png' | grep -v -- '-dark.png'); do
  n=$(echo $f | sed 's#src/assets/images/##; s#/#__#g')
  git show origin/main:$f | git lfs smudge > /tmp/shots-old/$n 2>/dev/null
  cp $f /tmp/shots-new/$n
done
```

Split the file list in three and fan out three reviewer subagents in parallel with the prompt in [reviewer-prompt.md](reviewer-prompt.md), using `model: sonnet`. Then look at every flagged image yourself before acting. Also check the dark variant of anything you change.

A reviewer's misses never get a second look, so don't go below Sonnet for the full review. Re-checking a few already fixed images, with the specific problem named in the prompt, can use `model: haiku`.

Separate new regressions from problems the old image already had. Fix regressions; list pre-existing issues for the user.

## 4. Fix the broken specs

For anything you can't see from the image, probe the live DOM with a throwaway spec (`specs/zz-probe.spec.ts`, deleted afterwards) that logs ancestors, classes, computed styles or requests. Don't guess selectors.

Common breakages and fixes:

| Symptom | Cause | Fix |
|---|---|---|
| Whole page or wrong area captured | Selector no longer matches; spec silently fell back | Role- or text-based locator, replace the fallback with `expect(...).toBeVisible()` |
| Input empty | Field became a different component (e.g. tiptap editor instead of `<input>`) | Type into the real element |
| Dropdown missing | Native `<select>` popups never render headless | Show the chosen value instead |
| Content cut at the bottom | Element taller than the viewport; locator clips are limited to it | `test.use({viewport})` or `page.setViewportSize` before `goto` |
| Huge blank area | Element stretches to viewport height | Explicit `clip` ending at its last child |
| Slivers of neighbouring UI | Default 20px padding | `padding: 0` or an explicit `clip` |
| Translucent popup | Captured mid-transition | Already handled: fixture waits for animations |
| Stray tooltip | Mouse rests on an avatar or label | Hide `.v-popper--theme-tooltip` via `addStyleTag` or move the mouse away |
| Empty list, missing labels/avatars/sidebar entries | Data not seeded | Add it to the base dataset, or as a spec extra |
| Search results incomplete | Debounced search not finished | Wait for a specific result |
| Feature shows nothing (importers, Unsplash) | Server not configured | Add env to `docker-compose.yml` |
| Feature list changed upstream (more shortcuts, events) | Release changed the UI | Re-crop; ask the user if the screenshot is still worth keeping |

After fixing, rerun only the touched specs (both themes) and look at the images again.

## Data rules

- Before every test the fixture wipes all tables in `RESET_TABLES` and seeds `seedBaseData()` (`support/seed-helpers.ts`). Specs read it via the `base` fixture.
- Specs add extras with `truncate = false` and ids far from the base data (100+). Never truncate a base table from a spec; that is how screenshots drifted apart before.
- A spec that needs a new table seeded: add the table to `RESET_TABLES`.
- Use real API calls (with `userToken`) for things the server derives, like notifications or bucket limits.

## Gotchas

- `screenshot` shadows Playwright's built-in worker-scoped `screenshot` option, so that fixture can't depend on test fixtures like `currentUser`. A run with that mistake lists 0 tests.
- The fixture pins the dashboard greeting to `Hi <name>!` (it otherwise rotates by date, time and account age). Don't fake the clock; relative dates would drift against server timestamps.
- SQLite locks under async notification writes. Stay on Postgres.
- Seeded rows with explicit ids can collide with ids from real API uploads. Seed attachment metadata with high ids.
- `locator.filter({has})` matches descendants of the outer element only.
- Share link URLs show the test instance's port; that's expected.

## 5. Commit and report

Commits stay small: one per spec fix (with the reason in the body), images in separate `docs(screenshots): ...` commits. Don't amend.

Report what was regenerated, what was fixed and why, pre-existing issues left alone, and anything that looks like a Vikunja bug. Verify suspected bugs on clean data before offering to file them on go-vikunja/vikunja. Leave the compose instance running and tell the user; tear it down with `docker compose -p vikunja-screenshots down` when they're done.
