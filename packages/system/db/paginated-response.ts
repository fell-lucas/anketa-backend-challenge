export class PaginatedResponse<T> {
  data: T[]
  meta: {
    nextCursor: string
  }
}
