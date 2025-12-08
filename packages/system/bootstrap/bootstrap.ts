// must come before importing any instrumented module:
import '../logging/instrumentation'
// end
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PrismaExceptionFilter } from '@repo/system/db/prisma.exception.filter'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import { GlobalExceptionFilter } from '../errors/global.exception.filter'
import createValidationPipe from '../errors/validation.pipe'
import { CONFIG_SERVICE } from '../shared-services/config.service.interface'

export async function bootstrap(AppModule) {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const logger = app.get(Logger)
  app.useLogger(logger)
  app.useGlobalInterceptors(new LoggerErrorInterceptor())
  app.useGlobalPipes(createValidationPipe())
  app.useGlobalFilters(new PrismaExceptionFilter())
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.enableCors({ origin: '*' }) // TODO: restrict to specific domains in env

  const configService = app.get(CONFIG_SERVICE)
  const port = configService.port
  if (!port) {
    logger.error('No port configured, exiting', 'Bootstrap')
    console.error('No port configured')
    process.exit(1)
  }

  process.on('unhandledRejection', (reason: Error) => {
    // todo: send dd metrics
    logger.error(`Unhandled Rejection: ${reason?.message}`)
    logger.error(reason)
  })

  process.on('uncaughtException', (err, origin) => {
    // ReferenceError, TypeError, etc
    // todo: send dd metrics
    logger.error(
      { error: err },
      `Caught unhandled exception: ${err?.message}, Exception origin: ${origin}`
    )
    logger.error(err)
  })

  // NB: Swagger is also enabled on prod:
  if (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development' ||
    process.env.SWAGGER_ENABLED
  ) {
    const config = new DocumentBuilder()
      .setTitle('Pollpapa Core')
      .setDescription('The API description')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .addGlobalParameters({
        in: 'header',
        required: false,
        name: 'platform-device-id',
        example: 'test-123',
        schema: {
          example: 'test-123',
        },
      })
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
  }

  logger.log({ port }, '🚀 Starting app', 'Bootstrap')
  console.log(`🚀 Starting app on port ${port}`)

  await app.listen(port)
}
