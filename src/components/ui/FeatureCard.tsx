import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`text-center p-6 bg-cream rounded-lg ${className}`}>
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
        {typeof icon === 'string' ? (
          <span className="text-3xl">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <h4 className="font-semibold text-primary mb-2">{title}</h4>
      <p className="text-sm text-text-light">{description}</p>
    </div>
  )
}
