import {test, expect} from '../support/fixtures'

test.describe('Webhooks screenshots', () => {
  test('Webhooks settings section', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/webhooks')
    await page.waitForLoadState('networkidle')

    await screenshot('webhooks-settings-section', page)
  })

  test('Webhook creation form', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/webhooks')
    await page.waitForLoadState('networkidle')

    // Click create new webhook button
    const createButton = page.locator('text=Create, text=New Webhook, text=Add Webhook').first()
    if (await createButton.isVisible()) {
      await createButton.click()
      await page.waitForTimeout(300)
    }

    await screenshot('webhooks-create-form', page)
  })
})
