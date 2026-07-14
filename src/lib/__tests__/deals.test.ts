import { DEALS, getDealsByRegion, getDealsByOrigin, formatPrice } from '../deals'

describe('deals', () => {
  describe('DEALS', () => {
    it('should have 27 deals', () => {
      expect(DEALS.length).toBe(27)
    })

    it('should have deals across all regions', () => {
      const regions = new Set(DEALS.map(d => d.region))
      expect(regions.has('Africa')).toBe(true)
      expect(regions.has('Europe')).toBe(true)
      expect(regions.has('Asia')).toBe(true)
      expect(regions.has('Middle East')).toBe(true)
      expect(regions.has('America')).toBe(true)
    })

    it('should have valid IATA codes for origin and destination', () => {
      DEALS.forEach(deal => {
        expect(deal.origin).toHaveLength(3)
        expect(deal.destination).toHaveLength(3)
        expect(deal.origin).toBe(deal.origin.toUpperCase())
        expect(deal.destination).toBe(deal.destination.toUpperCase())
      })
    })

    it('should have 8+ Africa deals', () => {
      const africaDeals = DEALS.filter(d => d.region === 'Africa')
      expect(africaDeals.length).toBeGreaterThanOrEqual(8)
    })

    it('should have 5+ Europe deals', () => {
      const europeDeals = DEALS.filter(d => d.region === 'Europe')
      expect(europeDeals.length).toBeGreaterThanOrEqual(5)
    })

    it('should have 4+ Asia deals', () => {
      const asiaDeals = DEALS.filter(d => d.region === 'Asia')
      expect(asiaDeals.length).toBeGreaterThanOrEqual(4)
    })

    it('should have 3+ Middle East deals', () => {
      const middleEastDeals = DEALS.filter(d => d.region === 'Middle East')
      expect(middleEastDeals.length).toBeGreaterThanOrEqual(3)
    })

    it('should have 2+ America deals', () => {
      const americaDeals = DEALS.filter(d => d.region === 'America')
      expect(americaDeals.length).toBeGreaterThanOrEqual(2)
    })

    it('should have valid prices', () => {
      DEALS.forEach(deal => {
        expect(deal.priceNumber).toBeGreaterThan(0)
        expect(deal.price).toMatch(/^KES [\d,]+$/)
      })
    })

    it('should have valid images', () => {
      DEALS.forEach(deal => {
        expect(deal.image).toMatch(/^\/.+\.(jpg|png|webp)$/)
      })
    })
  })

  describe('getDealsByRegion', () => {
    it('should return all deals when no region specified', () => {
      const allDeals = getDealsByRegion()
      expect(allDeals.length).toBe(DEALS.length)
    })

    it('should return all deals when region is "All"', () => {
      const allDeals = getDealsByRegion('All')
      expect(allDeals.length).toBe(DEALS.length)
    })

    it('should filter Africa deals', () => {
      const africaDeals = getDealsByRegion('Africa')
      expect(africaDeals.length).toBeGreaterThanOrEqual(8)
      africaDeals.forEach(deal => {
        expect(deal.region).toBe('Africa')
      })
    })

    it('should filter Europe deals', () => {
      const europeDeals = getDealsByRegion('Europe')
      expect(europeDeals.length).toBeGreaterThanOrEqual(5)
      europeDeals.forEach(deal => {
        expect(deal.region).toBe('Europe')
      })
    })

    it('should filter Asia deals', () => {
      const asiaDeals = getDealsByRegion('Asia')
      expect(asiaDeals.length).toBeGreaterThanOrEqual(4)
      asiaDeals.forEach(deal => {
        expect(deal.region).toBe('Asia')
      })
    })
  })

  describe('getDealsByOrigin', () => {
    it('should return deals for Nairobi origin', () => {
      const nairobiDeals = getDealsByOrigin('Nairobi')
      expect(nairobiDeals.length).toBeGreaterThan(0)
      nairobiDeals.forEach(deal => {
        expect(deal.originCity).toBe('Nairobi')
      })
    })
  })

  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(99925)).toBe('KES 99,925')
      expect(formatPrice(16595)).toBe('KES 16,595')
      expect(formatPrice(1000000)).toBe('KES 1,000,000')
    })
  })
})