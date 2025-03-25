import factory from '@adonisjs/lucid/factories'
import User from '#data/repositories/lucid/models/user'
import { randomUUID } from 'node:crypto'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      id: randomUUID(),
      fullName: faker.person.fullName(),
      email: '',
      password: '',
    }
  })
  .build()
