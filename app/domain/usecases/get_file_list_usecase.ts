import { inject } from '@adonisjs/core'
import { UploadRepository } from '#domain/contracts/repositories/upload_repository'
import { GetFileListItemDto } from '#data/types/fetch_item_interface'

@inject()
export class GetListFileUseCase {
  constructor(private uploadRepository: UploadRepository) {}
  handle(): Promise<GetFileListItemDto[]> {
    return this.uploadRepository.getFileList()
  }
}
