export type Product = {
  id: number;
  jerseyName: string;
  season: string;
  kitVersion: string;
  leagueName?: string | null;
  sizes: string[];
  descriptionPoints: string[];
  frontImageUrl: string;
  sideImageUrl: string;
  backImageUrl: string;
  basePrice: number;
  discountedPrice?: number | null;
};
