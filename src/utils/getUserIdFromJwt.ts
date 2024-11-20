import jwt from 'jsonwebtoken';

import { appConfig } from 'src/config.js';
import { UserId } from 'src/database/models/ids.js';
import { arkJwtPayload } from 'src/domains/authentication/schemas.js';

export function getUserIdFromJwt(token: string): UserId | undefined {
  const payload = jwt.verify(token, appConfig.JWT_SECRET);

  return arkJwtPayload.assert(payload).userId;
}
