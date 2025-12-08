import { BadRequestException } from '@nestjs/common'

import { ValidationPipe } from '@nestjs/common'
import { mapErrors } from '../validation/utils'

export default function createValidationPipe() {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,

    exceptionFactory: (errors) => {
      const result = mapErrors(errors)

      return new BadRequestException(result)
    },
  })
}
