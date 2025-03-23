export interface UserRegisterResponseDto {
  id: string
  email: string
  fullName: string
  password: string
}

export interface UserRegisterRequestDto {
  email: string
  fullName: string
  password: string
}
