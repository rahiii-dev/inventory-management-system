export function querySanitizer(query: string): string {
  return query.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}