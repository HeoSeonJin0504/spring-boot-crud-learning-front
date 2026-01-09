export interface UserResponseDto {
  id: number;
  name: string;
  gender: string;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRequestDto {
  name: string;
  password: string;
  gender: string;
  phone: string;
  email?: string;
}
