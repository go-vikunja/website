import {test as base, type APIRequestContext, type Page, type Locator} from '@playwright/test'
import {Factory} from './factory'
import {login} from './auth'
import {UserFactory} from '../factories/user'
import {IMAGES_BASE_DIR} from './constants'
import {join, dirname} from 'path'
import {mkdirSync} from 'fs'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseDir = join(__dirname, '..', IMAGES_BASE_DIR)

export const test = base.extend<{
  apiContext: APIRequestContext;
  authenticatedPage: Page;
  currentUser: Record<string, unknown>;
  userToken: string;
  screenshot: (name: string, target: Page | Locator, options?: object) => Promise<void>;
}>({
  apiContext: async ({playwright}, use) => {
    const baseURL = process.env.API_URL || 'http://localhost:3456/api/v1/'
    const apiContext = await playwright.request.newContext({baseURL})
    Factory.setRequestContext(apiContext)
    await use(apiContext)
    await apiContext.dispose()
  },

  currentUser: async ({apiContext}, use) => {
    const [user] = await UserFactory.create(1, {
      username: 'lisa',
      name: 'Lisa Chen',
    })
    await use(user)
  },

  userToken: async ({apiContext, currentUser}, use) => {
    const {token} = await login(null, apiContext, currentUser)
    await use(token)
  },

  authenticatedPage: async ({page, apiContext, currentUser}, use) => {
    await login(page, apiContext, currentUser)
    await use(page)
    await page.goto('about:blank').catch(() => {})
  },

  screenshot: async ({}, use) => {
    const PADDING = 20
    const fn = async (name: string, target: Page | Locator, options: Record<string, unknown> = {}) => {
      const dir = (options.dir as string) ?? 'help'
      delete options.dir
      const path = join(baseDir, dir, `${name}.png`)
      mkdirSync(dirname(path), {recursive: true})
      const padding = (options.padding as number) ?? PADDING
      delete options.padding

      // For locators, capture via page.screenshot with clip for padding
      if ('boundingBox' in target && typeof target.boundingBox === 'function') {
        const locator = target as Locator
        const box = await locator.boundingBox()
        if (box) {
          const ownerPage = locator.page()
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
