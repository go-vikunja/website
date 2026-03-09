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

    // Click the project title dropdown trigger / three-dot menu to open it
    const menuTrigger = page.locator('.project-title-dropdown, .dropdown-trigger, [data-cy="project-menu"]').first()
    if (await menuTrigger.isVisible()) {
      await menuTrigger.click()
      await page.waitForTimeout(300)
    }

    // Capture the open dropdown
    const dropdown = page.locator('.dropdown.is-active, .dropdown:has(.dropdown-menu.is-active)').first()
    if (await dropdown.isVisible()) {
      await screenshot('sharing-three-dot-menu', dropdown)
    } else {
      const menu = page.locator('.dropdown-menu').first()
      if (await menu.isVisible()) {
        await screenshot('sharing-three-dot-menu', menu, {padding: 40})
      } else {
        await screenshot('sharing-three-dot-menu', page)
      }
    }
  })

  test('Sharing settings panel', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Focus on the modal/card content
    const card = page.locator('.card').first()
    if (await card.isVisible()) {
      await screenshot('sharing-settings-panel', card)
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('sharing-settings-panel', content)
    }
  })

  test('Link share creation form', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    // Use taller viewport so the link share section is fully visible
    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Scroll to and focus on the link share section heading
    const linkShareHeading = page.getByText('Share Links').or(page.getByText('Link Shares')).first()
    if (await linkShareHeading.isVisible()) {
      await linkShareHeading.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
    }

    // Capture the link share form area — find the section from the heading downward
    // The link share area is typically a distinct section within the card
    const linkShareSection = page.locator('.link-shares, .link-sharing').first()
    if (await linkShareSection.isVisible()) {
      await screenshot('sharing-link-create', linkShareSection, {padding: 20})
    } else {
      // Fallback: capture from the heading with generous padding
      if (await linkShareHeading.isVisible()) {
        await screenshot('sharing-link-create', linkShareHeading, {padding: 200})
      } else {
        const card = page.locator('.card').first()
        await screenshot('sharing-link-create', card)
      }
    }

    await page.setViewportSize({width: 1280, height: 900})
  })

  test('Link share management list', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    // Pre-seed some link shares
    await LinkShareFactory.create(2, {
      project_id: project.id,
      shared_by_id: 1,
    })

    // Use taller viewport so the link share section is fully visible
    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Scroll to the link share section
    const linkShareHeading = page.getByText('Share Links').or(page.getByText('Link Shares')).first()
    if (await linkShareHeading.isVisible()) {
      await linkShareHeading.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
    }

    // Capture the link share section
    const linkShareSection = page.locator('.link-shares, .link-sharing').first()
    if (await linkShareSection.isVisible()) {
      await screenshot('sharing-link-list', linkShareSection, {padding: 20})
    } else {
      if (await linkShareHeading.isVisible()) {
        await screenshot('sharing-link-list', linkShareHeading, {padding: 200})
      } else {
        const card = page.locator('.card').first()
        await screenshot('sharing-link-list', card)
      }
    }

    await page.setViewportSize({width: 1280, height: 900})
  })

  test('Team settings with member list', async ({authenticatedPage: page, screenshot}) => {
    const teams = await TeamFactory.create(1, {
      name: 'Office Admins',
      created_by_id: 1,
    })

    const extraUsers = await UserFactory.create(3, {
      id: (i: number) => 400 + i,
      username: (i: number) => ['sarah', 'david', 'emma'][i - 1],
      name: (i: number) => ['Sarah Miller', 'David Park', 'Emma Thompson'][i - 1],
    }, false)

    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: 1, admin: true})
    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: extraUsers[0].id}, false)
    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: extraUsers[1].id}, false)
    await TeamMemberFactory.create(1, {team_id: teams[0].id, user_id: extraUsers[2].id}, false)

    // Increase viewport so all team members and cards are fully visible
    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/teams/${teams[0].id}/edit`)
    await page.waitForLoadState('networkidle')

    const content = page.locator('.app-content').first()
    await screenshot('sharing-team-settings', content)

    await page.setViewportSize({width: 1280, height: 900})
  })
})
