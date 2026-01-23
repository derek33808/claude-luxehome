import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  region: string
}

export function Breadcrumb({ items, region }: BreadcrumbProps) {
  return (
    <nav className="bg-cream py-4">
      <div className="container">
        <ol className="flex items-center gap-2 text-sm text-text-light">
          <li>
            <Link href={`/${region}`} className="hover:text-accent">
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
