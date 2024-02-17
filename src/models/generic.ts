type Nullable<T> = T | null;
type MaybeUndefined<T> = T | undefined;

interface Point {
  x: number;
  y: number;
}

interface Iterable {
  id: string | number;
}

export type { Nullable, MaybeUndefined, Point, Iterable };
