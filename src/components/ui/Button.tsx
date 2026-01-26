import Link from 'next/link'
import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  as?: 'button'
  href?: never
}

interface ButtonAsLink extends ButtonBaseProps {
  as: 'link'
  href: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-primary hover:bg-accent/90 focus:ring-accent/50',
  secondary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
  ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/50',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2'
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (props.as === 'link') {
    return (
      <Link href={props.href} className={styles}>
        {children}
      </Link>
    )
  }

  const { as: _as, ...buttonProps } = props as ButtonAsButton
  return (
    <button className={styles} {...buttonProps}>
      {children}
    </button>
  )
}
