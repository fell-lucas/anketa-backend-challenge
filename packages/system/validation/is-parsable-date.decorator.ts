import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

export function IsParsableDate(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'isParsableDate',
      target: target.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (value === null || value === undefined) {
            return true
          }

          if (value instanceof Date) {
            return !Number.isNaN(value.getTime())
          }

          if (typeof value === 'string') {
            const parsed = new Date(value)
            try {
              parsed.toISOString()
            } catch (e) {
              return false
            }
            return (
              !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value
            )
          }
          if (typeof value === 'number') {
            return !Number.isNaN(new Date(value).getTime())
          }

          return false
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid ISO 8601 date string`
        },
      },
    })
  }
}

