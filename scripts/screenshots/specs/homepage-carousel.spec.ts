import {test, expect} from '../support/fixtures'
import {visitAllProjects} from '../support/seed-helpers'
import {join, dirname} from 'path'
import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = 'vikunja'
const API_URL = (process.env.BASE_URL || 'http://127.0.0.1:3456') + '/api/v1'


test.describe('Homepage carousel screenshots', () => {
  test.use({viewport: {width: 1400, height: 850}})

  test('01 - Dashboard overview', async ({base, authenticatedPage: page, screenshot}) => {
    await visitAllProjects(page, base)

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-cy="showTasks"]')).toBeVisible()

    await screenshot('01-task-overview', page, {dir})
  })

  test('02 - List view', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.tasks')).toBeVisible()

    await screenshot('02-task-list', page, {dir})
  })

  test('03 - Gantt chart', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.gantt.id}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await screenshot('03-task-gantt', page, {dir})
  })

  test('04 - Table view', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.table.id}`)
    await page.waitForLoadState('networkidle')

    await screenshot('04-task-table', page, {dir})
  })

  test('05 - Kanban board', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await screenshot('05-task-kanban', page, {dir})
  })

  test('06 - Task detail', async ({base, authenticatedPage: page, apiContext, userToken, screenshot}) => {
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

    await apiContext.post(`tasks/${task.id}`, {
      headers: {Authorization: `Bearer ${userToken}`},
      data: {
        description: `<p>We need to compare at least three different moving companies. Key criteria:</p><ul><li>Price for full-service move (packing + transport)</li><li>Insurance coverage for office equipment</li><li>Weekend availability to minimize disruption</li></ul><p>Sarah already reached out to <strong>CityMovers</strong> — waiting on their quote. Please contact <em>QuickShift</em> and <em>OfficePro Relocations</em> as well.</p><p>Reference photo:</p><img src="${API_URL}/tasks/${task.id}/attachments/${attachmentId}" alt="Office move reference"/>`,
      },
    })

    await page.goto(`/tasks/${task.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.task-view')).toBeVisible()
    // Wait for TipTap to async-load the attachment image blob
    await page.waitForTimeout(2000)

    await screenshot('06-task-detail', page, {dir})
  })

  test('07 - Quick add overlay', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open quick-add with Ctrl+K
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    await screenshot('07-quick-add', page, {dir})
  })

  test('08 - Kanban with background', async ({base, authenticatedPage: page, apiContext, userToken, screenshot}) => {
    const {project, views} = base

    // Upload a background image for the project
    const bgPath = join(__dirname, '..', 'support', 'test-background.jpg')
    const bgBuffer = readFileSync(bgPath)
    await apiContext.put(`projects/${project.id}/backgrounds/upload`, {
      headers: {Authorization: `Bearer ${userToken}`},
      multipart: {
        background: {
          name: 'background.jpg',
          mimeType: 'image/jpeg',
          buffer: bgBuffer,
        },
      },
    })

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await screenshot('08-task-kanban-background', page, {dir})
  })
})
