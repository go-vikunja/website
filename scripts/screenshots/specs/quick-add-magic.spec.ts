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
    await quickAdd.fill('Buy groceries tomorrow p1 +Shopping')

    // Wait for the parsed preview to show
    await page.waitForTimeout(500)

    await screenshot('quick-add-magic-parsed', page)
  })

  test('Multiline subtask creation', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Type multiple lines using Shift+Enter
    const quickAdd = page.locator('.task-add textarea, [data-cy="taskAdd"] textarea').first()
    await expect(quickAdd).toBeVisible()
    await quickAdd.click()
    await quickAdd.fill('Plan team meeting')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('Book conference room')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('Send agenda to team')

    await page.waitForTimeout(300)

    await screenshot('quick-add-magic-multiline', page)
  })
})
