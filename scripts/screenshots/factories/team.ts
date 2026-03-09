import {Factory} from '../support/factory'

export class TeamFactory extends Factory {
  static table = 'teams'

  static factory() {
    return {
      id: '{increment}',
      name: (i: number) => `Team ${i}`,
      created_by_id: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
