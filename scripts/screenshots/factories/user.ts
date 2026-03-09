import {Factory} from '../support/factory'
import {TEST_PASSWORD_HASH} from '../support/constants'

export class UserFactory extends Factory {
  static table = 'users'

  static factory() {
    return {
      id: '{increment}',
      username: (i: number) => `user${i}`,
      name: '',
      password: TEST_PASSWORD_HASH,
      status: 0,
      issuer: 'local',
      language: 'en',
      avatar_provider: 'marble',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }
  }
}
