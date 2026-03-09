import {Factory} from '../support/factory'

export class LinkShareFactory extends Factory {
  static table = 'link_shares'

  static factory() {
    return {
      id: '{increment}',
      hash: (i: number) => `link-share-hash-${i}`,
      project_id: 1,
      permission: 0,
      sharing_type: 0,
      shared_by_id: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
