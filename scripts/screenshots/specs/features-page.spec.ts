import {test, expect} from '../support/fixtures'
import {join, dirname} from 'path'
import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = 'vikunja/features'
const API_URL = (process.env.BASE_URL || 'http://127.0.0.1:3456') + '/api/v1'

test.describe('Features page screenshots', () => {
  test('Task detail content area', async ({base, authenticatedPage: page, apiContext, userToken, screenshot}) => {
    const {tasks} = base

    const task = tasks[0]

    // Upload a test image as attachment
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
    const attachmentId = (await uploadResponse.json()).success[0].id

    // Use the full API URL so the frontend's TipTap CustomImage extension
    // recognizes it and fetches the image with authentication
    await apiContext.post(`tasks/${task.id}`, {
      headers: {Authorization: `Bearer ${userToken}`},
      data: {
        description: `<p>We need to compare at least three different moving companies. Key criteria:</p><ul><li>Price for full-service move (packing + transport)</li><li>Insurance coverage for office equipment</li><li>Weekend availability to minimize disruption</li></ul><p>Sarah already reached out to <strong>CityMovers</strong> — waiting on their quote. Please contact <em>QuickShift</em> and <em>OfficePro Relocations</em> as well.</p><p>Reference photo:</p><img src="${API_URL}/tasks/${task.id}/attachments/${attachmentId}" alt="Office move reference"/>`,
      },
    })

    await page.goto(`/tasks/${task.id}`)
    await page.waitForLoadState('networkidle')
    // Wait for the TipTap editor to async-load the attachment image blob
    await page.waitForTimeout(2000)

    // Crop to just the detail content column (excludes action-buttons sidebar)
    const detailContent = page.locator('.detail-content')
    // Default padding catches the action buttons next to it.
    await screenshot('task', detailContent, {dir, padding: 0})
  })

  test('List view content', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.tasks')).toBeVisible()

    // Crop to the task list content area including add-task input
    const taskAdd = page.locator('.task-add, [data-cy="taskAdd"]').first()
    const taskList = page.locator('.tasks').first()
    const addBox = await taskAdd.boundingBox().catch(() => null)
    const listBox = await taskList.boundingBox()

    if (addBox && listBox) {
      const top = Math.min(addBox.y, listBox.y)
      const bottom = Math.max(addBox.y + addBox.height, listBox.y + listBox.height)
      await screenshot('list', page, {
        dir,
        clip: {
          x: Math.min(addBox.x, listBox.x) - 20,
          y: top - 20,
          width: Math.max(addBox.x + addBox.width, listBox.x + listBox.width) - Math.min(addBox.x, listBox.x) + 40,
          height: bottom - top + 40,
        },
      })
    } else if (listBox) {
      await screenshot('list', taskList, {dir})
    } else {
      await screenshot('list', page.locator('.app-content').first(), {dir})
    }
  })

  test('Gantt chart content', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base
    // Fit the whole chart.
    await page.setViewportSize({width: 1280, height: 1200})

    await page.goto(`/projects/${project.id}/${views.gantt.id}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Crop to just the gantt chart itself
    const ganttEl = page.locator('.gantt-chart-container')
    await screenshot('gantt', ganttEl, {dir})
  })

  test('Kanban board content', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Crop to just the kanban bucket container
    const kanbanEl = page.locator('.kanban')
    await screenshot('kanban', kanbanEl, {dir})
  })

  test('Table view content', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    // Avatars make the rows taller than the default viewport fits.
    await page.setViewportSize({width: 1280, height: 1100})
    await page.goto(`/projects/${project.id}/${views.table.id}`)
    await page.waitForLoadState('networkidle')

    const tableCard = page.locator('.project-table .card').filter({has: page.locator('table.table')})
    await screenshot('table', tableCard, {dir})
  })
})
