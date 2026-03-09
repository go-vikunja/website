import {Factory} from '../support/factory'

export class LabelFactory extends Factory {
  static table = 'labels'

  static factory() {
    return {
      id: '{increment}',
      title: (i: number) => `Label ${i}`,
      description: '',
      hex_color: '4caf50',
      created_by_id: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
