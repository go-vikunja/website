import {test, expect} from '../support/fixtures'
import {visitAllProjects} from '../support/seed-helpers'

test.describe('Dashboard screenshots', () => {
  test.beforeEach(async ({base, authenticatedPage: page}) => {
    await visitAllProjects(page, base)
  })

  test('Full dashboard layout', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-cy="showTasks"]')).toBeVisible()

    await screenshot('dashboard-full', page)
  })

  test('Upcoming tasks with overdue highlighted', async ({authenticatedPage: page, screenshot}) => {
    // Fit the whole task list.
    await page.setViewportSize({width: 1280, height: 1300})
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
