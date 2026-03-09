import {test, expect} from '../support/fixtures'
import {createPopulatedProject, createDefaultViews} from '../support/seed-helpers'
import {ProjectFactory} from '../factories/project'
import {TaskCommentFactory} from '../factories/task_comment'
import {UserFactory} from '../factories/user'

test.describe('Task screenshots', () => {
  test('Task detail view', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject({
      withLabels: true,
      withAssignees: true,
      withComments: true,
      withDueDates: true,
    })

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.task-view')).toBeVisible()

    // Wait for the sidebar to fully render
    await expect(page.locator('.task-view .action-buttons')).toBeVisible()

    await screenshot('tasks-detail-view', page)
  })

  test('Right sidebar cropped', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject({
      withLabels: true,
      withAssignees: true,
      withDueDates: true,
    })

    // Increase viewport height to show the full right sidebar
    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Capture the whole right sidebar/action area
    const sidebar = page.locator('.task-view .action-buttons').first()
    await expect(sidebar).toBeVisible()
    await screenshot('tasks-right-sidebar', sidebar, {padding: 10})

    // Reset viewport
    await page.setViewportSize({width: 1280, height: 900})
  })

  test('Hover preview popup', async ({authenticatedPage: page, screenshot}) => {
    const {project, views, tasks} = await createPopulatedProject({
      withLabels: true,
      withAssignees: true,
    })

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Hover over a task to trigger the preview popup
    const taskElement = page.locator('.tasks .task').first()
    await expect(taskElement).toBeVisible()

    // Move mouse to the center of the task to trigger the preview
    const taskBox = await taskElement.boundingBox()
    if (taskBox) {
      await page.mouse.move(taskBox.x + taskBox.width / 3, taskBox.y + taskBox.height / 2)
    }

    // Wait for the popup to fully appear and transition to complete
    await page.waitForTimeout(3000)

    // Capture the popup card itself with tight padding
    const popup = page.locator('.popup.is-open, .task-preview-popup, .tippy-content, .tippy-box').first()
    if (await popup.isVisible()) {
      await screenshot('tasks-hover-preview', popup, {padding: 10})
    } else {
      // Fallback: capture area around the task
      await screenshot('tasks-hover-preview', taskElement, {padding: 150})
    }
  })

  test('Comment section', async ({authenticatedPage: page, screenshot}) => {
    // Create project with extra users but handle comments manually for realistic timestamps
    const {tasks, extraUsers} = await createPopulatedProject({withComments: false})

    // Create comments with realistic timestamps (not "a few seconds ago")
    const now = new Date()
    const twoDaysAgo = new Date(now)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    twoDaysAgo.setHours(14, 23, 0, 0)

    const oneDayAgo = new Date(now)
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    oneDayAgo.setHours(9, 45, 0, 0)

    await TaskCommentFactory.create(2, {
      task_id: tasks[0].id,
      author_id: (i: number) => [extraUsers[0].id, 1][i - 1],
      comment: (i: number) => [
        'I got three quotes — the one from CityMovers looks best. Can you review?',
        'Looks good, let\'s go with that. I\'ll send them the confirmation.',
      ][i - 1],
      created: (i: number) => [twoDaysAgo.toISOString(), oneDayAgo.toISOString()][i - 1],
      updated: (i: number) => [twoDaysAgo.toISOString(), oneDayAgo.toISOString()][i - 1],
    })

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Scroll to comments section
    const commentSection = page.locator('.comments-container, .task-view .comments').first()
    await commentSection.scrollIntoViewIfNeeded()
    await expect(commentSection).toBeVisible()

    await screenshot('tasks-comments', commentSection)
  })

  test('Comment editor with @mention autocomplete', async ({authenticatedPage: page, screenshot}) => {
    const {tasks, extraUsers} = await createPopulatedProject({withComments: true})

    // Increase viewport height so comment area is visible for screenshot clipping
    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Click into the comment input, type some text with a @mention
    const commentInput = page.locator('.comments-container .tiptap, .comment-form .tiptap').first()
    await commentInput.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await commentInput.click()
    await page.keyboard.type('Can you check with ')
    await page.keyboard.type('@')
    await page.waitForTimeout(500)
    // Type partial name to filter the autocomplete
    await page.keyboard.type('sar')
    await page.waitForTimeout(800)

    // Capture the comment editor area with the mention autocomplete visible
    const editor = page.locator('.comment-form, .comment-input').first()
    if (await editor.isVisible()) {
      await screenshot('tasks-comments-mention', editor, {padding: 50})
    } else {
      await screenshot('tasks-comments-mention', commentInput, {padding: 60})
    }

    // Reset viewport
    await page.setViewportSize({width: 1280, height: 900})
  })

  test('Drag task to project in sidebar', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    // Create a second project for the drag target
    const project2 = (await ProjectFactory.create(1, {id: 100, title: 'New Office Setup'}, false))[0]
    await createDefaultViews(project2.id as number, 20, false)

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Start dragging a task toward the sidebar
    const taskElement = page.locator('.tasks .task').first()
    const sidebarProject = page.locator('.menu-list .list-menu-link').filter({hasText: 'New Office Setup'})

    await expect(taskElement).toBeVisible()
    await expect(sidebarProject).toBeVisible()

    // Use mouse to start drag without releasing — freeze mid-drag for screenshot
    const taskBox = await taskElement.boundingBox()
    const sidebarBox = await sidebarProject.boundingBox()

    if (taskBox && sidebarBox) {
      await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2)
      await page.mouse.down()
      // Move partway toward the sidebar target
      const midX = (taskBox.x + sidebarBox.x) / 2
      const midY = (taskBox.y + sidebarBox.y) / 2
      await page.mouse.move(midX, midY, {steps: 10})
      await page.waitForTimeout(200)

      await screenshot('tasks-drag-to-project', page)

      await page.mouse.up()
    }
  })
})
