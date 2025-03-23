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
const LoginUserController = () => import('#data/controllers/login_controller')

router
  .group(() => {
    router.get('login', [LoginUserController, 'show']).as('login.show')
    router.post('login', [LoginUserController, 'execute']).as('login.execute')
  })
  .as('auth')
  .prefix('auth')

router.on('/').renderInertia('home').as('index').use(middleware.auth())
