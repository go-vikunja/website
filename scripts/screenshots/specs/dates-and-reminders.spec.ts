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

    // Click the reminder button/section
    const reminderButton = page.locator('text=Reminders, text=Add a reminder, [data-cy="reminders"]').first()
    if (await reminderButton.isVisible()) {
      await reminderButton.click()
      await page.waitForTimeout(300)
    }

    // Capture the popup or the task sidebar area
    const popup = page.locator('.popup.is-open, .reminder-options-popup').first()
    if (await popup.isVisible()) {
      await screenshot('dates-reminder-config', popup, {padding: 40})
    } else {
      const sidebar = page.locator('.task-view .action-buttons, .task-view .details').last()
      await screenshot('dates-reminder-config', sidebar)
    }
  })

  test('Repeating task configuration', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject({withDueDates: true})

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Click the repeat/recurring section
    const repeatButton = page.locator('text=Repeat, text=Repeating, [data-cy="repeatMode"]').first()
    if (await repeatButton.isVisible()) {
      await repeatButton.click()
      await page.waitForTimeout(300)
    }

    // Capture the popup or the task sidebar area
    const popup = page.locator('.popup.is-open, .repeat-options-popup').first()
    if (await popup.isVisible()) {
      await screenshot('dates-repeating-task', popup, {padding: 40})
    } else {
      const sidebar = page.locator('.task-view .action-buttons, .task-view .details').last()
      await screenshot('dates-repeating-task', sidebar)
    }
  })

  test('Overdue task highlighting in list', async ({authenticatedPage: page, screenshot}) => {
    const projects = await ProjectFactory.create(1, {title: 'Deadline Tracker'})
    const project = projects[0]
    const views = await createDefaultViews(project.id as number)

    // Create tasks with past due dates
    const now = new Date()
    await TaskFactory.create(5, {
      project_id: project.id,
      title: (i: number) => [
        'Overdue report submission',
        'Missed client meeting',
        'Late code review',
        'Past deadline deployment',
        'Upcoming feature release',
      ][i - 1],
      due_date: (i: number) => {
        const d = new Date(now)
        d.setDate(d.getDate() + (i <= 3 ? -i * 2 : i * 3)) // First 3 overdue, rest future
        return d.toISOString()
      },
    })

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    await screenshot('dates-overdue-highlight', page)
  })
})
