import type { ApplicationService } from '@adonisjs/core/types'
import { UserRepository } from '#domain/contracts/repositories/user_repository'
import { LucidUserRepositoryImpl } from '#data/repositories/lucid/user_repository_impl'
import { UploadFileToR2Impl } from '#data/repositories/cloudflare/upload_file_r2_impl'
import { UploadRepository } from '#domain/contracts/repositories/upload_repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.bind(UserRepository, () => new LucidUserRepositoryImpl())
    this.app.container.bind(UploadRepository, () => new UploadFileToR2Impl())
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
