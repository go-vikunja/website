import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test.describe('Search and navigation screenshots', () => {
  test('Global search dialog', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open global search with Ctrl+K
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    // Type a search query
    const searchInput = page.locator('.modal-content input, [data-cy="searchInput"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('moving')
      await page.waitForTimeout(500)
    }

    await screenshot('search-global-dialog', page.locator('.modal-container, .quick-actions').first())
  })

  test('Quick actions for creating', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open global search / quick actions
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    // Type a create command prefix
    const searchInput = page.locator('.modal-content input, [data-cy="searchInput"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('new')
      await page.waitForTimeout(500)
    }

    await screenshot('search-quick-actions', page.locator('.modal-container, .quick-actions').first())
  })

  test('Keyboard shortcuts popup', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Try clicking the keyboard shortcuts icon or pressing ?
    const shortcutIcon = page.locator('[data-cy="keyboardShortcuts"], .keyboard-shortcuts-button').first()
    if (await shortcutIcon.isVisible()) {
      await shortcutIcon.click()
    } else {
      await page.keyboard.press('?')
    }
    await page.waitForTimeout(300)

    await screenshot('navigation-keyboard-shortcuts', page.locator('.modal-container, .keyboard-shortcuts').first())
  })

  test('Notifications dropdown', async ({authenticatedPage: page, screenshot}) => {
    await createPopulatedProject()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click the notifications bell
    const bell = page.locator('.notifications .trigger-button').first()
    if (await bell.isVisible()) {
      await bell.click()
      await page.waitForTimeout(300)
    }

    // Capture the notifications container (trigger + dropdown list)
    await screenshot('navigation-notifications', page.locator('.notifications').first())
  })
})
