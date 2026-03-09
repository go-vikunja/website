import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'

test.describe('Quick-add magic screenshots', () => {
  test('Quick-add with parsed preview', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Type a quick-add string with magic prefixes
    const quickAdd = page.locator('.task-add textarea, [data-cy="taskAdd"] textarea').first()
    await expect(quickAdd).toBeVisible()
    await quickAdd.click()
    await quickAdd.fill('Order packing supplies tomorrow !3 *logistics')

    // Wait for the parsed preview to show
    await page.waitForTimeout(500)

    // Focus on the task input area with its parsed preview
    const taskAddArea = page.locator('.task-add, [data-cy="taskAdd"]').first()
    await screenshot('quick-add-magic-parsed', taskAddArea, {padding: 10})
  })

  test('Multiline subtask creation', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Type multiple lines using Shift+Enter
    const quickAdd = page.locator('.task-add textarea, [data-cy="taskAdd"] textarea').first()
    await expect(quickAdd).toBeVisible()
    await quickAdd.click()
    await quickAdd.fill('Plan moving day')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('Reserve loading dock')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('Notify all departments')

    await page.waitForTimeout(300)

    // Focus on the task input area
    const taskAddArea = page.locator('.task-add, [data-cy="taskAdd"]').first()
    await screenshot('quick-add-magic-multiline', taskAddArea, {padding: 10})
  })
})
