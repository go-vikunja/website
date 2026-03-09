import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {TaskFactory} from '../factories/task'
import {ProjectFactory} from '../factories/project'
import {createDefaultViews} from '../support/seed-helpers'

test.describe('Dates and reminders screenshots', () => {
  test('Reminder configuration UI', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject({withDueDates: true})

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Click the reminders section in the right sidebar to expand it
    const reminderSection = page.locator('.reminders .detail-content, .reminders').first()
    if (await reminderSection.isVisible()) {
      await reminderSection.click()
      await page.waitForTimeout(300)
    } else {
      // Try clicking the "Reminders" heading to expand
      const reminderHeading = page.getByText('Reminders').first()
      if (await reminderHeading.isVisible()) {
        await reminderHeading.click()
        await page.waitForTimeout(300)
      }
    }

    // Click the "Add a new reminder" or similar button to show the actual config
    const addButton = page.locator('.reminders .add').or(page.locator('.reminders button')).or(page.getByText('Add a new reminder')).first()
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(300)
    }

    // Capture the reminder configuration area
    const reminderArea = page.locator('.reminders').first()
    if (await reminderArea.isVisible()) {
      await screenshot('dates-reminder-config', reminderArea, {padding: 30})
    } else {
      const sidebar = page.locator('.task-view .action-buttons, .task-view .details').last()
      await screenshot('dates-reminder-config', sidebar)
    }
  })

  test('Repeating task configuration', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject({withDueDates: true})

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Click the repeat section to expand it
    const repeatSection = page.locator('.repeat-after .detail-content, .repeat-after').first()
    if (await repeatSection.isVisible()) {
      await repeatSection.click()
      await page.waitForTimeout(300)
    } else {
      const repeatHeading = page.getByText('Repeat').first()
      if (await repeatHeading.isVisible()) {
        await repeatHeading.click()
        await page.waitForTimeout(300)
      }
    }

    // Look for repeat mode selector or configuration inputs
    const repeatConfig = page.locator('.repeat-after').first()
    if (await repeatConfig.isVisible()) {
      await screenshot('dates-repeating-task', repeatConfig, {padding: 30})
    } else {
      const sidebar = page.locator('.task-view .action-buttons, .task-view .details').last()
      await screenshot('dates-repeating-task', sidebar)
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
