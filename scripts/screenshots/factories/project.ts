import {Factory} from '../support/factory'

export class ProjectFactory extends Factory {
  static table = 'projects'

  static factory() {
    return {
      id: '{increment}',
      title: (i: number) => `Project ${i}`,
      owner_id: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
