import {test, expect} from '../support/fixtures'
import {createPopulatedProject} from '../support/seed-helpers'
import {LabelFactory} from '../factories/labels'

test.describe('Labels screenshots', () => {
  test('Label overview page', async ({authenticatedPage: page, screenshot}) => {
    await LabelFactory.create(5, {
      created_by_id: 1,
      title: (i: number) => ['Urgent', 'Waiting on others', 'Completed', 'Needs approval', 'Logistics'][i - 1],
      hex_color: (i: number) => ['e8445a', '1973ff', '4caf50', 'ff9800', 'f44336'][i - 1],
    })

    await page.goto('/labels')
    await page.waitForLoadState('networkidle')

    await screenshot('labels-overview', page)
  })

  test('Inline label creation on a task', async ({authenticatedPage: page, screenshot}) => {
    const {tasks} = await createPopulatedProject({withLabels: true})

    await page.goto(`/tasks/${tasks[0].id}`)
    await page.waitForLoadState('networkidle')

    // Click the label section to open inline creation
    const labelSection = page.locator('[data-cy="taskLabels"]').or(page.locator('.task-labels')).or(page.getByText('Labels')).first()
    if (await labelSection.isVisible()) {
      await labelSection.click()
      await page.waitForTimeout(300)
    }

    // Capture the label picker popup area
    const popup = page.locator('.popup.is-open, .multiselect').first()
    if (await popup.isVisible()) {
      await screenshot('labels-inline-create', popup, {padding: 40})
    } else {
      await screenshot('labels-inline-create', labelSection, {padding: 40})
    }
  })
})
