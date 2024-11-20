export function stringToBoolean(v: string): boolean {
  return ['1', 'true', 'yes', 'y'].includes(v);
}
