import { UserRepository } from '#domain/contracts/repositories/user_repository'
import User from './models/user.js'
import { UserRegisterRequestDto, UserRegisterResponseDto } from '#domain/dto/user_register_dto'
import { UserLoginRequestDto, UserLoginResponseDto } from '#domain/dto/user_login_dto'

export class LucidUserRepositoryImpl implements UserRepository {
  async createUser(payload: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    return await User.create(payload)
  }

  async loginUser(payload: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    return await User.verifyCredentials(payload.email, payload.password)
  }
}
