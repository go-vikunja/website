import {test, expect} from '../support/fixtures'
import {ProjectFactory} from '../factories/project'
import {TaskFactory} from '../factories/task'
import {createDefaultViews} from '../support/seed-helpers'

test.describe('Dashboard screenshots', () => {
  test.beforeEach(async ({authenticatedPage: page}) => {
    // Create multiple projects to show in "recently viewed"
    const projects = await ProjectFactory.create(3, {
      title: (i: number) => ['Office Move', 'Team Retreat Planning', 'Personal'][i - 1],
    })

    for (let i = 0; i < projects.length; i++) {
      await createDefaultViews(projects[i].id as number, i * 4 + 1, i === 0)
    }

    // Create tasks with various due dates
    const now = new Date()
    const titles = [
      'Get quotes from moving companies', 'Order new desk furniture', 'Update company address on website',
      'Book retreat venue', 'Confirm catering for retreat', 'Send agenda to team',
      'Schedule dentist appointment', 'Renew parking permit',
    ]
    const tasks = []
    for (let i = 0; i < titles.length; i++) {
      const dueDate = new Date(now)
      dueDate.setDate(dueDate.getDate() + (i * 2) - 6) // Some overdue, some upcoming
      tasks.push({
        id: i + 1,
        title: titles[i],
        project_id: projects[i % 3].id,
        done: false,
        created_by_id: 1,
        index: i + 1,
        priority: [0, 1, 3, 2, 5, 1, 0, 4][i],
        due_date: i < 7 ? dueDate.toISOString() : undefined,
        created: now.toISOString(),
        updated: now.toISOString(),
      })
    }
    await TaskFactory.create(tasks.length, {
      project_id: (i: number) => tasks[i - 1].project_id,
      title: (i: number) => tasks[i - 1].title,
      done: (i: number) => tasks[i - 1].done,
      created_by_id: (i: number) => tasks[i - 1].created_by_id,
      index: (i: number) => tasks[i - 1].index,
      priority: (i: number) => tasks[i - 1].priority,
      due_date: (i: number) => tasks[i - 1].due_date,
    })

    // Visit projects to populate "recently viewed"
    await page.goto(`/projects/${projects[0].id}/1`)
    await page.waitForLoadState('networkidle')
    await page.goto(`/projects/${projects[1].id}/5`)
    await page.waitForLoadState('networkidle')
    await page.goto(`/projects/${projects[2].id}/9`)
    await page.waitForLoadState('networkidle')
  })

  test('Full dashboard layout', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-cy="showTasks"]')).toBeVisible()

    await screenshot('dashboard-full', page)
  })

  test('Upcoming tasks with overdue highlighted', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const upcomingSection = page.locator('[data-cy="showTasks"]')
    await expect(upcomingSection).toBeVisible()
    await screenshot('dashboard-upcoming-overdue', upcomingSection)
  })

  test('Upcoming view in sidebar', async ({authenticatedPage: page, screenshot}) => {
    // Navigate to the upcoming/tasks-by-date view
    await page.goto('/tasks/by/upcoming')
    await page.waitForLoadState('networkidle')

    // The sidebar should show the date range controls
    await screenshot('dashboard-upcoming-sidebar', page)
  })

  test('Recently viewed projects section', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Capture the recently viewed section
    const recentSection = page.locator('.recently-viewed, [data-cy="recentlyViewed"]').first()
    if (await recentSection.isVisible()) {
      await screenshot('dashboard-recent-projects', recentSection)
    } else {
      // Fallback: capture the app content area
      const content = page.locator('.app-content').first()
      await screenshot('dashboard-recent-projects', content)
    }
  })
})
