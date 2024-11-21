export function epochToIso(epochMs: number) {
  return new Date(epochMs).toISOString();
}
