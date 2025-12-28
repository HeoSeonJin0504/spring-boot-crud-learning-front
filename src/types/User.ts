export interface UserResponseDto {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRequestDto {
  email: string;
  password: string;
  name: string;
}
