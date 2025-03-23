import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { LoginUserUseCase } from '#domain/usecases/login_user_usecase'
import { LoginUserValidator } from '#data/validators/login_user_validator'

@inject()
export default class LoginUserController {
  constructor(private userUseCase: LoginUserUseCase) {}

  async execute({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(LoginUserValidator)
    const user = await this.userUseCase.handle(payload)

    await auth.use('web').login(user)
    return response.redirect().toRoute('index')
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }
}
