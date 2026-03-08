import {Factory} from '../support/factory'

export class ProjectViewFactory extends Factory {
  static table = 'project_views'

  static factory() {
    return {
      id: '{increment}',
      title: 'List',
      project_id: 1,
      view_kind: 0,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
