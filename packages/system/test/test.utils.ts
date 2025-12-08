// Disable AdminJS import since it requires ESM and will break inside jest:
jest.mock('../../../apps/core/src/libraries/adminjs/adminjs.module.ts', () => ({
  AdminJsModule: null,
}))
import { INestApplication, Type } from '@nestjs/common'
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing'
//import { PrismaClient } from '@prisma/client'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { exec } from 'child_process'
import request from 'supertest'
import { promisify } from 'util'
import createValidationPipe from '../errors/validation.pipe'
import { DB_SERVICE } from '../shared-services/db.service.interface'
import { Seeds } from './seeds.interface'
const execAsync = promisify(exec)

jest.setTimeout(60000)

// Use dummy API key for integrations:
process.env.INTEGRATIONS_API_KEY = 'dummy-api-key'
// Disable AdminJS on tests:
process.env.ADMINJS_ENABLED = 'false'
// Simulate Firebase:
process.env.SIMULATE_FIREBASE = 'true'
// Simulate Cloudinary:
process.env.SIMULATE_CLOUDINARY = 'true'
// Simulate AWS:
process.env.SIMULATE_AWS = 'true'
// Simulate Contracts Blockchain:
process.env.SIMULATE_CONTRACTS = 'true'
// Simulate Stream:
process.env.SIMULATE_STREAM = 'true'
// Simulate Inngest:
process.env.SIMULATE_INNGEST = 'true'

/**
 * Utility class to simplify E2E API testing with NestJS
 */
export class TestUtils {
  public prismaService: any
  public postgresContainer: StartedPostgreSqlContainer
  public app: INestApplication
  public module: TestingModule
  protected moduleOverridesBeforeEach?: (module: TestingModuleBuilder) => void
  protected moduleCreationBeforeEach?: () => TestingModuleBuilder

  constructor(AppModule: any) {
    beforeEach(async () => {
      let moduleBuilder

      if (this.moduleCreationBeforeEach) {
        moduleBuilder = this.moduleCreationBeforeEach()
      } else {
        moduleBuilder = await Test.createTestingModule({
          imports: [AppModule],
        })

        if (this.moduleOverridesBeforeEach) {
          this.moduleOverridesBeforeEach(moduleBuilder)
        }
      }

      this.module = await moduleBuilder.compile()

      this.app = this.module.createNestApplication()
      this.app.useGlobalPipes(createValidationPipe())
      await this.app.init()
    })
    return this
  }

  /**
   * Hook to override the creation of the module before each test, usually done automatically
   *
   * Usage:
   * ```typescript
   * .withModule(() => Test.createTestingModule({
   *   imports: [AppModule],
   * }))
   * ```
   */
  withModule(fn: () => TestingModuleBuilder) {
    this.moduleCreationBeforeEach = fn
    return this
  }

  /**
   * Hook to do any overrides to the module setup
   *
   * Usage:
   * ```typescript
   * .withModuleOverrides((module) => module.overrideProvider(PrismaService).useValue(prismaService))
   * ```
   */
  withModuleOverrides(fn: (module: TestingModuleBuilder) => void) {
    this.moduleOverridesBeforeEach = fn
    return this
  }

  withDatabase(seeds: (new (...args: any[]) => Seeds)[]) {
    beforeAll(async () => {
      // Start postgres  test container:
      this.postgresContainer = await new PostgreSqlContainer(
        'postgres:16-alpine'
      )
        .withExposedPorts(5432)
        .start()
      process.env.DATABASE_URL = this.postgresContainer.getConnectionUri()
    })

    beforeAll(async () => {
      // Create the db schema:
      await execAsync(
        'pnpm prisma migrate reset --skip-generate --skip-seed -f',
        {
          env: process.env,
        }
      )
    })

    beforeEach(async () => {
      // Reset the db content:
      this.prismaService = this.module.get(DB_SERVICE)

      await this.prismaService.$executeRawUnsafe(`
        DO $$
        DECLARE
          tables text;
        BEGIN
          SELECT string_agg('"' || tablename || '"', ', ') INTO tables
          FROM pg_tables
          WHERE schemaname = 'public'
            AND tablename != '_prisma_migrations';
          IF tables IS NOT NULL THEN
            EXECUTE 'TRUNCATE TABLE ' || tables || ' CASCADE';
          END IF;
        END $$;
      `)

      for (const seed of seeds) {
        const seedInstance = this.module.get(seed)
        await seedInstance.seed()
      }
    })

    afterEach(async () => {
      await this.prismaService?.$disconnect()
    })

    afterAll(async () => {
      await this.postgresContainer?.stop()
    })

    return this
  }

  request(user?: any) {
    const req = request.agent(this.app.getHttpServer())
    if (user) {
      req.set('Authorization', `Bearer ${user.token}`)
    }
    req.set('platform-device-id', user?.device?.id || 'test-123')
    req.set('User-Agent', 'test-123')
    return req
  }

  requestWithApiKey() {
    const req = request.agent(this.app.getHttpServer())
    req.set('Authorization', `Bearer ${process.env.INTEGRATIONS_API_KEY}`)
    return req
  }

  get<T>(token: Type<T>) {
    return this.module.get(token)
  }
}

export const expectStatus = (res: any, status: number) => {
  if (res.status !== status) {
    console.error(JSON.stringify(res.body, null, 2))
  }
  expect(res.status).toBe(status)
  return res
}
