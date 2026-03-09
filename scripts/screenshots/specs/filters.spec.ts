import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test.describe('Filters screenshots', () => {
  test('Filter editor with autocomplete', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withLabels: true})

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Click the filter button
    const filterButton = page.locator('[data-cy="filterButton"], .filter-button, button:has-text("Filter")').first()
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.waitForTimeout(300)

      // Type a partial filter query to trigger autocomplete
      const filterInput = page.locator('.filter-input input, .filter-editor input, [data-cy="filterInput"]').first()
      if (await filterInput.isVisible()) {
        await filterInput.fill('label')
        await page.waitForTimeout(500)
      }
    }

    // Capture the filter popup/modal
    const filterPopup = page.locator('.filter-popup, .modal-container, .filters').first()
    if (await filterPopup.isVisible()) {
      await screenshot('filters-editor-autocomplete', filterPopup)
    } else {
      await screenshot('filters-editor-autocomplete', page)
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

    const filterPopup = page.locator('.filter-popup, .modal-container, .filters').first()
    if (await filterPopup.isVisible()) {
      await screenshot('filters-include-nulls', filterPopup)
    } else {
      await screenshot('filters-include-nulls', page)
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

    await screenshot('filters-active', page)
  })
})
