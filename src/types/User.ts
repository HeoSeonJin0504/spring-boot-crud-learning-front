export interface UserResponseDto {
  userIndex: number;
  userId: string;
  name: string;
  gender: string;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRequestDto {
  userId: string;
  password: string;
  name: string;
  gender: string;
  phone: string;
  email?: string;
}
