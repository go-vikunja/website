import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {LinkShareFactory} from '../factories/link_sharing'
import {ProjectUserFactory} from '../factories/project_user'
import {TeamFactory} from '../factories/team'
import {TeamMemberFactory} from '../factories/team_member'
import {UserFactory} from '../factories/user'

test.describe('Sharing and teams screenshots', () => {
  test('Three-dot menu with Share option', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    const menuTrigger = page.locator('.project-title-dropdown, .dropdown-trigger, [data-cy="project-menu"]').first()
    if (await menuTrigger.isVisible()) {
      await menuTrigger.click()
      await page.waitForTimeout(300)
    }

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
    const {project, extraUsers} = await createPopulatedProject()

    // Share the project with some users so the sharing table has entries
    await ProjectUserFactory.create(1, {user_id: extraUsers[0].id, project_id: project.id, permission: 1})
    await ProjectUserFactory.create(1, {id: 2, user_id: extraUsers[1].id, project_id: project.id, permission: 0}, false)

    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Crop from top of modal-content down to end of "Shared with these users" section
    // (just before "Shared with these teams")
    const modalContent = page.locator('.modal-content').first()
    const teamsHeading = page.locator('.has-text-weight-bold').filter({hasText: 'Shared with these teams'}).first()

    const modalBox = await modalContent.boundingBox()
    const teamsBox = await teamsHeading.boundingBox()

    if (modalBox && teamsBox) {
      await screenshot('sharing-settings-panel', page, {
        clip: {
          x: modalBox.x - 10,
          y: modalBox.y - 10,
          width: modalBox.width + 20,
          height: teamsBox.y - modalBox.y,  // Stop just before the teams section
        },
      })
    } else {
      await screenshot('sharing-settings-panel', modalContent)
    }

    await page.setViewportSize({width: 1280, height: 900})
  })

  test('Link share creation form', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Click "Create a link share" to show the creation form
    const createButton = page.getByText('Create a link share').first()
    if (await createButton.isVisible()) {
      await createButton.scrollIntoViewIfNeeded()
      await createButton.click()
      await page.waitForTimeout(500)
    }

    // Crop from "Share Links" heading down to the bottom of the modal
    const shareLinksHeading = page.locator('.has-text-weight-bold').filter({hasText: 'Share Links'}).first()
    const modalContent = page.locator('.modal-content').first()

    const headingBox = await shareLinksHeading.boundingBox()
    const modalBox = await modalContent.boundingBox()

    if (headingBox && modalBox) {
      const modalBottom = modalBox.y + modalBox.height
      await screenshot('sharing-link-create', page, {
        clip: {
          x: modalBox.x - 10,
          y: headingBox.y - 10,
          width: modalBox.width + 20,
          height: modalBottom - headingBox.y + 10,
        },
      })
    } else {
      await screenshot('sharing-link-create', modalContent)
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

    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/projects/${project.id}/settings/share`)
    await page.waitForLoadState('networkidle')

    // Crop from "Share Links" heading down to the bottom of the modal
    const shareLinksHeading = page.locator('.has-text-weight-bold').filter({hasText: 'Share Links'}).first()
    const modalContent = page.locator('.modal-content').first()

    if (await shareLinksHeading.isVisible()) {
      await shareLinksHeading.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
    }

    const headingBox = await shareLinksHeading.boundingBox()
    const modalBox = await modalContent.boundingBox()

    if (headingBox && modalBox) {
      const modalBottom = modalBox.y + modalBox.height
      await screenshot('sharing-link-list', page, {
        clip: {
          x: modalBox.x - 10,
          y: headingBox.y - 10,
          width: modalBox.width + 20,
          height: modalBottom - headingBox.y + 10,
        },
      })
    } else {
      await screenshot('sharing-link-list', modalContent)
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

    await page.setViewportSize({width: 1280, height: 1400})

    await page.goto(`/teams/${teams[0].id}/edit`)
    await page.waitForLoadState('networkidle')

    // Crop from top of content down to the "Leave team" button
    const content = page.locator('.app-content').first()
    const leaveButton = page.getByText('Leave team').last()
    const contentBox = await content.boundingBox()

    if (await leaveButton.isVisible() && contentBox) {
      const leaveBox = await leaveButton.boundingBox()
      if (leaveBox) {
        await screenshot('sharing-team-settings', page, {
          clip: {
            x: contentBox.x - 10,
            y: contentBox.y - 10,
            width: contentBox.width + 20,
            height: leaveBox.y + leaveBox.height - contentBox.y + 30,
          },
        })
      } else {
        await screenshot('sharing-team-settings', content)
      }
    } else {
      await screenshot('sharing-team-settings', content)
    }

    await page.setViewportSize({width: 1280, height: 900})
  })
})
