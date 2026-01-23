import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'cream' | 'primary'
  padding?: 'sm' | 'md' | 'lg'
}

const backgroundStyles = {
  white: 'bg-white',
  cream: 'bg-cream',
  primary: 'bg-primary text-white',
}

const paddingStyles = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
}

export function Section({
  children,
  className = '',
  background = 'white',
  padding = 'md',
}: SectionProps) {
  return (
    <section className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}>
      <div className="container">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, subtitle, centered = true, className = '' }: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-8 ${className}`}>
      <h2 className="font-display text-display-md text-primary mb-4">{title}</h2>
      {subtitle && (
        <p className="text-text-light max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}
