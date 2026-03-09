import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {TaskFactory} from '../factories/task'
import {ProjectFactory} from '../factories/project'
import {createDefaultViews} from '../support/seed-helpers'

test.describe('Dates and reminders screenshots', () => {
  test('Reminder configuration UI', async ({authenticatedPage: page, screenshot}) => {
    // Create a minimal task with just a due date — no labels, assignees, etc.
    const projects = await ProjectFactory.create(1, {title: 'Office Move'})
    const project = projects[0]
    await createDefaultViews(project.id as number)

    const now = new Date()
    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + 5)

    await TaskFactory.create(1, {
      project_id: project.id,
      title: 'Get quotes from moving companies',
      due_date: dueDate.toISOString(),
    })

    await page.goto(`/tasks/1`)
    await page.waitForLoadState('networkidle')

    // Click the reminders section to expand it
    const reminderHeading = page.getByText('Reminders').first()
    if (await reminderHeading.isVisible()) {
      await reminderHeading.click()
      await page.waitForTimeout(300)
    }

    // Click "Add a new reminder" to open the popup
    const addButton = page.locator('.reminders .add').or(page.locator('.reminders button')).or(page.getByText('Add a new reminder')).first()
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(500)
    }

    // Try to capture the reminder popup/modal
    const popup = page.locator('.reminder-options-popup, .popup, .modal-content, .card.reminder').first()
    if (await popup.isVisible()) {
      await screenshot('dates-reminder-config', popup, {padding: 20})
    } else {
      // Fallback: capture the reminders area
      const reminderArea = page.locator('.reminders').first()
      if (await reminderArea.isVisible()) {
        await screenshot('dates-reminder-config', reminderArea, {padding: 30})
      } else {
        const sidebar = page.locator('.task-view .action-buttons, .task-view .details').last()
        await screenshot('dates-reminder-config', sidebar)
      }
    }
  })

  test('Repeating task configuration', async ({authenticatedPage: page, screenshot}) => {
    // Create a minimal task with just a due date
    const projects = await ProjectFactory.create(1, {title: 'Office Move'})
    const project = projects[0]
    await createDefaultViews(project.id as number)

    const now = new Date()
    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + 5)

    await TaskFactory.create(1, {
      project_id: project.id,
      title: 'Send weekly status update',
      due_date: dueDate.toISOString(),
    })

    await page.goto(`/tasks/1`)
    await page.waitForLoadState('networkidle')

    // Click the repeat section to expand/open it
    const repeatHeading = page.getByText('Repeat').first()
    if (await repeatHeading.isVisible()) {
      await repeatHeading.click()
      await page.waitForTimeout(300)
    }

    // Click to open the repeat configuration popup
    const repeatTrigger = page.locator('.repeat-after .detail-content').or(page.locator('.repeat-after button')).or(page.locator('.repeat-after .add')).first()
    if (await repeatTrigger.isVisible()) {
      await repeatTrigger.click()
      await page.waitForTimeout(500)
    }

    // Try to capture the repeat popup/modal
    const popup = page.locator('.repeat-options-popup, .popup, .modal-content, .card.repeat').first()
    if (await popup.isVisible()) {
      await screenshot('dates-repeating-task', popup, {padding: 20})
    } else {
      // Fallback: capture the repeat area
      const repeatConfig = page.locator('.repeat-after').first()
      if (await repeatConfig.isVisible()) {
        await screenshot('dates-repeating-task', repeatConfig, {padding: 30})
      } else {
        const sidebar = page.locator('.task-view .action-buttons, .task-view .details').last()
        await screenshot('dates-repeating-task', sidebar)
      }
    }
  })

  test('Overdue task highlighting in list', async ({authenticatedPage: page, screenshot}) => {
    const projects = await ProjectFactory.create(1, {title: 'Moving Deadlines'})
    const project = projects[0]
    const views = await createDefaultViews(project.id as number)

    // Create tasks with past due dates
    const now = new Date()
    await TaskFactory.create(5, {
      project_id: project.id,
      title: (i: number) => [
        'Return signed lease',
        'Submit parking applications',
        'Order business cards with new address',
        'Confirm internet installation date',
        'Final walkthrough of new office',
      ][i - 1],
      due_date: (i: number) => {
        const d = new Date(now)
        d.setDate(d.getDate() + (i <= 3 ? -i * 2 : i * 3)) // First 3 overdue, rest future
        return d.toISOString()
      },
    })

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Focus on just the task list, not the input
    const taskList = page.locator('.tasks').first()
    await expect(taskList).toBeVisible()
    await screenshot('dates-overdue-highlight', taskList)
  })
})
