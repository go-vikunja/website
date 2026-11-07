import {test, expect} from '../support/fixtures'
import {ProjectUserFactory} from '../factories/project_user'
import {login} from '../support/auth'

test.describe('Search and navigation screenshots', () => {
  test('Global search dialog', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Open global search with Ctrl+K
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    // Type a search query
    const searchInput = page.locator('.modal-content input, [data-cy="searchInput"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('moving')
      await page.waitForTimeout(500)
    }

    // Focus on the modal card
    const modal = page.locator('.modal-content .card, .modal-content').first()
    if (await modal.isVisible()) {
      await screenshot('search-global-dialog', modal)
    } else {
      await screenshot('search-global-dialog', page.locator('.modal-container, .quick-actions').first())
    }
  })

  test('Quick actions for creating', async ({authenticatedPage: page, screenshot}) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.keyboard.press('Control+k')
    const quickActions = page.locator('.card.quick-actions')
    await quickActions.locator('.action-input input').fill('new')
    await expect(quickActions.getByText('New project')).toBeVisible()
    await expect(quickActions.getByText('Order new desk furniture')).toBeVisible()

    await screenshot('search-quick-actions', quickActions)
  })

  test('Notifications dropdown', async ({base, authenticatedPage: page, apiContext, screenshot}) => {
    const {project, tasks, extraUsers} = base
    const sarah = extraUsers[0]
    await ProjectUserFactory.create(1, {user_id: sarah.id, project_id: project.id, permission: 1})

    // Real notifications come from another user acting on Lisa's tasks.
    const {token} = await login(null, apiContext, sarah)
    const headers = {Authorization: `Bearer ${token}`}
    await apiContext.put(`tasks/${tasks[1].id}/assignees`, {headers, data: {user_id: 1}})
    await apiContext.put(`tasks/${tasks[0].id}/assignees`, {headers, data: {user_id: 1}})
    // Assignees get notified about comments.
    const comment = await apiContext.put(`tasks/${tasks[0].id}/comments`, {
      headers,
      data: {comment: '<p>I added the CityMovers quote, can you have a look?</p>'},
    })
    expect(comment.ok(), await comment.text()).toBe(true)

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const notifications = page.locator('.notifications').first()
    await notifications.locator('.trigger-button').click()
    const list = notifications.locator('.notifications-list')
    await expect(list.locator('.single-notification')).toHaveCount(3)

    await screenshot('navigation-notifications', list, {padding: 0})
  })
})
