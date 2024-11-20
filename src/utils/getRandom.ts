/**
 * Return a random string.
 * This is NOT crypto secure.
 */
export function getRandomId() {
  return Math.random().toString(16).substring(2, 8);
}

export function getRandomUsername() {
  return 'username' + getRandomId();
}

export function getRandomEmail() {
  return `email${getRandomId()}@test.com`;
}
