import {Factory} from '../support/factory'

export class SavedFilterFactory extends Factory {
  static table = 'saved_filters'

  static factory() {
    return {
      id: '{increment}',
      title: (i: number) => `Filter ${i}`,
      description: '',
      filters: '{"done":false}',
      owner_id: 1,
      is_favorite: false,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
