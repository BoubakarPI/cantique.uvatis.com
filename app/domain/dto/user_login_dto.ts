export interface UserLoginResponseDto {
  id: string
  email: string
  fullName: string
  password: string
}

export interface UserLoginRequestDto {
  email: string
  password: string
}
