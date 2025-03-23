import vine from '@vinejs/vine'

export const LoginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
  })
)
