import { resend } from '../../lib/resend.js'

export const sendResetPasswordEmail = async (
  email: string,
  resetUrl: string,
) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your Covo password',
    html: `
      <h2>Reset your password</h2>

      <p>Click the link below to reset your password.</p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    `,
  })
}
