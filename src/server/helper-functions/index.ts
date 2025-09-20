export function generateSlug(text: string): string {
  const cleanedText = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^a-z0-9\-]/g, "") // remove non-alphanumeric except hyphens
    .replace(/\-+/g, "-"); // collapse multiple hyphens

  const uniqueId = generateId(6); // you can customize the length
  return `${cleanedText}-${uniqueId.toLowerCase()}`;
}

export function generateId(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
