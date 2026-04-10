import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test.describe('Filters screenshots', () => {
  test('Filter editor with autocomplete', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withLabels: true})

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')
    // Give the Vue app time to finish hydration/reactive setup before
    // interacting — without this the Filters button click is flaky.
    await page.waitForTimeout(1500)

    // Open the filter popup (modal) via the Filters button in the project header
    const filterButton = page.locator('.filter-container button').filter({hasText: /^Filters?$/i}).first()
    await filterButton.click()

    // Wait for the filter modal card to appear
    const filterCard = page.locator('.card.filters').first()
    await expect(filterCard).toBeVisible()

    // The filter input is a ProseMirror contenteditable (tiptap), not an <input>
    const filterInput = filterCard.locator('.filter-input .ProseMirror[contenteditable="true"]').first()
    await expect(filterInput).toBeVisible()
    await filterInput.click()
    // Type enough to trigger the autocomplete: "labels = u" matches "Urgent"
    await page.keyboard.type('labels = u', {delay: 80})
    await page.waitForTimeout(800)

    // Capture the filter card together with the autocomplete popup
    // (#filter-autocomplete-popup is appended to the parent dialog by
    // FilterAutocomplete.ts).
    const autocompletePopup = page.locator('#filter-autocomplete-popup').first()

    const cardBox = await filterCard.boundingBox()
    const popupBox = await autocompletePopup.boundingBox().catch(() => null)
    if (cardBox && popupBox) {
      const viewport = page.viewportSize()!
      const PAD = 20
      const left = Math.max(0, Math.min(cardBox.x, popupBox.x) - PAD)
      const top = Math.max(0, Math.min(cardBox.y, popupBox.y) - PAD)
      const right = Math.max(cardBox.x + cardBox.width, popupBox.x + popupBox.width) + PAD
      const bottom = Math.max(cardBox.y + cardBox.height, popupBox.y + popupBox.height) + PAD
      await screenshot('filters-editor-autocomplete', page, {
        clip: {
          x: left,
          y: top,
          width: Math.min(viewport.width - left, right - left),
          height: Math.min(viewport.height - top, bottom - top),
        },
      })
    } else {
      await screenshot('filters-editor-autocomplete', filterCard, {padding: 60})
    }
  })

  test('Include nulls toggle', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Open filter panel
    const filterButton = page.locator('[data-cy="filterButton"], .filter-button, button:has-text("Filter")').first()
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.waitForTimeout(300)
    }

    // Look for the include nulls toggle
    const includeNulls = page.locator('text=Include Tasks which don').first()
    if (await includeNulls.isVisible()) {
      await includeNulls.scrollIntoViewIfNeeded()
    }

    const filterCard = page.locator('.card.filters, .card:has(.filter-input), .card:has(.filter-editor)').first()
    if (await filterCard.isVisible()) {
      await screenshot('filters-include-nulls', filterCard)
    } else {
      const filterPopup = page.locator('.filter-popup, .modal-content .card, .filters').first()
      await screenshot('filters-include-nulls', filterPopup.isVisible() ? filterPopup : page)
    }
  })

  test('Active filter applied to view', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withLabels: true})

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Apply a filter
    const filterButton = page.locator('[data-cy="filterButton"], .filter-button, button:has-text("Filter")').first()
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.waitForTimeout(300)

      const filterInput = page.locator('.filter-input input, .filter-editor input, [data-cy="filterInput"]').first()
      if (await filterInput.isVisible()) {
        await filterInput.fill('done = false')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
      }
    }

    const filterCard = page.locator('.card.filters, .card:has(.filter-input), .card:has(.filter-editor)').first()
    if (await filterCard.isVisible()) {
      await screenshot('filters-active', filterCard)
    } else {
      await screenshot('filters-active', page)
    }
  })
})
