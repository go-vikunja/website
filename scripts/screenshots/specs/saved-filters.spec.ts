import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {SavedFilterFactory} from '../factories/saved_filter'

test.describe('Saved filters screenshots', () => {
  test('Saved filter creation form', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await page.goto('/filters/new')
    await page.waitForLoadState('networkidle')

    // Focus on the form card
    const card = page.locator('.card').first()
    if (await card.isVisible()) {
      await screenshot('saved-filters-create-form', card)
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('saved-filters-create-form', content)
    }
  })

  test('Saved filter in sidebar', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await SavedFilterFactory.create(1, {
      title: 'My Open Tasks',
      filters: '{"done":false}',
      owner_id: 1,
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Capture the sidebar area showing the filter alongside projects
    const menuList = page.locator('.menu-list').first()
    if (await menuList.isVisible()) {
      await screenshot('saved-filters-sidebar', menuList)
    } else {
      const sidebar = page.locator('.menu-container, .navigation, [data-cy="navigation"]').first()
      await screenshot('saved-filters-sidebar', sidebar)
    }
  })

  test('Three-dot menu with Edit option', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await SavedFilterFactory.create(1, {
      title: 'My Open Tasks',
      filters: '{"done":false}',
      owner_id: 1,
    })

    // Navigate to the filter (saved filters appear as pseudo-projects)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find the filter in the sidebar and right-click or find its menu
    const filterLink = page.locator('.menu-list').getByText('My Open Tasks').first()
    if (await filterLink.isVisible()) {
      await filterLink.hover()
      await page.waitForTimeout(200)

      // Click the three-dot menu
      const menuButton = filterLink.locator('..').locator('.dropdown-trigger, .options-button').first()
      if (await menuButton.isVisible()) {
        await menuButton.click()
        await page.waitForTimeout(200)
      }
    }

    // Capture the context menu
    const dropdown = page.locator('.dropdown:has(.dropdown-menu)').first()
    if (await dropdown.isVisible()) {
      await screenshot('saved-filters-edit-menu', dropdown)
    } else {
      // Fallback: capture the sidebar area showing the filter
      const sidebar = page.locator('.menu-container, .navigation').first()
      await screenshot('saved-filters-edit-menu', sidebar)
    }
  })
})
