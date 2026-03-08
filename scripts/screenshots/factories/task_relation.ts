import {Factory} from '../support/factory'

export class TaskRelationFactory extends Factory {
  static table = 'task_relations'

  static factory() {
    return {
      id: '{increment}',
      task_id: 1,
      other_task_id: 2,
      relation_kind: 'related',
      created_by_id: 1,
      created: new Date().toISOString(),
    }
  }
}
