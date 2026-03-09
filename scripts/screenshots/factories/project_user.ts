import {Factory} from '../support/factory'

export class ProjectUserFactory extends Factory {
  static table = 'users_projects'

  static factory() {
    return {
      id: '{increment}',
      user_id: 1,
      project_id: 1,
      permission: 0,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
