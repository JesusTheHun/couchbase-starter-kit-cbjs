import { UserId } from 'src/database/schemas/ids.js';

export function extractUsername(userId: UserId): string {
  return userId.split('__')[1]!;
}
