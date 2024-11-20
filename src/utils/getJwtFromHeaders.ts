import http from 'http';

import { appConfig } from 'src/config.js';
import { arkJwtPayload } from 'src/domains/authentication/schemas.js';

/**
 * Extract the JWT from the request's headers.
 * Does not validate anything.
 */
export function getJwtFromHeaders(req: http.IncomingMessage) {
  const authHeader = req.headers.Authorization;

  if (authHeader === undefined || Array.isArray(authHeader)) {
    return;
  }

  if (!authHeader?.startsWith('Token ')) return;

  const token = authHeader.split(' ')[1];

  if (token === undefined) return;

  return token;
}
