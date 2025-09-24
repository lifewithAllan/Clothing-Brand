export type CartItemRequest = {
  jerseyId: number;
  size: string;
  versionSelected: string;
  customName?: string | null;
  customNumber?: string | null;
  quantity?: number;
  leagueName: string;
  // badges selected (persisted) — array of badge names
  badges?: string[];
};

/*export type CartItem = {
  id: string; // UUID string
  jerseyId: number;
  jerseyName: string;
  size: string;
  versionSelected: string;
  customName?: string | null;
  customNumber?: string | null;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  frontImageUrl?: string;
  leagueName?: string;
  badges?: string[];
};*/

export interface CartItem {
  id: number;
  jerseyId: number;
  jerseyName: string;
  frontImageUrl: string;
  sideImageUrl: string;
  backImageUrl: string;

  // selected options
  size: string;
  versionSelected: string;
  leagueName: string;        // ✅ newly added
  badges: string[];          // ✅ newly added
  customName?: string | null;
  customNumber?: string | null;

  // quantity and totals
  quantity: number;
  itemTotal: number;
}