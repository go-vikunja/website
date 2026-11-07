import {test, expect} from '../support/fixtures'

test('Linked accounts settings and confirmation', async ({authenticatedPage: page, screenshot}) => {
  // Keep provider-specific data reproducible without an external SSO service.
  await page.route('**/api/v2/info', async route => {
    const response = await route.fetch()
    const info = await response.json()
    info.auth.openid_connect = {
      enabled: true,
      providers: [
        {key: 'authentik', name: 'Authentik', auth_url: 'https://identity.example.test/authorize', client_id: 'vikunja', scope: 'openid profile email'},
        {key: 'gitlab', name: 'GitLab.com', auth_url: 'https://identity.example.test/authorize', client_id: 'vikunja', scope: 'openid profile email'},
      ],
    }
    await route.fulfill({response, json: info})
  })
  await page.route('**/api/v2/user/settings/identities', route => route.fulfill({json: {
    items: [{id: 1, provider_key: 'authentik', provider_name: 'Authentik', issuer: 'https://identity.example.test', created: '2026-11-01T10:00:00Z'}],
    total: 1,
  }}))
  await page.route('**/api/v2/user/settings/identities/preview', route => route.fulfill({json: {account: 'lisa@example.com'}}))
  await page.route('https://identity.example.test/authorize**', async route => {
    const state = new URL(route.request().url()).searchParams.get('state')!
    const callback = new URL('/auth/openid/gitlab', page.url())
    callback.searchParams.set('code', 'screenshot-code')
    callback.searchParams.set('state', state)
    await route.fulfill({status: 302, headers: {location: callback.href}})
  })

  await page.goto('/user/settings/linked-accounts')
  await expect(page.locator('.card table')).toContainText('Authentik')
  await expect(page.getByRole('button', {name: 'Link GitLab.com', exact: true})).toBeVisible()
  await screenshot('settings-linked-accounts', page.locator('.card').filter({has: page.locator('table')}), {padding: 12, animations: 'disabled'})

  await page.getByRole('button', {name: 'Link GitLab.com', exact: true}).click()
  await expect(page.getByText('lisa@example.com', {exact: true})).toBeVisible()
  await expect(page.locator('#linkIdentityPassword')).toBeVisible()
  await expect(page.getByRole('button', {name: 'Link account', exact: true})).toBeVisible()
  await screenshot('settings-link-account-confirmation', page.locator('form').filter({has: page.locator('#linkIdentityPassword')}), {
    padding: 24,
    animations: 'disabled',
    style: '.api-config { visibility: hidden; }',
  })
})
