export type Badge = {
  id: number;
  badgeName: string;
};

export type League = {
  id: number;
  leagueName: string;
  fontType: 'CLUB_FONT' | 'LEAGUE_FONT' | 'SPECIAL_FONT';
  badges: Badge[];
};

export type Jersey = {
  id: number;
  jerseyName: string;
  season: string;
  kitVersion: string;
  leagueName: string; // from backend response mapping
  sizes: string[];
  descriptionPoints: string[];
  frontImageUrl: string;
  sideImageUrl: string;
  backImageUrl: string;
  basePrice: number;
  discountedPrice: number | null;
};

// Creation DTO for jersey
export type CreateJerseyRequest = {
  jerseyName: string;
  season: string;
  kitVersion: string;
  leagueId: number;
  sizes: string[];
  descriptionPoints: string[];
  frontImageUrl: string;
  sideImageUrl: string;
  backImageUrl: string;
  basePrice: number;
  discountedPrice?: number | null;
};

export type CreateLeagueRequest = {
  leagueName: string;
  fontType: 'CLUB_FONT' | 'LEAGUE_FONT' | 'SPECIAL_FONT';
  badges: { badgeName: string }[];
};
