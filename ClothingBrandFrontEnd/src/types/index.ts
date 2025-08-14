export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number; // epoch millis as per backend
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupEmailRequest = {
  email: string;
};

export type SignupCompleteRequest = {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type ValidateConfirmationResponse = {
  email: string;
  expiresAtEpochMillis: number;
};
