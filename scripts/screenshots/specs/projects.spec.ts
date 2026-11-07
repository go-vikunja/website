import {test, expect} from '../support/fixtures'
import {createDefaultViews} from '../support/seed-helpers'
import {ProjectFactory} from '../factories/project'

test.describe('Projects screenshots', () => {
  test('Context menu with project actions', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

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

  test('Project settings form', async ({base, authenticatedPage: page, screenshot}) => {
    const {project} = base

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
    const [shared] = await ProjectFactory.create(1, {id: 4, title: 'Shared Documents'}, false)
    await createDefaultViews(shared.id as number, 13, false)

    // Clear the projectHistory from localStorage to remove "last viewed" section
    // Must be on the app origin to access localStorage
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('projectHistory'))

    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    await screenshot('projects-overview', page)
  })

  test('Favorite icon on hover', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

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

  test('Background image selection dialog', async ({base, authenticatedPage: page, screenshot}) => {
    const {project} = base

    await page.goto(`/projects/${project.id}/settings/background`)
    await page.waitForLoadState('networkidle')

    // Needs Unsplash configured on the instance (see README).
    const card = page.locator('.card').first()
    const thumbnails = card.locator('.image-search__result-item')
    const lastShown = thumbnails.nth(9)
    await expect(lastShown.locator('img')).toBeVisible()
    await card.locator('.image-search__result-item img').evaluateAll(imgs => Promise.all(
      imgs.slice(0, 10).map(img => (img as HTMLImageElement).decode().catch(() => {})),
    ))

    // The result grid runs past the viewport; two rows show the idea.
    const cardBox = (await card.boundingBox())!
    const lastBox = (await lastShown.boundingBox())!
    await screenshot('projects-background-dialog', page, {
      clip: {x: cardBox.x - 20, y: cardBox.y - 20, width: cardBox.width + 40, height: lastBox.y + lastBox.height + 30 - cardBox.y},
    })
  })
})
