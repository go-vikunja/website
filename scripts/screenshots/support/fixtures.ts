import {test as base, type APIRequestContext, type Page, type Locator} from '@playwright/test'
import {Factory} from './factory'
import {login} from './auth'
import {UserFactory} from '../factories/user'
import {SCREENSHOT_DIR} from './constants'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = join(__dirname, '..', SCREENSHOT_DIR)

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
    const [user] = await UserFactory.create(1)
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
    const fn = async (name: string, target: Page | Locator, options: object = {}) => {
      const path = join(outputDir, `${name}.png`)
      await target.screenshot({path, ...options})
    }
    await use(fn)
  },
})

export {expect} from '@playwright/test'
