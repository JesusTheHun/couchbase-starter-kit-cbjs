import { Pretty } from 'src/types/Pretty.js';

export type RequiredProps<T, K extends keyof T> = Pretty<
  Omit<T, K> & Required<Pick<T, K>>
>;
