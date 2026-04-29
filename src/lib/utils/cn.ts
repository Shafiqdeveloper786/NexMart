/**
 * Utility function to merge Tailwind CSS classes
 * Handles conflicts between Tailwind classes properly
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((c) => typeof c === "string")
    .join(" ")
    .split(" ")
    .filter(Boolean)
    .join(" ");
}
