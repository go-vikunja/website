import {test, expect} from '../support/fixtures'

test.describe('Desktop surface screenshots', () => {
  test('Desktop login picker', async ({page, screenshot}) => {
    // Stub the Electron preload bridge so isDesktopApp() returns true and
    // DesktopLogin.vue mounts. The no-op onOAuthTokens/onOAuthError
    // callables are required because the view's setup dereferences them
    // unconditionally. Also clear any stored API URL so the three-button
    // picker branch renders (hasStoredServer === false).
    await page.addInitScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).vikunjaDesktop = {
        isDesktop: true,
        startOAuthLogin: async () => {},
        onOAuthTokens: () => {},
        onOAuthError: () => {},
        refreshToken: async () => ({
          access_token: '',
          refresh_token: '',
          expires_in: 0,
        }),
        updateQuickEntryShortcut: () => {},
      }
      window.localStorage.removeItem('API_URL')
      window.localStorage.removeItem('token')
    })

    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Make sure the three-button branch is rendered, not the single
    // "Login" button that appears when a server URL is stored.
    const cloudButton = page.getByRole('button', {name: 'Vikunja Cloud'})
    await expect(cloudButton).toBeVisible()

    // Capture the auth card (the NoAuthWrapper content area).
    const card = page.locator('.noauth-full-page .card, .noauth-wrapper .card, main .card').first()
    if (await card.isVisible()) {
      await screenshot('desktop-login-picker', card, {padding: 16})
    } else {
      // Fallback: crop around the three buttons.
      await screenshot('desktop-login-picker', cloudButton, {padding: 120})
    }
  })

  test('Quick-entry window', async ({authenticatedPage: page, screenshot}) => {
    // Match the real Electron quick-entry window dimensions. The frameless
    // BrowserWindow starts at 680x56 and grows as content renders; a bit
    // of extra height keeps the parsed preview and results visible.
    await page.setViewportSize({width: 680, height: 420})

    await page.goto('/?mode=quick-add')
    await page.waitForLoadState('networkidle')

    // The overlay content is rendered inside a teleported modal dialog.
    // The .quick-add-overlay div itself is an empty 0-size element, so
    // target the .card.quick-actions inside the dialog instead.
    const overlay = page.locator('.card.quick-actions').first()
    await expect(overlay).toBeVisible()

    // Type a task with Quick Add Magic so the parsed preview is visible.
    // The input has class "input" but no explicit type attribute.
    const input = page.locator('.card.quick-actions .action-input input.input').first()
    await expect(input).toBeVisible()
    await input.fill('Buy groceries tomorrow !2')
    await page.waitForTimeout(400)

    // Capture the overlay as a transparent PNG. The real Electron window
    // is a frameless, transparent popup, so omitBackground matches what
    // the user actually sees and lets the screenshot sit cleanly on any
    // help-page background.
    await screenshot('desktop-quick-entry', overlay, {
      padding: 8,
      omitBackground: true,
    })
  })
})
