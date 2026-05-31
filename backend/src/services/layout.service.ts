import Zone, { IZone } from '../models/Zone.js'

export class LayoutService {
  /**
   * Initialize store layout with default zones
   */
  async initializeLayout(): Promise<IZone[]> {
    const existingZones = await Zone.find()
    if (existingZones.length > 0) {
      return existingZones
    }

    const defaultZones = [
      {
        zoneId: 'ZONE_ENTRANCE',
        zoneName: 'Entrance',
        zoneType: 'entrance' as const,
        coordinates: { x1: 0, y1: 0, x2: 300, y2: 200 },
        description: 'Store entrance area'
      },
      {
        zoneId: 'ZONE_COUNTER',
        zoneName: 'Cash Counter',
        zoneType: 'counter' as const,
        coordinates: { x1: 1600, y1: 800, x2: 1920, y2: 1080 },
        description: 'Cash counter and billing area'
      },
      {
        zoneId: 'ZONE_FRAGRANCE',
        zoneName: 'Fragrance Unit',
        zoneType: 'fragrance' as const,
        coordinates: { x1: 300, y1: 200, x2: 800, y2: 600 },
        description: 'Fragrance and perfume section'
      },
      {
        zoneId: 'ZONE_MAKEUP',
        zoneName: 'Makeup Unit',
        zoneType: 'makeup' as const,
        coordinates: { x1: 800, y1: 200, x2: 1300, y2: 600 },
        description: 'Makeup and cosmetics section'
      },
      // Brand zones
      {
        zoneId: 'ZONE_BRAND_EBT',
        zoneName: 'EBT Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 300, y1: 600, x2: 600, y2: 900 },
        description: 'EBT brand section',
        brandName: 'EBT'
      },
      {
        zoneId: 'ZONE_BRAND_FSG',
        zoneName: 'FSG Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 600, y1: 600, x2: 900, y2: 900 },
        description: 'FSG brand section',
        brandName: 'FSG'
      },
      {
        zoneId: 'ZONE_BRAND_VD',
        zoneName: 'VD Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 900, y1: 600, x2: 1200, y2: 900 },
        description: 'VD brand section',
        brandName: 'VD'
      },
      {
        zoneId: 'ZONE_BRAND_DERM',
        zoneName: 'Derm Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1200, y1: 600, x2: 1500, y2: 900 },
        description: 'Derm brand section',
        brandName: 'Derm'
      },
      {
        zoneId: 'ZONE_BRAND_MINIMALIST',
        zoneName: 'Minimalist Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1500, y1: 600, x2: 1800, y2: 900 },
        description: 'Minimalist brand section',
        brandName: 'Minimalist'
      },
      {
        zoneId: 'ZONE_BRAND_AQUALOGICA',
        zoneName: 'Aqualogica Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 300, y1: 900, x2: 600, y2: 1080 },
        description: 'Aqualogica brand section',
        brandName: 'Aqualogica'
      },
      {
        zoneId: 'ZONE_BRAND_PILGRIM',
        zoneName: 'Pilgrim Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 600, y1: 900, x2: 900, y2: 1080 },
        description: 'Pilgrim brand section',
        brandName: 'Pilgrim'
      },
      {
        zoneId: 'ZONE_BRAND_DK',
        zoneName: 'D&K Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 900, y1: 900, x2: 1200, y2: 1080 },
        description: 'D&K brand section',
        brandName: 'D&K'
      },
      {
        zoneId: 'ZONE_BRAND_MAYBELLINE',
        zoneName: 'Maybelline Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1200, y1: 900, x2: 1500, y2: 1080 },
        description: 'Maybelline brand section',
        brandName: 'Maybelline'
      },
      {
        zoneId: 'ZONE_BRAND_FACES',
        zoneName: 'Faces Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1500, y1: 900, x2: 1800, y2: 1080 },
        description: 'Faces brand section',
        brandName: 'Faces'
      },
      {
        zoneId: 'ZONE_BRAND_LAKME',
        zoneName: 'Lakme Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1300, y1: 200, x2: 1600, y2: 600 },
        description: 'Lakme brand section',
        brandName: 'Lakme'
      },
      {
        zoneId: 'ZONE_BRAND_SWISS',
        zoneName: 'Swiss Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1600, y1: 200, x2: 1920, y2: 600 },
        description: 'Swiss brand section',
        brandName: 'Swiss'
      },
      {
        zoneId: 'ZONE_BRAND_MARS',
        zoneName: 'Mars Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1800, y1: 600, x2: 1920, y2: 800 },
        description: 'Mars brand section',
        brandName: 'Mars'
      },
      {
        zoneId: 'ZONE_BRAND_GOODLORE',
        zoneName: 'Good Lore Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1300, y1: 600, x2: 1600, y2: 800 },
        description: 'Good Lore brand section',
        brandName: 'GoodLore'
      },
      {
        zoneId: 'ZONE_BRAND_BEAUTY3',
        zoneName: 'Beauty3 Brand Zone',
        zoneType: 'brand' as const,
        coordinates: { x1: 1600, y1: 600, x2: 1800, y2: 800 },
        description: 'Beauty3 brand section',
        brandName: 'Beauty3'
      }
    ]

    const zones = await Zone.insertMany(defaultZones)
    return zones
  }

  /**
   * Get all zones
   */
  async getAllZones(): Promise<IZone[]> {
    return await Zone.find().sort({ zoneType: 1, zoneName: 1 })
  }

  /**
   * Get zones by type
   */
  async getZonesByType(
    zoneType: 'entrance' | 'counter' | 'fragrance' | 'makeup' | 'brand'
  ): Promise<IZone[]> {
    return await Zone.find({ zoneType }).sort({ zoneName: 1 })
  }

  /**
   * Get zone by ID
   */
  async getZoneById(zoneId: string): Promise<IZone | null> {
    return await Zone.findOne({ zoneId })
  }

  /**
   * Get zone by brand name
   */
  async getZoneByBrand(brandName: string): Promise<IZone | null> {
    return await Zone.findOne({ brandName })
  }

  /**
   * Get all brand zones
   */
  async getBrandZones(): Promise<IZone[]> {
    return await Zone.find({ zoneType: 'brand' }).sort({ brandName: 1 })
  }

  /**
   * Get layout summary
   */
  async getLayoutSummary(): Promise<{
    totalZones: number
    zonesByType: Record<string, number>
    brands: string[]
  }> {
    const zones = await Zone.find()
    const zonesByType: Record<string, number> = {
      entrance: 0,
      counter: 0,
      fragrance: 0,
      makeup: 0,
      brand: 0
    }

    const brands = new Set<string>()

    zones.forEach((zone) => {
      zonesByType[zone.zoneType]++
      if (zone.brandName) {
        brands.add(zone.brandName)
      }
    })

    return {
      totalZones: zones.length,
      zonesByType,
      brands: Array.from(brands).sort()
    }
  }

  /**
   * Validate zone coordinates
   */
  validateCoordinates(coordinates: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (typeof coordinates.x1 !== 'number') errors.push('x1 must be a number')
    if (typeof coordinates.y1 !== 'number') errors.push('y1 must be a number')
    if (typeof coordinates.x2 !== 'number') errors.push('x2 must be a number')
    if (typeof coordinates.y2 !== 'number') errors.push('y2 must be a number')

    if (coordinates.x1 >= coordinates.x2) {
      errors.push('x1 must be less than x2')
    }
    if (coordinates.y1 >= coordinates.y2) {
      errors.push('y1 must be less than y2')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export default new LayoutService()
