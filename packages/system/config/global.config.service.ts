import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * This is the config for this service, other services will have their own configs
 */
@Injectable()
export class GlobalConfigService extends ConfigService {
  protected environment = this.get('NODE_ENV') || 'development'
  protected isDev =
    this.environment === 'development' || this.environment === 'test'

  // TO be overriden by the service config:
  serviceName = this.get('SERVICE_NAME', 'pollpapa-default')
  // TO be overriden by the service config:
  port = this.get<number>('PORT')

  logger = {
    pretty: this.isDev && process.env.DD_ENABLED !== 'true',
    level: this.isDev ? 'debug' : this.get('LOG_LEVEL') || 'info',
    redactedFields: ['request.headers.authorization'],
    logToFile: this.get('LOG_TO_FILE', 'false') == 'true',
    file: this.get('LOG_TO_FILE')
      ? this.getOrThrow('FILE_LOGS_FOLDER') + '/pollpapa-core.log'
      : '',
  }

  files = {
    useS3: this.get('S3_ENABLED') === 'true',
    s3Bucket: this.get('S3_BUCKET'),
    uploadFolder: this.getOrThrow('FILES_UPLOAD_FOLDER'),
    tempFolder: this.getOrThrow('FILE_TEMP_FOLDER'),
    useLocalStack: this.get('S3_USE_LOCALSTACK') === 'true',
    localStackUrl: this.get('S3_LOCALSTACK_URL'),
  }
}
