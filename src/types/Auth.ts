export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface RegisterRequest {
  userId: string;
  password: string;
  name: string;
  gender: string;
  phone: string;
  email?: string;
}

export interface CurrentUser {
  userIndex: number;
  userId: string;
  name: string;
  gender: string;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}
