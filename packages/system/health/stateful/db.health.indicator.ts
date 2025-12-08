import { Injectable } from '@nestjs/common'
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus'

@Injectable()
export class DbHealthCheckIndicator extends HealthIndicator {
  constructor() {
    super()
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      //const conn = this.entityManager.getConnection()
      //await conn.getDb().command({ ping: 1 }, { maxTimeMS: 1000 })

      return this.getStatus(key, true)
    } catch (error) {
      const status = this.getStatus(key, false)
      throw new HealthCheckError('MongoDB Health check failed', status)
    }
  }
}
