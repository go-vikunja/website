import {test, expect} from '../support/fixtures'
import {ProjectFactory} from '../factories/project'
import {TaskFactory} from '../factories/task'
import {UserFactory} from '../factories/user'
import {createDefaultViews} from '../support/seed-helpers'
import type {Page} from '@playwright/test'

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString()
}

async function dialogClip(page: Page) {
  const header = await page.locator('dialog .modal-header').boundingBox()
  const actions = await page.locator('dialog .actions').boundingBox()
  expect(header).not.toBeNull()
  expect(actions).not.toBeNull()
  return {x: header!.x - 20, y: header!.y - 20, width: header!.width + 40, height: actions!.y + actions!.height - header!.y + 40}
}

test.describe('Trash screenshots', () => {
  test('Deleted tasks and empty trash confirmation', async ({authenticatedPage: page, screenshot}) => {
    await ProjectFactory.create(1, {title: 'Office Move'})
    await createDefaultViews(1)
    await UserFactory.create(1, {id: 2, username: 'sarah', name: 'Sarah Miller'}, false)
    await TaskFactory.create(4, {
      title: (i: number) => ['Get quotes from moving companies', 'Order new desk furniture', 'Pack shared kitchen supplies', 'Hand in old office keys'][i - 1],
      deleted_at: (i: number) => daysAgo(i * 3),
      deleted_by_id: (i: number) => i === 2 ? 2 : 1,
    })

    await page.goto('/trash/tasks')
    await expect(page.locator('[data-cy="trashedTask"]')).toHaveCount(4)
    await expect(page.getByText(/Deleted by Sarah Miller/)).toBeVisible()
    await screenshot('trash-tasks', page, {animations: 'disabled'})

    await page.locator('[data-cy="emptyTaskTrash"]').click()
    await expect(page.locator('[data-cy="emptyTrashText"]')).toContainText('4 tasks')
    await expect(page.locator('[data-cy="emptyTrashIncludeOthers"]')).toBeVisible()
    await screenshot('trash-empty-confirmation', page, {clip: await dialogClip(page), animations: 'disabled'})
  })

  test('Deleted projects with expanded sub-projects', async ({authenticatedPage: page, screenshot}) => {
    await ProjectFactory.create(4, {
      title: (i: number) => ['Office Move', 'Furniture', 'IT Setup', 'Team Retreat Planning'][i - 1],
      parent_project_id: (i: number) => i === 2 || i === 3 ? 1 : 0,
      deleted_at: daysAgo(5),
      deleted_by_id: 1,
    })
    await TaskFactory.truncate()

    await page.goto('/trash/projects')
    await expect(page.locator('[data-cy="trashedProject"]')).toHaveCount(2)
    await page.locator('[data-cy="toggleTrashedSubProjects"]').click()
    await expect(page.locator('[data-cy="trashedSubProjects"]')).toContainText('IT Setup')
    await screenshot('trash-projects', page, {animations: 'disabled'})
  })

  test('Task deletion undo and deleted task notice', async ({authenticatedPage: page, screenshot}) => {
    await ProjectFactory.create(1, {title: 'Office Move'})
    const views = await createDefaultViews(1)
    await TaskFactory.create(3, {
      title: (i: number) => ['Get quotes from moving companies', 'Order new desk furniture', 'Pack shared kitchen supplies'][i - 1],
    })

    await page.goto(`/projects/1/${views.list.id}`)
    await page.locator('.tasks .task').filter({hasText: 'Get quotes from moving companies'}).getByRole('link').first().click()
    await page.locator('.task-view .action-buttons .button').filter({hasText: 'Delete', hasNotText: 'Duplicate'}).click()
    const notification = page.locator('.global-notification').filter({hasText: 'The task has been moved to the trash.'})
    await expect(notification.getByRole('button', {name: 'Undo'})).toBeVisible()
    await screenshot('trash-task-undo', notification, {animations: 'disabled'})

    await page.goto('/tasks/1')
    const notice = page.locator('[data-cy="taskInTrashNotice"]')
    await expect(notice.getByRole('button', {name: 'Restore', exact: true})).toBeVisible()
    await screenshot('trash-task-notice', notice, {animations: 'disabled'})
  })

  test('Project deletion confirmation with sub-project counts', async ({authenticatedPage: page, screenshot}) => {
    await ProjectFactory.create(3, {
      title: (i: number) => ['Office Move', 'Furniture', 'IT Setup'][i - 1],
      parent_project_id: (i: number) => i > 1 ? 1 : 0,
    })
    const views = await createDefaultViews(1)
    await TaskFactory.create(14, {project_id: (i: number) => (i % 3) + 1})

    await page.goto(`/projects/1/${views.list.id}`)
    await page.goto('/projects/1/settings/delete')
    await expect(page.locator('[data-cy="projectDeleteNotice"]')).toContainText('2 sub-projects and 14 tasks')
    await screenshot('projects-delete-confirmation', page, {clip: await dialogClip(page), animations: 'disabled'})
  })
})
