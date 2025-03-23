import { UserRegisterRequestDto, UserRegisterResponseDto } from '#domain/dto/user_register_dto'
import { UserLoginRequestDto, } from '#domain/dto/user_login_dto'

export abstract class UserRepository {
  abstract createUser(user: UserRegisterRequestDto): Promise<UserRegisterResponseDto>
  abstract loginUser(user: UserLoginRequestDto): any //Promise<UserLoginResponseDto>
}
