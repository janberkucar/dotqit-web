export interface LoginRequestDto {
  email: string;
  password: string;
}
export interface UserDto {
  id: string;
  name: string;
  email: string;
}
export interface LoginResponseDto {
  accessToken: string;
  user: UserDto;
}
