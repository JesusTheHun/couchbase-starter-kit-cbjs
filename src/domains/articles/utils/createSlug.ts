import slugifyRaw from 'slugify';

import { getRandomId } from 'src/utils/getRandom.js';

const slugify = slugifyRaw as unknown as typeof slugifyRaw.default;

/**
 * Create a slug by concatenating 6 random chars and the title slugified.
 */
export function createSlug(title: string) {
  return (
    getRandomId() +
    '-' +
    slugify(title, {
      lower: true,
      trim: true,
      strict: true,
    }).substring(0, 230)
  );
}
