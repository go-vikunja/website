import {Factory} from '../support/factory'

export class TaskAttachmentFactory extends Factory {
  static table = 'task_attachments'

  static factory() {
    return {
      id: '{increment}',
      task_id: 1,
      file_id: 1,
      created: new Date().toISOString(),
    }
  }
}
