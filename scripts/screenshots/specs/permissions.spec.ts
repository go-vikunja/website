import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test.describe('Permissions screenshots', () => {
  test('Permission dropdown in sharing dialog', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Look for a permission dropdown and open it
    const permissionDropdown = page.locator('.permission-select, [data-cy="permissionSelect"]').first()
    if (await permissionDropdown.isVisible()) {
      await permissionDropdown.click()
      await page.waitForTimeout(300)
    }

    // Capture the full modal/card
    const modal = page.locator('.modal-content .card, .modal-content, .card.has-overflow').first()
    if (await modal.isVisible()) {
      await screenshot('permissions-dropdown', modal)
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('permissions-dropdown', content)
    }
  })
})
