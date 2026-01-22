import { redirect } from 'next/navigation'
import { defaultRegion } from '@/lib/regions'

export default function RootPage() {
  redirect(`/${defaultRegion}`)
}
