import {test, expect} from '../support/fixtures'

test.describe('Import/Export screenshots', () => {
  test('Data export section', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/data-export')
    await page.waitForLoadState('networkidle')

    const card = page.locator('.card').first()
    await expect(card).toBeVisible()
    await screenshot('import-export-data-export', card)
  })

  test('Import tab', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/migrate')
    await page.waitForLoadState('networkidle')

    const card = page.locator('.card').first()
    if (await card.isVisible()) {
      await screenshot('import-export-import-tab', card)
    } else {
      // Fallback: capture the content area
      const content = page.locator('.app-content').first()
      await screenshot('import-export-import-tab', content)
    }
  })
})
