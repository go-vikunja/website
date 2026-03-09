import {test, expect} from '../support/fixtures'

test.describe('Settings screenshots', () => {
  test('Username dropdown entry point', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click the username dropdown in the top right
    const userMenu = page.locator('.username-dropdown-trigger, [data-cy="userMenu"], .navbar .dropdown-trigger').first()
    if (await userMenu.isVisible()) {
      await userMenu.click()
      await page.waitForTimeout(200)
    }

    // Capture the dropdown menu that appeared
    const dropdownMenu = page.locator('.dropdown-menu .dropdown-content').last()
    if (await dropdownMenu.isVisible()) {
      await screenshot('settings-entry-point', dropdownMenu, {padding: 40})
    } else {
      // Fallback: capture top-right area of page
      await screenshot('settings-entry-point', page, {clip: {x: 900, y: 0, width: 380, height: 300}})
    }
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
