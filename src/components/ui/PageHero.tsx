interface PageHeroProps {
  title: string
  subtitle?: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-primary py-16">
      <div className="container">
        <div className="text-center text-white">
          <div className="gold-line mx-auto mb-4" />
          <h1 className="font-display text-display-lg mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
