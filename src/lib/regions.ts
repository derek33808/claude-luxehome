export type RegionCode = 'au' | 'nz' | 'us'

export interface RegionConfig {
  code: RegionCode
  name: string
  currency: 'AUD' | 'NZD' | 'USD'
  currencySymbol: string
  locale: string
  flag: string
  taxRate: number
  taxName: string
}

export const regions: Record<RegionCode, RegionConfig> = {
  au: {
    code: 'au',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'AUD $',
    locale: 'en-AU',
    flag: '🇦🇺',
    taxRate: 0.10,
    taxName: 'GST',
  },
  nz: {
    code: 'nz',
    name: 'New Zealand',
    currency: 'NZD',
    currencySymbol: 'NZD $',
    locale: 'en-NZ',
    flag: '🇳🇿',
    taxRate: 0.15,
    taxName: 'GST',
  },
  us: {
    code: 'us',
    name: 'United States',
    currency: 'USD',
    currencySymbol: 'USD $',
    locale: 'en-US',
    flag: '🇺🇸',
    taxRate: 0,
    taxName: 'Tax',
  },
}

export const defaultRegion: RegionCode = 'nz'

export const validRegions = Object.keys(regions) as RegionCode[]

export function isValidRegion(region: string): region is RegionCode {
  return validRegions.includes(region as RegionCode)
}

export function getRegion(code: string): RegionConfig {
  if (isValidRegion(code)) {
    return regions[code]
  }
  return regions[defaultRegion]
}

/**
 * Format price with currency symbol and thousand separators
 * Examples:
 * - formatPrice(1234, au) => "AUD $1,234"
 * - formatPrice(999, nz) => "NZD $999"
 * - formatPrice(1234567, us) => "USD $1,234,567"
 */
export function formatPrice(amount: number, region: RegionConfig): string {
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${region.currencySymbol}${formattedAmount}`
}
