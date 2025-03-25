import { UserRepository } from '#domain/contracts/repositories/user_repository'
import { UserRegisterRequestDto } from '#domain/dto/user_register_dto'
import { inject } from '@adonisjs/core'

@inject()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}
  generateId(): string {
    return crypto.randomUUID()
  }
  hashPwd(password: string) {
    return password
  }
  handle(payload: UserRegisterRequestDto) {
    return this.userRepository.createUser({
      id: this.generateId(),
      fullName: payload.fullName,
      email: payload.email,
      password: this.hashPwd(payload.password),
    })
  }
}
