import type {APIRequestContext} from '@playwright/test'

export class Factory {
  static table: string | null = null
  static request: APIRequestContext

  static setRequestContext(request: APIRequestContext) {
    this.request = request
  }

  static factory(): Record<string, unknown> {
    return {}
  }

  static async create(count = 1, override: Record<string, unknown> = {}, truncate = true) {
    const data: Record<string, unknown>[] = []
    for (let i = 1; i <= count; i++) {
      const entry: Record<string, unknown> = {
        ...this.factory(),
        ...override,
      }
      for (const e in entry) {
        if (typeof entry[e] === 'function') {
          entry[e] = (entry[e] as (i: number) => unknown)(i)
          continue
        }
        if (entry[e] === '{increment}') {
          entry[e] = i
        }
      }
      data.push(entry)
    }

    const flatData = data.map(item => {
      const flatItem: Record<string, unknown> = {}
      for (const key in item) {
        const value = item[key]
        if (value === null || value === undefined ||
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value instanceof Date) {
          flatItem[key] = value
        }
      }
      return flatItem
    })

    await this.seed(this.table!, flatData, truncate)
    return Promise.resolve(data)
  }

  static async seed(table: string, data: unknown, truncate = true) {
    if (data === null) data = []
    const response = await this.request.patch(
      `test/${table}?truncate=${truncate ? 'true' : 'false'}`,
      {
        data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.VIKUNJA_SERVICE_TESTINGTOKEN || 'averyLongSecretToSe33dtheDB',
        },
      },
    )
    if (!response.ok()) {
      const body = await response.json()
      throw new Error(`Failed to seed ${table} (${response.status()}): ${body.message}`)
    }
    return response.json()
  }

  static async truncate() {
    await this.seed(this.table!, null)
  }
}
