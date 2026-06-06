import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { passwordRules } from '../schemas/passwordSchema'

export function PasswordStrengthIndicator({
  password = '',
  className,
}: {
  password?: string
  className?: string
}) {
  const hasStartedTyping = password.length > 0

  const rules = passwordRules.map((rule) => ({
    label: rule.label,
    met: rule.test(password),
  }))

  const metRules = rules.filter((rule) => rule.met).length

  const strength = metRules <= 2 ? 'Weak' : metRules <= 4 ? 'Good' : 'Strong'

  return (
    <div className={cn('mt-3 space-y-3', className)}>
      {hasStartedTyping && (
        <div className='space-y-1'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>Password strength</span>
            <span
              className={cn(
                metRules <= 2 && 'text-destructive',
                metRules > 2 && metRules < 5 && 'text-yellow-500',
                metRules === 5 && 'text-green-600',
              )}
            >
              {strength}
            </span>
          </div>

          <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
            <div
              className={cn(
                'h-full transition-all',
                metRules <= 2 && 'w-2/5 bg-destructive',
                metRules > 2 && metRules < 5 && 'w-4/5 bg-yellow-500',
                metRules === 5 && 'w-full bg-green-600',
              )}
            />
          </div>
        </div>
      )}

      <div className='flex flex-col gap-2 text-sm'>
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={cn(
              'flex items-center gap-2 transition-colors',
              rule.met
                ? 'text-green-600 dark:text-green-500'
                : hasStartedTyping
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground',
            )}
          >
            {rule.met ? (
              <Check className='size-3.5' />
            ) : (
              <Circle className='size-3.5' />
            )}

            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
