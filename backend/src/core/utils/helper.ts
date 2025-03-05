export function querySanitizer(query: string): string {
  return query.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalize(str: string): string {
  return str.split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
}