import {Factory} from '../support/factory'

export class TaskReminderFactory extends Factory {
  static table = 'task_reminders'

  static factory() {
    return {
      id: '{increment}',
      task_id: 1,
      reminder: new Date().toISOString(),
      created: new Date().toISOString(),
      relative_to: '',
      relative_period: 0,
    }
  }
}
