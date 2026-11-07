import {test, expect} from '../support/fixtures'

test.describe('Webhooks screenshots', () => {
  // The forms are taller than the default viewport.
  test.use({viewport: {width: 1280, height: 1600}})

  test('Project webhooks settings section', async ({base, authenticatedPage: page, screenshot}) => {
    const {project} = base

    await page.goto(`/projects/${project.id}/settings/webhooks`)
    await page.waitForLoadState('networkidle')

    const card = page.locator('.card').first()
    await expect(card.getByRole('button', {name: 'Cancel'})).toBeVisible()
    await screenshot('webhooks-settings-section', card, {padding: 0})
  })

  test('Webhook creation form', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/user/settings/webhooks')
    await page.waitForLoadState('networkidle')

    const card = page.locator('.card').first()
    await expect(card.getByRole('button', {name: 'Create webhook'})).toBeVisible()
    await screenshot('webhooks-create-form', card, {padding: 0})
  })
})
