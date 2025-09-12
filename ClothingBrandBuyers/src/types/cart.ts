export type CartItemRequest = {
  jerseyId: number;
  size: string;
  versionSelected: string;
  customName?: string | null;
  customNumber?: string | null;
  quantity?: number;
  // badges selected (persisted) — array of badge names
  badges?: string[];
};

export type CartItem = {
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
  badges?: string[];
};
