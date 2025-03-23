import { UserRepository } from '#domain/contracts/repositories/user_repository'
import { UserLoginRequestDto } from '#domain/dto/user_login_dto'
import { inject } from '@adonisjs/core'

@inject()
export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}
  hashPwd(password: string) {
    return password
  }
  handle(payload: UserLoginRequestDto) {
    return this.userRepository.login({
      email: payload.email,
      password: this.hashPwd(payload.password),
    })
  }
}
