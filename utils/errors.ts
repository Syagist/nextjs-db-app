export class CustomError extends Error {
  message
  status
  errors = {}

  constructor(
    message: string,
    status: number,
    errors: Record<string, unknown>,
  ) {
    super()
    this.message = message
    this.status = status
    this.errors = errors
  }
}
