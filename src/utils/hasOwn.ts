type HasOwn<T, K extends PropertyKey> = [Extract<T, { [key in K]: unknown }>] extends [
  never,
]
  ? T & Record<K, unknown>
  : Extract<T, { [key in K]: unknown }>;

export function hasOwn<T, K extends PropertyKey>(obj: T, prop: K): obj is HasOwn<T, K> {
  if (typeof obj !== 'object' || obj === null) return false;
  return Object.hasOwn(obj, prop);
}
