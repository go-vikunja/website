import {Factory} from '../support/factory'

export class TaskCommentFactory extends Factory {
  static table = 'task_comments'

  static factory() {
    return {
      id: '{increment}',
      comment: 'This is a comment.',
      author_id: 1,
      task_id: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
