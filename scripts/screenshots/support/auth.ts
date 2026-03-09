import type {Page, APIRequestContext} from '@playwright/test'

export async function login(page: Page | null, apiContext: APIRequestContext, user: Record<string, unknown>) {
  const response = await apiContext.post('login', {
    data: {username: user.username, password: '1234'},
  })
  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()} ${response.statusText()}`)
  }
  const body = await response.json()
  const token = body.token

  if (page) {
    const apiUrl = process.env.API_URL || 'http://127.0.0.1:3456/api/v1'
    await page.addInitScript(({token, apiUrl}) => {
      window.localStorage.setItem('token', token)
      window.localStorage.setItem('API_URL', apiUrl)
      // Enable data-cy test attributes in production builds
      window.TESTING = true
    }, {token, apiUrl})
  }

  return {user, token}
}
