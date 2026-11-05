import { buildSearchIndex, searchIndexResponse } from '../../helpers/search-index'

export async function GET() {
  return searchIndexResponse(await buildSearchIndex('en'))
}
