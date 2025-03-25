import { inject } from '@adonisjs/core'
import { CreateUserUseCase } from '#domain/usecases/create_user_usecase'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RegisterUserController {
  constructor(private userUseCase: CreateUserUseCase) {}
  async handle({ response }: HttpContext) {
    return response.json(
      await this.userUseCase.handle({
        fullName: 'Faker',
        email: 'email',
        password: 'password',
      })
    )
  }
}
