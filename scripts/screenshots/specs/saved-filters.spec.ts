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

    // Find the saved filter entry in the sidebar and focus on that area
    const filterEntry = page.locator('.menu-list').getByText('My Open Tasks').first()
    if (await filterEntry.isVisible()) {
      // Capture the sidebar area around the filter entry, not the top of the menu
      await screenshot('saved-filters-sidebar', filterEntry, {padding: 80})
    } else {
      // Fallback: capture the whole sidebar
      const sidebar = page.locator('.menu-container, .navigation, [data-cy="navigation"]').first()
      await screenshot('saved-filters-sidebar', sidebar)
    }
  })
})
