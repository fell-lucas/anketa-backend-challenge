import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { UserError } from './global.exceptions'

/**
 * Hide internal errors from the user. Except for UserError.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof HttpException) {
      status = exception.getStatus()
    }
    let payload: any = {
      statusCode: status,
      message: 'Internal Server Error',
      ...('code' in exception ? { code: exception.code } : {}),
    }

    // Let a custom message only for UserError/HttpException or in development/test:
    if (exception instanceof UserError || exception instanceof HttpException) {
      payload = exception.getResponse()
    } else if (['development', 'test'].includes(process.env.NODE_ENV)) {
      payload = {
        debug: true,
        error: exception.name,
        message: exception.message,
        stack: exception.stack,
        statusCode: status,
      }
    }

    this.logger.error(exception)

    response.status(status).json(payload)
  }
}
