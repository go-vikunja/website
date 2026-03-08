import {test, expect} from '../support/fixtures'

test.describe('CalDAV screenshots', () => {
  test('CalDAV connection details', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/caldav')
    await page.waitForLoadState('networkidle')

    await screenshot('caldav-connection-details', page)
  })
})
