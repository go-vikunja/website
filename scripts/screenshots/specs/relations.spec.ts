import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test.describe('Relations screenshots', () => {
  test('Relation type dropdown', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject()

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Open relation section and click the type dropdown
    const relationButton = page.locator('text=Add a relation, [data-cy="addRelation"]').first()
    if (await relationButton.isVisible()) {
      await relationButton.click()
      await page.waitForTimeout(200)

      // Click the relation type dropdown
      const typeDropdown = page.locator('.relation-kind-select, [data-cy="relationKind"]').first()
      if (await typeDropdown.isVisible()) {
        await typeDropdown.click()
        await page.waitForTimeout(300)
      }
    }

    // Capture the relations area with the dropdown
    const relationsArea = page.locator('.task-relations, .add-relation').first()
    if (await relationsArea.isVisible()) {
      await relationsArea.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      await screenshot('relations-type-dropdown', relationsArea, {padding: 40})
    } else {
      await screenshot('relations-type-dropdown', page)
    }
  })
})
