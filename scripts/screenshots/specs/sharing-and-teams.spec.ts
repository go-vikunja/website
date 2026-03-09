import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {LinkShareFactory} from '../factories/link_sharing'
import {TeamFactory} from '../factories/team'
import {TeamMemberFactory} from '../factories/team_member'
import {UserFactory} from '../factories/user'

test.describe('Sharing and teams screenshots', () => {
  test('Three-dot menu with Share option', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Click the project title dropdown trigger / three-dot menu
    const menuTrigger = page.locator('.project-title-dropdown, .dropdown-trigger, [data-cy="project-menu"]').first()
    if (await menuTrigger.isVisible()) {
      await menuTrigger.click()
      await page.waitForTimeout(200)
    }

    const dropdown = page.locator('.dropdown:has(.dropdown-menu)').first()
    await screenshot('sharing-three-dot-menu', dropdown)
  })

  test('Sharing settings panel', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    await screenshot('sharing-settings-panel', page)
  })

  test('Link share creation form', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Look for the link share section and click to create
    const linkShareSection = page.locator('text=Share Links, text=Link Shares').first()
    if (await linkShareSection.isVisible()) {
      await linkShareSection.scrollIntoViewIfNeeded()
    }

    await screenshot('sharing-link-create', page)
  })

  test('Link share management list', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    // Pre-seed some link shares
    await LinkShareFactory.create(2, {
      project_id: project.id,
      shared_by_id: 1,
    })

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    await screenshot('sharing-link-list', page)
  })

  test('Teams page', async ({authenticatedPage: page, screenshot}) => {
    // Create teams with members
    const teams = await TeamFactory.create(2, {
      name: (i: number) => ['Facilities Team', 'Move Coordinators'][i - 1],
      created_by_id: 1,
    })

    const extraUsers = await UserFactory.create(3, {
      id: (i: number) => 300 + i,
      username: (i: number) => ['sarah', 'david', 'emma'][i - 1],
    }, false)

    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: extraUsers[0].id})
    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: extraUsers[1].id}, false)
    await TeamMemberFactory.create(1, {team_id: teams[1].id, user_id: extraUsers[2].id}, false)

    await page.goto('/teams')
    await page.waitForLoadState('networkidle')

    await screenshot('sharing-teams-page', page)
  })

  test('Team settings with member list', async ({authenticatedPage: page, screenshot}) => {
    const teams = await TeamFactory.create(1, {
      name: 'Office Admins',
      created_by_id: 1,
    })

    const extraUsers = await UserFactory.create(2, {
      id: (i: number) => 400 + i,
      username: (i: number) => ['sarah', 'david'][i - 1],
    }, false)

    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: 1, admin: true})
    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: extraUsers[0].id}, false)
    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: extraUsers[1].id}, false)

    await page.goto(`/teams/${teams[0].id}/edit`)
    await page.waitForLoadState('networkidle')

    await screenshot('sharing-team-settings', page)
  })
})
