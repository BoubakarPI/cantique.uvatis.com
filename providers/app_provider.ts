import type { ApplicationService } from '@adonisjs/core/types'
import { UserRepository } from '#domain/contracts/repositories/user_repository'
import { LucidUserRepositoryImpl } from '#data/repositories/lucid/user_repository_impl'

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
