export type Product = {
  id: number;
  jerseyName: string;
  season: string;
  kitVersion: string;
  leagueNames: string[];
  sizes: string[];
  descriptionPoints: string[];
  frontImageUrl: string;
  sideImageUrl: string;
  backImageUrl: string;
  basePrice: number;
  discountedPrice?: number | null;
};
