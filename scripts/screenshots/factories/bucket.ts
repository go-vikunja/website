import {Factory} from '../support/factory'

export class BucketFactory extends Factory {
  static table = 'buckets'

  static factory() {
    return {
      id: '{increment}',
      title: (i: number) => `Bucket ${i}`,
      project_view_id: 1,
      created_by_id: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
