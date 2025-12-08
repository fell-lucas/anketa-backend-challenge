export class PaginationUtils {
  static parseCursor(cursor?: string): { id: string } | undefined {
    if (!cursor) return undefined;
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch (e) {
      return undefined;
    }
  }

  static createCursor<T extends { id: string }>(
    items: T[],
    take: number,
  ): string | null {
    if (items.length === 0) return null;
    if (items.length <= take) return null;

    const last = Math.min(take - 1, items.length - 1);
    const item = items[last];
    const cursor = { id: item.id };
    return Buffer.from(JSON.stringify(cursor))
      .toString('base64')
      .replace(/=+$/, '');
  }

  static getPaginationQuery(cursor?: string, take = 24) {
    const parsedCursor = this.parseCursor(cursor);
    return {
      take: take + 1,
      skip: parsedCursor ? 1 : 0,
      cursor: parsedCursor ? { id: parsedCursor.id } : undefined,
    };
  }
}
