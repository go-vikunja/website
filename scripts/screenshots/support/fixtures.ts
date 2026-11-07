import {test as base, type APIRequestContext, type Page, type Locator} from '@playwright/test'
import {Factory} from './factory'
import {login} from './auth'
import {UserFactory} from '../factories/user'
import {IMAGES_BASE_DIR, CURRENT_USER_NAME} from './constants'
import {seedBaseData, type BaseData} from './seed-helpers'
import {join, dirname} from 'path'
import {mkdirSync} from 'fs'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseDir = join(__dirname, '..', IMAGES_BASE_DIR)

// Wiped before every test so nothing leaks between them.
const RESET_TABLES = [
  'projects', 'project_views', 'tasks', 'buckets', 'task_buckets', 'labels', 'label_tasks',
  'task_assignees', 'task_comments', 'task_attachments', 'task_relations', 'task_reminders',
  'saved_filters', 'link_shares', 'teams', 'team_members', 'users_projects', 'webhooks', 'favorites',
  'notifications', 'files', 'team_projects',
]

export const test = base.extend<{
  apiContext: APIRequestContext;
  authenticatedPage: Page;
  currentUser: Record<string, unknown>;
  base: BaseData;
  userToken: string;
  screenshot: (name: string, target: Page | Locator, options?: object) => Promise<void>;
}>({
  apiContext: async ({playwright}, use) => {
    const baseURL = process.env.API_URL || 'http://localhost:3456/api/v1/'
    const apiContext = await playwright.request.newContext({baseURL})
    Factory.setRequestContext(apiContext)
    for (const table of RESET_TABLES) await Factory.seed(table, null)
    await use(apiContext)
    await apiContext.dispose()
  },

  currentUser: async ({apiContext}, use) => {
    const [user] = await UserFactory.create(1, {
      username: 'lisa',
      name: CURRENT_USER_NAME,
    })
    await use(user)
  },

  // Every test starts from the same freshly seeded data, whether or not it uses the handles.
  base: [async ({currentUser}, use) => {
    await use(await seedBaseData())
  }, {auto: true}],

  userToken: async ({apiContext, currentUser}, use) => {
    const {token} = await login(null, apiContext, currentUser)
    await use(token)
  },

  authenticatedPage: async ({page, apiContext, currentUser}, use) => {
    await login(page, apiContext, currentUser)
    await use(page)
    await page.goto('about:blank').catch(() => {})
  },

  screenshot: async ({}, use, testInfo) => {
    const PADDING = 20
    const isDark = testInfo.project.use.colorScheme === 'dark'
    const fn = async (name: string, target: Page | Locator, options: Record<string, unknown> = {}) => {
      const dir = (options.dir as string) ?? 'help'
      delete options.dir
      const fileName = isDark ? `${name}-dark` : name
      const path = join(baseDir, dir, `${fileName}.png`)
      mkdirSync(dirname(path), {recursive: true})
      const padding = (options.padding as number) ?? PADDING
      delete options.padding

      const ownerPage = 'page' in target && typeof target.page === 'function' ? target.page() : target as Page
      // 2.8.0 autofocuses the empty add-task input, adding a focus ring the old screenshots didn't have.
      await ownerPage.evaluate(() => {
        const el = document.activeElement
        if (el instanceof HTMLElement && el.matches('.add-task-textarea.textarea-empty')) el.blur()
      })
      // The dashboard greeting rotates by date, time of day and account age. Pin the neutral daytime variant.
      await ownerPage.evaluate(name => {
        const greeting = document.querySelector('.home h1')
        if (greeting) greeting.textContent = `Hi ${name}!`
      }, CURRENT_USER_NAME)
      // Popups fade in; capturing mid-transition leaves them translucent.
      await ownerPage.evaluate(() => Promise.all(document.getAnimations()
        .filter(a => a.effect?.getTiming().iterations !== Infinity)
        .map(a => a.finished.catch(() => {}))))

      // For locators, capture via page.screenshot with clip for padding
      if ('boundingBox' in target && typeof target.boundingBox === 'function') {
        const locator = target as Locator
        const box = await locator.boundingBox()
        if (box) {
          const viewport = ownerPage.viewportSize()!
          const clip = {
            x: Math.max(0, box.x - padding),
            y: Math.max(0, box.y - padding),
            width: Math.min(viewport.width - Math.max(0, box.x - padding), box.width + padding * 2),
            height: Math.min(viewport.height - Math.max(0, box.y - padding), box.height + padding * 2),
          }
          await ownerPage.screenshot({path, clip, ...options})
          return
        }
      }

      // For Page targets, just screenshot directly
      await target.screenshot({path, ...options})
    }
    await use(fn)
  },
})

export {expect} from '@playwright/test'
