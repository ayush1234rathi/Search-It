export interface ShowType {
  id: number;
  name: string;
  thumbnail: string;
  image: string;
  genres: string[];
  summary: string;
  rating: number;
  score?: number;
  cast?: CastType[];
}

export type ShowNormalizedType = { [key: number]: ShowType };

export interface CastType {
  id: number;
  name: string;
  thumbnail: string;
  image: string;
}

export type CastNormalizedType = { [key: number]: CastType };

export type shows_cast = {
  [key: number]: number[];
};
