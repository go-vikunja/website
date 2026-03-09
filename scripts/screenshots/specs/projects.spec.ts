import {test, expect} from '../support/fixtures'
import {createPopulatedProject, createDefaultViews} from '../support/seed-helpers'
import {ProjectFactory} from '../factories/project'

test.describe('Projects screenshots', () => {
  test('Context menu with project actions', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Click the three-dot menu on the project to open the dropdown
    const menuTrigger = page.locator('.project-title-dropdown, .dropdown-trigger, [data-cy="project-menu"]').first()
    if (await menuTrigger.isVisible()) {
      await menuTrigger.click()
      await page.waitForTimeout(300)
    }

    // Capture the open dropdown menu
    const dropdown = page.locator('.dropdown.is-active, .dropdown:has(.dropdown-menu.is-active)').first()
    if (await dropdown.isVisible()) {
      await screenshot('projects-context-menu', dropdown)
    } else {
      // Fallback: try capturing any visible dropdown menu
      const menu = page.locator('.dropdown-menu').first()
      if (await menu.isVisible()) {
        await screenshot('projects-context-menu', menu, {padding: 40})
      } else {
        await screenshot('projects-context-menu', page)
      }
    }
  })

  test('Project settings form', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/settings/edit`)
    await page.waitForLoadState('networkidle')

    // Focus on the settings card/form
    const card = page.locator('.card').first()
    if (await card.isVisible()) {
      await screenshot('projects-settings-form', card)
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('projects-settings-form', content)
    }
  })

  test('Project overview page', async ({authenticatedPage: page, screenshot}) => {
    // Create multiple projects — don't visit any first so there are no "last viewed" entries
    const projects = await ProjectFactory.create(4, {
      title: (i: number) => ['Office Move', 'Team Retreat Planning', 'Personal', 'Shared Documents'][i - 1],
    })

    for (let i = 0; i < projects.length; i++) {
      await createDefaultViews(projects[i].id as number, i * 4 + 1, i === 0)
    }

    // Go directly to project overview without visiting any project first
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    await screenshot('projects-overview', page)
  })

  test('Favorite icon on hover', async ({authenticatedPage: page, screenshot}) => {
    const {project, views} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    // Hover over the project in the sidebar to reveal the star
    const sidebarProject = page.locator('.menu-list .list-menu-link').first()
    if (await sidebarProject.isVisible()) {
      await sidebarProject.hover()
      await page.waitForTimeout(200)
    }

    // Capture the sidebar area
    const sidebar = page.locator('.menu-container, .navigation, [data-cy="navigation"]').first()
    if (await sidebar.isVisible()) {
      await screenshot('projects-favorite-icon', sidebar)
    } else {
      await screenshot('projects-favorite-icon', page)
    }
  })

  test('Background image selection dialog', async ({authenticatedPage: page, screenshot}) => {
    const {project} = await createPopulatedProject()

    await page.goto(`/projects/${project.id}/settings/background`)
    await page.waitForLoadState('networkidle')

    // Focus on the card
    const card = page.locator('.card').first()
    if (await card.isVisible()) {
      await screenshot('projects-background-dialog', card)
    } else {
      const content = page.locator('.app-content').first()
      await screenshot('projects-background-dialog', content)
    }
  })
})
