import { UserId } from 'src/database/models/ids.js';

export function extractUsername(userId: UserId): string {
  return userId.split('__')[1]!;
}
