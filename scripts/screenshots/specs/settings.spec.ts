import {test, expect} from '../support/fixtures'

test.describe('Settings screenshots', () => {
  test('Username dropdown entry point', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click the username dropdown in the top right
    const userMenu = page.locator('[data-cy="userMenu"], .user-menu, .navbar .dropdown-trigger').first()
    if (await userMenu.isVisible()) {
      await userMenu.click()
      await page.waitForTimeout(200)
    }

    await screenshot('settings-entry-point', page)
  })

  test('General settings tab', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/general')
    await page.waitForLoadState('networkidle')

    await screenshot('settings-general', page)
  })

  test('API token creation form', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/api-tokens')
    await page.waitForLoadState('networkidle')

    await screenshot('settings-api-tokens', page)
  })

  test('Avatar style options', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/avatar')
    await page.waitForLoadState('networkidle')

    await screenshot('settings-avatar-options', page)
  })

  test('Delete account section', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/deletion')
    await page.waitForLoadState('networkidle')

    await screenshot('settings-delete-account', page)
  })
})
