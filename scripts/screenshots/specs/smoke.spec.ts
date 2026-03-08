import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test('Smoke test: seed data and capture dashboard', async ({authenticatedPage: page, screenshot}) => {
  const {project} = await createPopulatedProject({withDueDates: true})

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Wait for the dashboard content to load
  await expect(page.locator('.home.app-content')).toBeVisible()

  // Capture the full dashboard
  const mainContent = page.locator('.app-content')
  await screenshot('_smoke-test-dashboard', mainContent)
})
