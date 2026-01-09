export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    userIndex: number;
    userId: string;
    name: string;
  };
}

export interface RegisterRequest {
  userId: string;
  password: string;
  name: string;
  gender: string;
  phone: string;
  email?: string;
}
