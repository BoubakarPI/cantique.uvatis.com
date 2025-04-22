import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UploadFileUseCase } from '#domain/usecases/upload_file_usecase'

@inject()
export default class UploadFileController {
  constructor(private uploadFileUseCase: UploadFileUseCase) {}
  async handle(ctx: HttpContext) {
    const audios = ctx.request.files('audios')

    if (!audios) {
      return ctx.response.badRequest({ error: 'No file uploaded' })
    }
    const urls = await this.uploadFileUseCase.handle(audios)

    return ctx.response.json({ urls: urls })
  }
}
