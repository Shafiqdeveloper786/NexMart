/* Pure utility — no server context needed */
export function deriveDisplayId(mongoId: string): string {
  const num = parseInt(mongoId.slice(18), 16) % 100000;
  return `NX-${num.toString().padStart(5, "0")}`;
}
