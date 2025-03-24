import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UploadFileUseCase } from '#domain/usecases/upload_file_usecase'

@inject()
export default class UploadFileController {
  constructor(private uploadFileUseCase: UploadFileUseCase) {}
  async handle(ctx: HttpContext) {
    const audio = ctx.request.file('audio')

    if (!audio) {
      return ctx.response.badRequest({ error: 'No file uploaded' })
    }
    const url = await this.uploadFileUseCase.handle(audio)
    return ctx.response.json({ url: url })
  }
}
