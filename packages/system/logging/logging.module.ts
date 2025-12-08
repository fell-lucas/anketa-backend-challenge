import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import * as path from 'path'
import { AppConfigService } from '../../../apps/core/src/libraries/config/app.config.service'

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => {
        const config: any = {
          pinoHttp: {
            level: configService.logger.level,

            redact: configService.logger.redactedFields,
            customProps: (req, res) => ({
              context: 'HTTP', // Default context
              url: req.url,
              method: req.method,
              statusCode: res.statusCode,
            }),
            hooks: {
              // This hook merge any second argument of a log() call with the context object
              logMethod(inputArgs, method, level) {
                if (level != 50 && inputArgs.length >= 3) {
                  const arg1 = inputArgs.shift()
                  const arg2 = inputArgs.shift()
                  const arg3 = inputArgs.shift()
                  const newContext = { ...arg1, ...arg3 }
                  return method.apply(this, [newContext, arg2, ...inputArgs])
                }
                return method.apply(this, inputArgs)
              },
            },
          },
        }

        if (configService.logger.pretty) {
          if (!config.pinoHttp.transport) {
            config.pinoHttp.transport = { targets: [] }
          }
          config.pinoHttp.transport.targets.push({
            target: 'pino-pretty',
            level: configService.logger.level,
            options: {
              singleLine: true,
              colorize: true,
              ignore: 'pid,req,res,hostname,context',
              messageFormat: '[{context}] {msg}',
            },
          })
        }

        if (configService.logger.logToFile) {
          if (!config.pinoHttp.transport) {
            config.pinoHttp.transport = { targets: [] }
          }
          config.pinoHttp.transport.targets.push({
            target: path.join(__dirname, 'logger.rotatingTransport.js'),
            options: {
              filename: path.basename(configService.logger.file), // Required
              path: path.dirname(configService.logger.file), // Required
              size: '10M', // rotate every 10 MegaBytes written
              interval: '1d',
            },
          })
        }

        return config
      },
    }),
  ],
  providers: [LoggerModule],
  exports: [LoggerModule],
})
export class PollpapaLoggerModule {}
