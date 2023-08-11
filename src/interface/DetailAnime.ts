import { EpsType } from "./Episode";

export interface IDetailAnime {
  type: string;
  title: string;
  englishTitle: string;
  synopsis: string;
  status: string;
  image: string;
  ratings: string;
  animeQuality: string;
  totalEps: string;
  aired: string;
  season: string;
  duration: string;
  country: string;
  adaptation: string;
  genres: string;
  explicit: string;
  demographics: string;
  theme: string;
  scors: string;
  studio: string;
  interested: string;
  ratingText: string;
  credit: string;
  episode: Array<EpsType>;
}
