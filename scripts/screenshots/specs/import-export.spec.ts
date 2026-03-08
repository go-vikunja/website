import {test, expect} from '../support/fixtures'

test.describe('Import/Export screenshots', () => {
  test('Data export section', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/data-export')
    await page.waitForLoadState('networkidle')

    await screenshot('import-export-data-export', page)
  })

  test('Import tab', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/migrate')
    await page.waitForLoadState('networkidle')

    await screenshot('import-export-import-tab', page)
  })
})
