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

      // Dismiss any overlapping popup (e.g. "How does this work?")
      const dismissPopup = page.locator('.popup .close, .popup button, button:has-text("How does this work?")').first()
      if (await dismissPopup.isVisible()) {
        await dismissPopup.click({force: true})
        await page.waitForTimeout(300)
      }

      // Type a partial filter query to trigger the autocomplete dropdown
      const filterInput = page.locator('.filter-input input, .filter-editor input, [data-cy="filterInput"]').first()
      if (await filterInput.isVisible()) {
        await filterInput.click({force: true})
        await page.keyboard.type('labels in ', {delay: 50})
        await page.waitForTimeout(800)
      }
    }

    // Capture the filter popup/modal card including autocomplete dropdown
    const filterCard = page.locator('.card.filters, .card:has(.filter-input), .card:has(.filter-editor)').first()
    if (await filterCard.isVisible()) {
      // Check if there's an autocomplete dropdown visible — if so, capture both
      const autocomplete = page.locator('.autocomplete-dropdown, .dropdown-menu.is-active, .suggestions, [role="listbox"]').first()
      if (await autocomplete.isVisible()) {
        // Capture a wider area that includes both the filter card and dropdown
        await screenshot('filters-editor-autocomplete', filterCard, {padding: 60})
      } else {
        await screenshot('filters-editor-autocomplete', filterCard)
      }
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
