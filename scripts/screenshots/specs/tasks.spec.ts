import {test, expect} from '../support/fixtures'
import {createDefaultViews} from '../support/seed-helpers'
import {ProjectFactory} from '../factories/project'
import {TaskCommentFactory} from '../factories/task_comment'
import {ProjectUserFactory} from '../factories/project_user'

test.describe('Task screenshots', () => {
  test('Task detail view', async ({base, authenticatedPage: page, screenshot}) => {
    const {tasks} = base

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.task-view')).toBeVisible()

    // Wait for the sidebar to fully render
    await expect(page.locator('.task-view .action-buttons')).toBeVisible()

    await screenshot('tasks-detail-view', page)
  })

  test('Right sidebar cropped', async ({base, authenticatedPage: page, screenshot}) => {
    const {tasks} = base

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

  test('Hover preview popup', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

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

    // Capture the tooltip card with the hovered task visible below it
    // Use the popup width as the primary reference, not the full task row width
    const popup = page.locator('.task-glance-tooltip').first()
    if (await popup.isVisible()) {
      const popupBox = await popup.boundingBox()
      if (popupBox && taskBox) {
        const top = Math.min(popupBox.y, taskBox.y) - 10
        const bottom = Math.max(popupBox.y + popupBox.height, taskBox.y + taskBox.height) + 20
        // Center on the popup width with some extra margin
        const left = popupBox.x - 20
        const right = popupBox.x + popupBox.width + 20
        await screenshot('tasks-hover-preview', page, {
          clip: {
            x: Math.max(0, left),
            y: Math.max(0, top),
            width: right - left,
            height: bottom - top,
          },
        })
      } else {
        await screenshot('tasks-hover-preview', popup, {padding: 10})
      }
    } else {
      await screenshot('tasks-hover-preview', taskElement, {padding: 150})
    }
  })

  test('Comment section', async ({base, authenticatedPage: page, screenshot}) => {
    // Create project with extra users but handle comments manually for realistic timestamps
    const {tasks, extraUsers} = base

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

  test('Comment editor with @mention autocomplete', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, tasks, extraUsers} = base
    // Only users with access to the project are suggested.
    await ProjectUserFactory.create(2, {
      user_id: (i: number) => extraUsers[i - 1].id,
      project_id: project.id,
      permission: 1,
    })

    // Increase viewport height so comment area is visible for screenshot clipping
    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')
    // Give the tiptap mention plugin time to fully initialise — without
    // this the @-trigger is intermittently missed.
    await page.waitForTimeout(1500)

    // Scope to the new-comment row so we don't accidentally target the task
    // description editor (both are contenteditable ProseMirror instances).
    const newCommentRow = page.locator('.media.comment.d-print-none').first()
    const commentEditor = newCommentRow.locator('.ProseMirror[contenteditable="true"]').first()

    await commentEditor.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await commentEditor.click()
    await page.keyboard.type('Can you check with ')
    await page.keyboard.type('@')
    await page.waitForTimeout(800)

    // Typing @ can cause the browser to scroll the task detail layout; make
    // sure the editor is in view before we grab bounding boxes.
    await commentEditor.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)

    const mentionDropdown = page.locator('.mention-items').first()
    await expect(mentionDropdown).toBeVisible()

    const editorBox = await commentEditor.boundingBox()
    const dropdownBox = await mentionDropdown.boundingBox()
    if (editorBox && dropdownBox) {
      const viewport = page.viewportSize()!
      const PAD = 20
      const left = Math.max(0, Math.min(editorBox.x, dropdownBox.x) - PAD)
      const top = Math.max(0, Math.min(editorBox.y, dropdownBox.y) - PAD)
      const right = Math.max(editorBox.x + editorBox.width, dropdownBox.x + dropdownBox.width) + PAD
      const bottom = Math.max(editorBox.y + editorBox.height, dropdownBox.y + dropdownBox.height) + PAD
      await screenshot('tasks-comments-mention', page, {
        clip: {
          x: left,
          y: top,
          width: Math.min(viewport.width - left, right - left),
          height: Math.min(viewport.height - top, bottom - top),
        },
      })
    } else {
      await screenshot('tasks-comments-mention', newCommentRow, {padding: 40})
    }

    // Reset viewport
    await page.setViewportSize({width: 1280, height: 900})
  })

  test('Drag task to project in sidebar', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

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
      // The drag path crosses an assignee avatar, whose tooltip would cover the row.
      await page.addStyleTag({content: '.v-popper--theme-tooltip { display: none !important; }'})
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

  test('Kanban bucket picker in task detail view', async ({base, authenticatedPage: page, screenshot}) => {
    // The bucket picker only shows when the task's project has a manual
    // Kanban view. createPopulatedProject seeds one by default.
    const {tasks} = base

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.task-view')).toBeVisible()

    const bucketButton = page.getByRole('button', {name: /^Kanban bucket:/})
    await expect(bucketButton).toBeVisible()
    await bucketButton.click()

    // Wait for the dropdown menu with bucket options to render.
    const bucketDropdown = page.locator('.dropdown-menu .dropdown-content').filter({hasText: 'To Do'}).first()
    await expect(bucketDropdown).toBeVisible()

    // Capture a clip around the breadcrumb subtitle with room underneath so
    // the open dropdown (which is positioned below the button) is included.
    const subtitle = page.locator('.task-view .subtitle').filter({has: bucketButton}).first()
    const subtitleBox = await subtitle.boundingBox()
    if (subtitleBox) {
      const viewport = page.viewportSize()!
      const clipX = Math.max(0, subtitleBox.x - 20)
      await screenshot('tasks-kanban-bucket-picker', page, {
        clip: {
          x: clipX,
          y: Math.max(0, subtitleBox.y - 20),
          width: Math.min(viewport.width - clipX, 720),
          height: 260,
        },
      })
    } else {
      await screenshot('tasks-kanban-bucket-picker', page)
    }
  })
})
