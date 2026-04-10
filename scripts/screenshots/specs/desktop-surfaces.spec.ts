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
    // The real Electron quick-entry window starts at 680x56 (see
    // QUICK_ENTRY_COLLAPSED_HEIGHT in desktop/main.js) and then resizes to
    // fit the content via a ResizeObserver on the .card.quick-actions
    // element (see QuickActions.vue → window.quickEntry?.resize). In
    // Playwright there's no IPC bridge, so we start with a slightly taller
    // viewport, let the content render, measure the natural height of the
    // .action-input row and then shrink the viewport to match.
    await page.setViewportSize({width: 680, height: 400})
    await page.goto('/?mode=quick-add')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    const overlay = page.locator('.card.quick-actions').first()
    await expect(overlay).toBeVisible()

    // Type a task with Quick Add Magic syntax. Use keyboard events so the
    // input's @keyup handlers fire (input.fill() would bypass them).
    const input = page.locator('.card.quick-actions .action-input input.input').first()
    await expect(input).toBeVisible()
    await input.click()
    await page.keyboard.type('Buy groceries tomorrow !2', {delay: 30})
    await page.waitForTimeout(400)

    // Measure the natural content height (matches what Electron's
    // ResizeObserver would send back to resize the BrowserWindow).
    const contentHeight = await page.evaluate(() => {
      const el = document.querySelector('.card.quick-actions .action-input') as HTMLElement | null
      return el?.scrollHeight ?? 60
    })

    // Shrink the viewport to the natural content height (+ a small margin
    // for the card's own padding) so the card is no longer stretched by
    // the outer modal container.
    await page.setViewportSize({width: 680, height: contentHeight + 12})
    await page.waitForTimeout(300)

    // Capture as a transparent PNG. The real Electron window is frameless
    // and transparent, so omitBackground matches what the user actually
    // sees and lets the screenshot sit cleanly on any help-page background.
    await screenshot('desktop-quick-entry', overlay, {
      padding: 0,
      omitBackground: true,
    })
  })
})
