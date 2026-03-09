import {Factory} from '../support/factory'

export class TaskBucketFactory extends Factory {
  static table = 'task_buckets'

  static factory() {
    return {
      task_id: 1,
      bucket_id: 1,
      project_view_id: 1,
    }
  }
}
