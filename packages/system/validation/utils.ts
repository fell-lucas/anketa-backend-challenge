export function mapErrors(errors: any[]) {
  return errors.map((error) => {
    let message
    if (error?.constraints) {
      message = error.constraints[Object.keys(error.constraints)[0]]
    } else if (error?.children) {
      message = mapErrors(error.children)
    }
    return {
      property: error.property,
      message,
    }
  })
}
