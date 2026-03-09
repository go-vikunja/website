import {test, expect} from '../support/fixtures'

test.describe('CalDAV screenshots', () => {
  test('CalDAV connection details', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/caldav')
    await page.waitForLoadState('networkidle')

    const card = page.locator('.card').first()
    await expect(card).toBeVisible()
    await screenshot('caldav-connection-details', card)
  })
})
