/**
 * Converts a string to a URL-friendly slug
 * Custom implementation that doesn't rely on Node.js file system APIs
 * 
 * Examples:
 * - "Hello World" -> "hello-world"
 * - "My Merchant Name!" -> "my-merchant-name"
 * - "Test & More" -> "test-more"
 * - "Multiple   Spaces" -> "multiple-spaces"
 * - "Special@#$%^&*()" -> "special"
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}
