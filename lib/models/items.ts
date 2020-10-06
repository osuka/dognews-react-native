// Article/News data structure types

export type NewsItemRating = {
  rating: number;
  date: string;
};

export type Item = {
  id: string; // unique id (hash of url but could be something else in the future)
  url: string;
  title: string;
  description?: string;
  body?: string;
  summary?: string;
  ratings: any; // TODO: better way to store? rn we add properties that are userid mapped to rating
  thumbnail?: string;
  image?: string;
  sentiment?: string;
};
