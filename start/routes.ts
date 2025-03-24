/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const GetListFileController = () => import('#data/controllers/get_list_file_controller')
const UploadFileController = () => import('#data/controllers/upload_file_controller')
const LogoutUserController = () => import('#data/controllers/logout_controller')
const LoginUserController = () => import('#data/controllers/login_controller')

router
  .group(() => {
    router.get('login', [LoginUserController, 'show']).as('login.show')
    router.post('login', [LoginUserController, 'execute']).as('login.execute')
    router.delete('logout', [LogoutUserController]).as('logout.execute').use(middleware.auth())
  })
  .as('auth')
  .prefix('auth')

router
  .group(() => {
    router.on('/').renderInertia('home').as('index')
    router.post('api/upload', [UploadFileController])
    router.get('api/files', [GetListFileController])
  })
  .use(middleware.auth())
