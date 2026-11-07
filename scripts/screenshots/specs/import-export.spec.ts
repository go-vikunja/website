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

    // Just the services, not the long settings sidebar.
    const content = page.locator('.side-nav-shell .view .content').filter({hasText: 'Import from other services'})
    await expect(content.getByText('Microsoft Todo')).toBeVisible()
    await screenshot('import-export-import-tab', content, {padding: 40})
  })
})
