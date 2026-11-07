import {test, expect} from '../support/fixtures'
import type {Page} from '@playwright/test'
import type {BaseData} from '../support/seed-helpers'

async function openFilters(page: Page, {project, views}: BaseData) {

  await page.goto(`/projects/${project.id}/${views.list.id}`)
  await page.waitForLoadState('networkidle')
  // Without this the Filters button click is flaky.
  await page.waitForTimeout(1500)

  // 2.8.0 adds a focus ring to the editor inside the already
  // highlighted input, which looks like a double focus.
  await page.addStyleTag({content: '.filter-input .ProseMirror-focused { box-shadow: none !important; }'})

  await page.locator('.filter-container button').filter({hasText: /^Filters?$/i}).first().click()
  const filterCard = page.locator('.card.filters').first()
  await expect(filterCard).toBeVisible()

  // Tiptap contenteditable, not an <input>
  const filterInput = filterCard.locator('.filter-input .ProseMirror[contenteditable="true"]').first()
  await expect(filterInput).toBeVisible()

  return {filterCard, filterInput}
}

test.describe('Filters screenshots', () => {
  test('Filter editor with autocomplete', async ({base, authenticatedPage: page, screenshot}) => {
    const {filterCard, filterInput} = await openFilters(page, base)
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

  test('Include nulls toggle', async ({base, authenticatedPage: page, screenshot}) => {
    const {filterCard, filterInput} = await openFilters(page, base)
    await filterInput.blur()
    await expect(filterCard.getByText('Include Tasks which don')).toBeVisible()
    await screenshot('filters-include-nulls', filterCard)
  })

  test('Active filter applied to view', async ({base, authenticatedPage: page, screenshot}) => {
    const {filterCard, filterInput} = await openFilters(page, base)
    await filterInput.click()
    await page.keyboard.type('done = false')
    await filterInput.blur()
    await expect(filterInput).toHaveText('done = false')
    await screenshot('filters-active', filterCard)
  })
})
