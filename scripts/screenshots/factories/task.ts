import {Factory} from '../support/factory'

export class TaskFactory extends Factory {
  static table = 'tasks'

  static factory() {
    return {
      id: '{increment}',
      title: (i: number) => `Task ${i}`,
      done: false,
      project_id: 1,
      created_by_id: 1,
      index: '{increment}',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
