import { UserRegisterRequestDto, UserRegisterResponseDto } from '#domain/dto/user_register_dto'
import { UserLoginRequestDto, UserLoginResponseDto } from '#domain/dto/user_login_dto'

export abstract class UserRepository {
  abstract createUser(user: {
    id: any
    fullName: string
    email: string
    password: string
  }): Promise<UserRegisterResponseDto[]>
  abstract loginUser(user: UserLoginRequestDto): Promise<UserLoginResponseDto[]>
}
