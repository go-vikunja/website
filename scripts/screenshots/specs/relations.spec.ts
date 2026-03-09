import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {TaskRelationFactory} from '../factories/task_relation'

test.describe('Relations screenshots', () => {
  test('Add a relation section', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject()

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Click "Add a relation" or the relations section
    const relationButton = page.locator('text=Add a relation, [data-cy="addRelation"]').first()
    if (await relationButton.isVisible()) {
      await relationButton.click()
      await page.waitForTimeout(300)
    }

    await screenshot('relations-add', page)
  })

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

  test('Bidirectional relation', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject()

    // Seed a relation between tasks
    await TaskRelationFactory.create(1, {
      task_id: tasks[0].id,
      other_task_id: tasks[1].id,
      relation_kind: 'related',
      created_by_id: 1,
    })

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Scroll to the relations section
    const relationsSection = page.locator('.task-relations, [data-cy="taskRelations"]').first()
    if (await relationsSection.isVisible()) {
      await relationsSection.scrollIntoViewIfNeeded()
    }

    await screenshot('relations-bidirectional', page)
  })
})
