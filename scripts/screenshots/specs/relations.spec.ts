import {test, expect} from '../support/fixtures'

test.describe('Relations screenshots', () => {
  test('Relation type dropdown', async ({base, authenticatedPage: page, screenshot}) => {
    const {tasks} = base

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', {name: 'Add Relation'}).click()
    const relations = page.locator('.task-relations')
    await relations.locator('.task-relation-search-field input').pressSequentially('Notify', {delay: 80})
    // The create option shows up before the debounced search returns existing tasks.
    await relations.locator('.search-results button:not(.is-create-option)').first().click()

    // Native <select> popups don't render in headless screenshots.
    await relations.locator('select').filter({hasText: 'Select a relation kind'}).selectOption({label: 'Blocking'})

    await relations.scrollIntoViewIfNeeded()
    const box = (await relations.boundingBox())!
    // Default padding slices the section heading above.
    await screenshot('relations-type-dropdown', page, {
      clip: {x: box.x - 20, y: box.y - 10, width: box.width + 40, height: box.height + 15},
    })
  })
})
