import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NotificationBar } from '@/components/layout/NotificationBar'
import { CartWrapper } from '@/components/cart'
import { isValidRegion, defaultRegion, RegionCode } from '@/lib/regions'
import { redirect } from 'next/navigation'

interface RegionLayoutProps {
  children: React.ReactNode
  params: Promise<{ region: string }>
}

export default async function RegionLayout({ children, params }: RegionLayoutProps) {
  const { region } = await params

  // Validate region
  if (!isValidRegion(region)) {
    redirect(`/${defaultRegion}`)
  }

  return (
    <CartWrapper region={region as RegionCode}>
      <div className="min-h-screen flex flex-col">
        <NotificationBar region={region as RegionCode} />
        <Header region={region as RegionCode} />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer region={region as RegionCode} />
      </div>
    </CartWrapper>
  )
}
