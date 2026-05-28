import bcrypt from 'bcrypt'

export async function comparePassword(
  password: string,
  hashedPassword: string,
) {
  return bcrypt.compare(password, hashedPassword)
}
