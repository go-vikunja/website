import {test, expect} from '../support/fixtures'
import {createPopulatedProject, createDefaultViews} from '../support/seed-helpers'
import {BucketFactory} from '../factories/bucket'
import {TaskFactory} from '../factories/task'
import {TaskBucketFactory} from '../factories/task_buckets'
import {ProjectFactory} from '../factories/project'

test.describe('Views screenshots', () => {
  test('View tabs at the top', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Capture the view switcher tabs
    const tabBar = page.locator('.project-view-tabs, .views-tabs, [data-cy="viewTabs"]').first()
    if (await tabBar.isVisible()) {
      await screenshot('views-tabs', tabBar, {padding: 5})
    } else {
      // Fallback: crop top portion of content area
      const content = page.locator('.app-content').first()
      await screenshot('views-tabs', content)
    }
  })

  test('List view with tasks', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.tasks')).toBeVisible()

    // Capture the content area (view with switcher, no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-list', content)
  })

  test('Gantt chart view', async ({authenticatedPage: page, screenshot}) => {
    // Create a custom project with start and end dates for gantt
    const projects = await ProjectFactory.create(1, {title: 'Office Move'})
    const project = projects[0]
    const views = await createDefaultViews(project.id as number)

    const now = new Date()
    await TaskFactory.create(6, {
      project_id: project.id,
      title: (i: number) => [
        'Get quotes from moving companies',
        'Notify building management',
        'Order new desk furniture',
        'Set up meeting rooms',
        'Transfer phone and internet lines',
        'Create new seating chart',
      ][i - 1],
      start_date: (i: number) => {
        // Tasks 2 and 5 have no start date (end-date only)
        if (i === 2 || i === 5) return null
        const d = new Date(now)
        d.setDate(d.getDate() + (i * 3) - 8)
        return d.toISOString()
      },
      end_date: (i: number) => {
        // Tasks 3 and 6 have no end date (start-date only)
        if (i === 3 || i === 6) return null
        const d = new Date(now)
        d.setDate(d.getDate() + (i * 3) - 8 + 4 + i) // Each task spans 4-10 days
        return d.toISOString()
      },
      due_date: (i: number) => {
        // Only set due_date for tasks that have an end_date
        if (i === 3 || i === 6) return null
        const d = new Date(now)
        d.setDate(d.getDate() + (i * 3) - 8 + 4 + i)
        return d.toISOString()
      },
    })

    await page.goto(`/projects/${project.id}/${views.gantt.id}`)
    await page.waitForLoadState('networkidle')

    // Wait for gantt content to render
    await page.waitForTimeout(1000)

    // Capture the content area (no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-gantt', content)
  })

  test('Table view', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.table.id}`)
    await page.waitForLoadState('networkidle')

    // Capture the content area (no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-table', content)
  })

  test('Kanban board', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withKanban: true})

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    // Wait for kanban to render
    await page.waitForTimeout(500)

    // Capture the content area (no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-kanban', content)
  })

  test('Kanban bucket three-dot menu', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withKanban: true})

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    // Click the three-dot menu on the first bucket
    const bucketMenu = page.locator('.bucket-header .dropdown.options, .bucket-header .options-button').first()
    if (await bucketMenu.isVisible()) {
      await bucketMenu.click()
      await page.waitForTimeout(200)
    }

    // Capture just the bucket header with its open dropdown
    const bucketWithMenu = page.locator('.bucket').first()
    await screenshot('views-kanban-bucket-menu', bucketWithMenu)
  })

  test('Kanban WIP limit exceeded', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withKanban: false})

    // Create a bucket with a low limit
    const buckets = await BucketFactory.create(2, {
      project_view_id: views.kanban.id,
      title: (i: number) => ['To Do', 'Done'][i - 1],
    })

    // Create more tasks than the limit
    const tasks = await TaskFactory.create(5, {
      project_id: project.id,
      title: (i: number) => `Task ${i}`,
    })

    // Put all tasks in the first bucket (first call truncates)
    for (let i = 0; i < tasks.length; i++) {
      await TaskBucketFactory.create(1, {
        task_id: tasks[i].id,
        bucket_id: buckets[0].id,
        project_view_id: views.kanban.id,
      }, i === 0)
    }

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    // Set WIP limit via the bucket menu
    const bucketHeader = page.locator('.bucket-header').first()
    const menuButton = bucketHeader.locator('.dropdown.options, .options-button').first()
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await page.waitForTimeout(200)

      // Look for the limit option
      const limitOption = page.locator('text=Limit').first()
      if (await limitOption.isVisible()) {
        await limitOption.click()
        await page.waitForTimeout(200)

        // Set limit to 3
        const limitInput = page.locator('input[type="number"]').first()
        if (await limitInput.isVisible()) {
          await limitInput.fill('3')
          await limitInput.press('Enter')
          await page.waitForTimeout(500)
        }
      }
    }

    // Focus on the top of the bucket showing the WIP limit indicator
    const bucket = page.locator('.bucket').first()
    const bucketTop = page.locator('.bucket-header').first()
    await screenshot('views-kanban-wip-limit', bucketTop, {padding: 30})
  })
})
