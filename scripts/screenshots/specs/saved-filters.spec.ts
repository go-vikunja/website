import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {SavedFilterFactory} from '../factories/saved_filter'

test.describe('Saved filters screenshots', () => {
  test('New saved filter button on project overview', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    await screenshot('saved-filters-new-button', page)
  })

  test('Saved filter creation form', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await page.goto('/filters/new')
    await page.waitForLoadState('networkidle')

    await screenshot('saved-filters-create-form', page)
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

    // Capture the sidebar showing the saved filter
    const sidebar = page.locator('.menu-container, .navigation, [data-cy="navigation"]').first()
    if (await sidebar.isVisible()) {
      await screenshot('saved-filters-sidebar', sidebar)
    } else {
      await screenshot('saved-filters-sidebar', page)
    }
  })

  test('Three-dot menu with Edit option', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    const filters = await SavedFilterFactory.create(1, {
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

    await screenshot('saved-filters-edit-menu', page)
  })
})
