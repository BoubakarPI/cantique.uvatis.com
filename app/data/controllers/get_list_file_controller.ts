import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { GetListFileUseCase} from "#domain/usecases/get_file_list_usecase";

@inject()
export default class GetListFileController {
  constructor(private getListFileUseCase: GetListFileUseCase) {}
  async handle({ response }: HttpContext) {
    return response.json(await this.getListFileUseCase.handle())
  }
}
