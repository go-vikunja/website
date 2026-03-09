import {test, expect} from '../support/fixtures'
import {LabelFactory} from '../factories/labels'

test.describe('Labels screenshots', () => {
  test('Label overview page', async ({authenticatedPage: page, screenshot}) => {
    await LabelFactory.create(5, {
      created_by_id: 1,
      title: (i: number) => ['Urgent', 'Waiting on others', 'On hold', 'Needs approval', 'Logistics'][i - 1],
      hex_color: (i: number) => ['e8445a', '1973ff', '4caf50', 'ff9800', 'f44336'][i - 1],
    })

    await page.goto('/labels')
    await page.waitForLoadState('networkidle')

    await screenshot('labels-overview', page)
  })
})
