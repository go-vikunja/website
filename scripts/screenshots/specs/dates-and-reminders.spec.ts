import {test, expect} from '../support/fixtures'
import {TaskFactory} from '../factories/task'

test.describe('Dates and reminders screenshots', () => {
  test('Reminder configuration UI', async ({base, authenticatedPage: page, screenshot}) => {
    const task = base.tasks.find(t => t.title === 'Order new desk furniture')!

    await page.goto(`/tasks/${task.id}`)
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', {name: 'Set Reminders'}).click()
    await page.getByRole('button', {name: 'Add a reminder…'}).click()

    const popup = page.locator('.reminder-options-popup')
    await expect(popup).toBeVisible()
    await screenshot('dates-reminder-config', popup, {padding: 20})
  })

  test('Repeating task configuration', async ({base, authenticatedPage: page, screenshot}) => {
    const [task] = await TaskFactory.create(1, {
      id: 100,
      index: 100,
      project_id: base.project.id,
      title: 'Send weekly status update',
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      repeat_after: 7 * 24 * 60 * 60,
    }, false)

    await page.goto(`/tasks/${task.id}`)
    await page.waitForLoadState('networkidle')

    const repeatColumn = page.locator('.details .column').filter({has: page.locator('.repeat-after-input')})
    await expect(repeatColumn).not.toHaveClass(/flash-background/)
    await screenshot('dates-repeating-task', repeatColumn, {padding: 0})
  })

  test('Overdue task highlighting in list', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Focus on just the task list, not the input
    const taskList = page.locator('.tasks').first()
    await expect(taskList).toBeVisible()
    await screenshot('dates-overdue-highlight', taskList)
  })
})
