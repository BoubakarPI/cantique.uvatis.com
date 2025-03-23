import vine from '@vinejs/vine'

export const RegisterUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(5),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
  })
)
