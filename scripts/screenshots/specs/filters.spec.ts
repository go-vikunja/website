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

    // Capture the filter popup/modal card
    const filterCard = page.locator('.card.filters, .card:has(.filter-input), .card:has(.filter-editor)').first()
    if (await filterCard.isVisible()) {
      await screenshot('filters-editor-autocomplete', filterCard)
    } else {
      const filterPopup = page.locator('.filter-popup, .modal-content .card, .filters').first()
      await screenshot('filters-editor-autocomplete', filterPopup.isVisible() ? filterPopup : page)
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
