export type CheckoutRequest = {
  deliveryOption: 'PICKUP' | 'SHIPPING';
  county?: string;
  town?: string;
  phone?: string;
  cartItemIds: string[]; // cart item UUID strings
};
