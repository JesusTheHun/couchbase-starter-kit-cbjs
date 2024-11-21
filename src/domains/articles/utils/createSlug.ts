import slugifyRaw from 'slugify';

const slugify = slugifyRaw as unknown as typeof slugifyRaw.default;

export function createSlug(title: string) {
  return slugify(title, {
    lower: true,
    trim: true,
    strict: true,
  }).substring(0, 240);
}
