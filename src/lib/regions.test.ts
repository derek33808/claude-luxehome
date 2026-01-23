import { describe, it, expect } from 'vitest'
import {
  regions,
  defaultRegion,
  validRegions,
  isValidRegion,
  getRegion,
  formatPrice,
  type RegionCode,
} from './regions'

describe('regions', () => {
  describe('regions configuration', () => {
    it('should have all three regions defined', () => {
      expect(Object.keys(regions)).toHaveLength(3)
      expect(regions).toHaveProperty('au')
      expect(regions).toHaveProperty('nz')
      expect(regions).toHaveProperty('us')
    })

    it('should have correct config for Australia', () => {
      expect(regions.au).toEqual({
        code: 'au',
        name: 'Australia',
        currency: 'AUD',
        currencySymbol: 'AUD $',
        locale: 'en-AU',
        flag: expect.any(String),
        taxRate: 0.10,
        taxName: 'GST',
      })
    })

    it('should have correct config for New Zealand', () => {
      expect(regions.nz).toEqual({
        code: 'nz',
        name: 'New Zealand',
        currency: 'NZD',
        currencySymbol: 'NZD $',
        locale: 'en-NZ',
        flag: expect.any(String),
        taxRate: 0.15,
        taxName: 'GST',
      })
    })

    it('should have correct config for United States', () => {
      expect(regions.us).toEqual({
        code: 'us',
        name: 'United States',
        currency: 'USD',
        currencySymbol: 'USD $',
        locale: 'en-US',
        flag: expect.any(String),
        taxRate: 0,
        taxName: 'Tax',
      })
    })
  })

  describe('defaultRegion', () => {
    it('should be nz', () => {
      expect(defaultRegion).toBe('nz')
    })
  })

  describe('validRegions', () => {
    it('should contain all region codes', () => {
      expect(validRegions).toContain('au')
      expect(validRegions).toContain('nz')
      expect(validRegions).toContain('us')
      expect(validRegions).toHaveLength(3)
    })
  })

  describe('isValidRegion', () => {
    it('should return true for valid region codes', () => {
      expect(isValidRegion('au')).toBe(true)
      expect(isValidRegion('nz')).toBe(true)
      expect(isValidRegion('us')).toBe(true)
    })

    it('should return false for invalid region codes', () => {
      expect(isValidRegion('uk')).toBe(false)
      expect(isValidRegion('ca')).toBe(false)
      expect(isValidRegion('')).toBe(false)
      expect(isValidRegion('AU')).toBe(false) // case sensitive
    })
  })

  describe('getRegion', () => {
    it('should return correct region for valid codes', () => {
      expect(getRegion('au')).toBe(regions.au)
      expect(getRegion('nz')).toBe(regions.nz)
      expect(getRegion('us')).toBe(regions.us)
    })

    it('should return default region for invalid codes', () => {
      expect(getRegion('invalid')).toBe(regions[defaultRegion])
      expect(getRegion('')).toBe(regions[defaultRegion])
      expect(getRegion('UK')).toBe(regions[defaultRegion])
    })
  })

  describe('formatPrice', () => {
    it('should format price with AUD symbol', () => {
      expect(formatPrice(100, regions.au)).toBe('AUD $100')
      expect(formatPrice(0, regions.au)).toBe('AUD $0')
    })

    it('should format price with NZD symbol', () => {
      expect(formatPrice(150, regions.nz)).toBe('NZD $150')
    })

    it('should format price with USD symbol', () => {
      expect(formatPrice(200, regions.us)).toBe('USD $200')
    })

    it('should format large prices with thousand separators', () => {
      expect(formatPrice(1234, regions.au)).toBe('AUD $1,234')
      expect(formatPrice(12345, regions.nz)).toBe('NZD $12,345')
      expect(formatPrice(1234567, regions.us)).toBe('USD $1,234,567')
    })

    it('should round decimal prices to whole numbers', () => {
      expect(formatPrice(99.99, regions.au)).toBe('AUD $100')
      expect(formatPrice(99.49, regions.nz)).toBe('NZD $99')
    })
  })
})
