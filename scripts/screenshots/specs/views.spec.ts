import {test, expect} from '../support/fixtures'
import {createPopulatedProject, createDefaultViews} from '../support/seed-helpers'
import {BucketFactory} from '../factories/bucket'
import {TaskFactory} from '../factories/task'
import {TaskBucketFactory} from '../factories/task_buckets'

test.describe('Views screenshots', () => {
  test('View tabs at the top', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Capture the view tabs bar
    const tabBar = page.locator('.project-view-tabs, .views-tabs, [data-cy="viewTabs"]').first()
    if (await tabBar.isVisible()) {
      await screenshot('views-tabs', tabBar)
    } else {
      // Fallback: crop top portion of page
      await screenshot('views-tabs', page, {clip: {x: 0, y: 0, width: 1280, height: 120}})
    }
  })

  test('List view with tasks', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.tasks')).toBeVisible()
    await screenshot('views-list', page)
  })

  test('Gantt chart view', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withDueDates: true})

    await page.goto(`/projects/${project.id}/${views.gantt.id}`)
    await page.waitForLoadState('networkidle')

    // Wait for gantt content to render
    await page.waitForTimeout(1000)
    await screenshot('views-gantt', page)
  })

  test('Table view', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.table.id}`)
    await page.waitForLoadState('networkidle')

    await screenshot('views-table', page)
  })

  test('Kanban board', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withKanban: true})

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    // Wait for kanban to render
    await page.waitForTimeout(500)
    await screenshot('views-kanban', page)
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

    await screenshot('views-kanban-wip-limit', page)
  })

  test('Filter-based bucket configuration', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withKanban: true})

    // Navigate to the kanban view management/config
    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    await screenshot('views-filter-bucket', page)
  })
})
