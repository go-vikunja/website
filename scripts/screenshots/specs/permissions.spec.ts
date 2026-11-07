import {test, expect} from '../support/fixtures'
import {Factory} from '../support/factory'
import {ProjectUserFactory} from '../factories/project_user'
import {TeamFactory} from '../factories/team'
import {TeamMemberFactory} from '../factories/team_member'
import {LinkShareFactory} from '../factories/link_sharing'

test.describe('Permissions screenshots', () => {
  // The full sharing dialog is taller than the default viewport.
  test.use({viewport: {width: 1280, height: 1600}})

  test('Permission levels in sharing dialog', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, extraUsers} = base

    // One share per permission level: read only, read & write, admin.
    await ProjectUserFactory.create(3, {
      user_id: (i: number) => extraUsers[i - 1].id,
      project_id: project.id,
      permission: (i: number) => i - 1,
    })
    const [team] = await TeamFactory.create(1, {name: 'Office Admins'})
    await TeamMemberFactory.create(1, {team_id: team.id, user_id: 1, admin: true})
    const now = new Date().toISOString()
    await Factory.seed('team_projects', [{id: 1, team_id: team.id, project_id: project.id, permission: 1, created: now, updated: now}])
    await LinkShareFactory.create(1, {project_id: project.id, shared_by_id: 1, permission: 0})

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    const modal = page.locator('.modal-content .card').first()
    await expect(modal.getByText('Emma Thompson')).toBeVisible()
    await expect(modal.getByText('Office Admins')).toBeVisible()
    await expect(modal.getByText(/Shared by/)).toBeVisible()

    await screenshot('permissions-dropdown', modal)
  })
})
