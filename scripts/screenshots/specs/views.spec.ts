import {test, expect} from '../support/fixtures'

test.describe('Views screenshots', () => {
  test('View tabs at the top', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    const tabBar = page.locator('.switch-view').first()
    await expect(tabBar).toBeVisible()
    await screenshot('views-tabs', tabBar, {padding: 10})
  })

  test('List view with tasks', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.tasks')).toBeVisible()

    // Capture the content area (view with switcher, no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-list', content)
  })

  test('Gantt chart view', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    // Fit the whole gantt card.
    await page.setViewportSize({width: 1280, height: 1100})
    await page.goto(`/projects/${project.id}/${views.gantt.id}`)
    await page.waitForLoadState('networkidle')

    // Wait for gantt content to render
    await page.waitForTimeout(1000)

    // Capture the content area (no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-gantt', content)
  })

  test('Table view', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.table.id}`)
    await page.waitForLoadState('networkidle')

    // Capture the content area (no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-table', content)
  })

  test('Kanban board', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    // Wait for kanban to render
    await page.waitForTimeout(500)

    // Capture the content area (no sidebar/header)
    const content = page.locator('.app-content').first()
    await screenshot('views-kanban', content)
  })

  test('List view sort popup', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.list.id}`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.tasks')).toBeVisible()

    // Open the sort popup by clicking the Sort button in the list header.
    const sortButton = page.locator('.filter-container button').filter({hasText: 'Sort'}).first()
    const filtersButton = page.locator('.filter-container button').filter({hasText: /^Filters?$/i}).first()
    await expect(sortButton).toBeVisible()
    await sortButton.click()
    await sortButton.blur()

    // Wait for the popup content to render.
    const sortPopup = page.locator('.sort-popup').first()
    await expect(sortPopup).toBeVisible()

    // Capture a clip that includes the sort button and the popup beneath it.
    const buttonBox = await sortButton.boundingBox()
    const filtersBox = (await filtersButton.boundingBox())!
    const popupBox = await sortPopup.boundingBox()
    if (buttonBox && popupBox) {
      const viewport = page.viewportSize()!
      // No margin: list text sits right next to the popup.
      const left = Math.max(0, Math.min(buttonBox.x, popupBox.x) - 1)
      const top = Math.max(0, buttonBox.y - 20)
      const right = Math.max(
        filtersBox.x + filtersBox.width,
        popupBox.x + popupBox.width,
      ) + 20
      const bottom = popupBox.y + popupBox.height + 2
      await screenshot('views-list-sort-popup', page, {
        clip: {
          x: left,
          y: top,
          width: Math.min(viewport.width - left, right - left),
          height: Math.min(viewport.height - top, bottom - top),
        },
      })
    } else {
      await screenshot('views-list-sort-popup', page)
    }
  })

  test('Kanban bucket three-dot menu', async ({base, authenticatedPage: page, screenshot}) => {
    const {project, views} = base

    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    // Click the three-dot menu on the first bucket
    const bucketMenu = page.locator('.bucket-header .dropdown.options, .bucket-header .options-button').first()
    if (await bucketMenu.isVisible()) {
      await bucketMenu.click()
      await page.waitForTimeout(200)
    }

    // The bucket stretches to the viewport height; stop below its cards and the open menu.
    const bucket = page.locator('.bucket').first()
    const bucketBox = (await bucket.boundingBox())!
    const addBox = (await bucket.getByRole('button', {name: /Add another task/i}).boundingBox())!
    const menuBox = (await bucket.locator('.dropdown-menu').first().boundingBox())!
    const bottom = Math.max(addBox.y + addBox.height, menuBox.y + menuBox.height) + 20
    await screenshot('views-kanban-bucket-menu', page, {
      clip: {x: bucketBox.x - 20, y: bucketBox.y - 20, width: bucketBox.width + 40, height: bottom - bucketBox.y + 20},
    })
  })

  test('Kanban WIP limit exceeded', async ({base, authenticatedPage: page, apiContext, userToken, screenshot}) => {
    const {project, views, buckets} = base
    // To Do holds four tasks, so a limit of three is exceeded.
    const limit = await apiContext.post(`projects/${project.id}/views/${views.kanban.id}/buckets/${buckets[0].id}`, {
      headers: {Authorization: `Bearer ${userToken}`},
      data: {title: buckets[0].title, limit: 3},
    })
    expect(limit.ok(), await limit.text()).toBe(true)

    // Tall enough that the bucket doesn't scroll.
    await page.setViewportSize({width: 1280, height: 1300})
    await page.goto(`/projects/${project.id}/${views.kanban.id}`)
    await page.waitForLoadState('networkidle')

    const bucket = page.locator('.bucket').first()
    await expect(bucket.locator('.bucket-header')).toContainText('4/3')
    // The bucket stretches to the viewport height; stop below its last button.
    const bucketBox = (await bucket.boundingBox())!
    const addBox = (await bucket.getByRole('button', {name: /Add another task/i}).boundingBox())!
    await screenshot('views-kanban-wip-limit', page, {
      clip: {x: bucketBox.x, y: bucketBox.y, width: bucketBox.width, height: addBox.y + addBox.height + 20 - bucketBox.y},
    })
  })
})
