import {test, expect} from '../support/fixtures'
import {createPopulatedProject, createDefaultViews} from '../support/seed-helpers'
import {ProjectFactory} from '../factories/project'
import {TaskFactory} from '../factories/task'
import {join, dirname} from 'path'
import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = 'vikunja/features'

test.describe('Features page screenshots', () => {
  test('Task detail content area', async ({authenticatedPage: page, apiContext, userToken, screenshot}) => {
    const {tasks} = await createPopulatedProject({
      withLabels: true,
      withAssignees: true,
    })

    const task = tasks[0]

    // Upload attachment and set description with image
    const imagePath = join(__dirname, '..', 'support', 'test-image.jpg')
    const imageBuffer = readFileSync(imagePath)
    const uploadResponse = await apiContext.put(`tasks/${task.id}/attachments`, {
      headers: {Authorization: `Bearer ${userToken}`},
      multipart: {
        files: {
          name: 'test-image.jpg',
          mimeType: 'image/jpeg',
          buffer: imageBuffer,
        },
      },
    })
    const attachment = await uploadResponse.json()

    await apiContext.post(`tasks/${task.id}`, {
      headers: {Authorization: `Bearer ${userToken}`},
      data: {
        description: `<p>And it has an <em>important</em> description!</p><p>And a nice image:</p><img src="/api/v1/tasks/${task.id}/attachments/${attachment.id}" alt="Office move reference"/>`,
      },
    })

    await page.goto(`/tasks/${task.id}`)
    await page.waitForLoadState('networkidle')

    // Crop to just the task content area
    const taskContent = page.locator('.task-view .detail-content, .task-view .heading').first()
    if (await taskContent.isVisible()) {
      const titleEl = page.locator('.task-view h1, .task-view .heading').first()
      const descEl = page.locator('.task-view .description, .task-view .ProseMirror').first()
      const titleBox = await titleEl.boundingBox()
      const descBox = await descEl.boundingBox()
      if (titleBox && descBox) {
        await screenshot('task', page, {
          dir,
          clip: {
            x: titleBox.x - 20,
            y: titleBox.y - 20,
            width: Math.max(titleBox.width, descBox.width) + 40,
            height: (descBox.y + descBox.height) - titleBox.y + 40,
          },
        })
      }
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('task', content, {dir})
    }
  })

  test('List view content', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({
      withLabels: true,
      withAssignees: true,
    })

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.tasks')).toBeVisible()

    // Crop to the task list content
    const taskList = page.locator('.tasks').first()
    const addInput = page.locator('.add-task-input, [data-cy="newTaskInput"]').first()
    const addBox = await addInput.boundingBox().catch(() => null)
    const listBox = await taskList.boundingBox()

    if (addBox && listBox) {
      await screenshot('list', page, {
        dir,
        clip: {
          x: addBox.x - 20,
          y: addBox.y - 20,
          width: Math.max(addBox.width, listBox.width) + 40,
          height: (listBox.y + listBox.height) - addBox.y + 40,
        },
      })
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('list', content, {dir})
    }
  })

  test('Gantt chart content', async ({authenticatedPage: page, screenshot}) => {
    const projects = await ProjectFactory.create(1, {title: 'Office Move'})
    const project = projects[0]
    const views = await createDefaultViews(project.id as number)
    const now = new Date()

    await TaskFactory.create(6, {
      project_id: project.id,
      title: (i: number) => [
        'Get quotes from moving companies', 'Notify building management',
        'Order new desk furniture', 'Set up meeting rooms',
        'Transfer phone and internet lines', 'Create new seating chart',
      ][i - 1],
      start_date: (i: number) => {
        if (i === 2 || i === 5) return null
        const d = new Date(now)
        d.setDate(d.getDate() + (i * 3) - 8)
        return d.toISOString()
      },
      end_date: (i: number) => {
        if (i === 3 || i === 6) return null
        const d = new Date(now)
        d.setDate(d.getDate() + (i * 3) - 8 + 4 + i)
        return d.toISOString()
      },
      due_date: (i: number) => {
        if (i === 3 || i === 6) return null
        const d = new Date(now)
        d.setDate(d.getDate() + (i * 3) - 8 + 4 + i)
        return d.toISOString()
      },
    })

    await page.goto(`/projects/${project.id}/${views.gantt.id}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Crop to just the gantt chart area
    const ganttEl = page.locator('.gantt-chart, .app-content').first()
    await screenshot('gantt', ganttEl, {dir})
  })

  test('Kanban board content', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject({withKanban: true})

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Crop to just the bucket area
    const kanbanEl = page.locator('.kanban, .app-content').first()
    await screenshot('kanban', kanbanEl, {dir})
  })

  test('Table view content', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.table.id}`)
    await page.waitForLoadState('networkidle')

    // Crop to the table content
    const tableEl = page.locator('.table-view table, .app-content').first()
    await screenshot('table', tableEl, {dir})
  })
})
