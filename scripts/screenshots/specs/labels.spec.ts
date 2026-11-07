import {test, expect} from '../support/fixtures'
import {LabelFactory} from '../factories/labels'

test.describe('Labels screenshots', () => {
  test('Label overview page', async ({authenticatedPage: page, screenshot}) => {
    await LabelFactory.create(1, {id: 5, title: 'Logistics', hex_color: 'f44336', created_by_id: 1}, false)

    await page.goto('/labels')
    await page.waitForLoadState('networkidle')

    await screenshot('labels-overview', page)
  })
})
