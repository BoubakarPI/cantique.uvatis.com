import type { HttpContext } from '@adonisjs/core/http'
import { RegisterUserValidator } from '#auth/data/validators/register_user_validator'
import { RegisterUserUseCase } from '#auth/domain/usercases/register_user_usecase'
import { inject } from '@adonisjs/core'

@inject()
export default class RegisterUserController {
  constructor(private userUseCase: RegisterUserUseCase) {}
  async execute({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(RegisterUserValidator)

    const user = await this.userUseCase.handle(payload)
    await auth.use('web').login(user)
    await this.sendActivateEmailOtpUseCase.handle(user)
    return response.redirect().toRoute('activate.get')
  }
  async show({ inertia, request }: HttpContext) {
    return inertia.render('auth/register')
  }
}
