import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test.describe('Webhooks screenshots', () => {
  test('Project webhooks settings section', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/settings/webhooks`)
    await page.waitForLoadState('networkidle')

    // Focus on the card
    const card = page.locator('.card').first()
    if (await card.isVisible()) {
      await screenshot('webhooks-settings-section', card)
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('webhooks-settings-section', content)
    }
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

    // Focus on the card
    const card = page.locator('.card').first()
    if (await card.isVisible()) {
      await screenshot('webhooks-create-form', card)
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('webhooks-create-form', content)
    }
  })
})
