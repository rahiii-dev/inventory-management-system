export function querySanitizer(query: string): string {
  return query.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}