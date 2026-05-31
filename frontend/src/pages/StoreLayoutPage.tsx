import { useEffect, useState } from 'react'
import axios from 'axios'

interface Zone {
  _id: string
  zoneId: string
  zoneName: string
  zoneType: string
  coordinates: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
  description: string
  brandName?: string
  createdAt: string
}

interface LayoutSummary {
  totalZones: number
  zonesByType: Record<string, number>
  brands: string[]
}

export default function StoreLayoutPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [summary, setSummary] = useState<LayoutSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const [zonesRes, summaryRes] = await Promise.all([
          axios.get('/api/store-layout/zones/all'),
          axios.get('/api/store-layout')
        ])

        setZones(zonesRes.data.data || [])
        setSummary(summaryRes.data.data || null)
        setError(null)
      } catch (err) {
        setError('Failed to fetch store layout')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLayout()
  }, [])

  const filteredZones =
    selectedType === 'all'
      ? zones
      : zones.filter((z) => z.zoneType === selectedType)

  const getZoneColor = (zoneType: string) => {
    const colors: Record<string, string> = {
      entrance: 'bg-blue-100 border-blue-300',
      counter: 'bg-purple-100 border-purple-300',
      fragrance: 'bg-pink-100 border-pink-300',
      makeup: 'bg-red-100 border-red-300',
      brand: 'bg-green-100 border-green-300'
    }
    return colors[zoneType] || 'bg-gray-100 border-gray-300'
  }

  const getZoneBadgeColor = (zoneType: string) => {
    const colors: Record<string, string> = {
      entrance: 'bg-blue-200 text-blue-800',
      counter: 'bg-purple-200 text-purple-800',
      fragrance: 'bg-pink-200 text-pink-800',
      makeup: 'bg-red-200 text-red-800',
      brand: 'bg-green-200 text-green-800'
    }
    return colors[zoneType] || 'bg-gray-200 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading store layout...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Zones</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {summary?.totalZones || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Brands</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {summary?.brands?.length || 0}
          </p>
        </div>
      </div>

      {/* Zone Type Breakdown */}
      {summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Zones by Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(summary.zonesByType).map(([type, count]) => (
              <div key={type} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filter by Type
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {['entrance', 'counter', 'fragrance', 'makeup', 'brand'].map(
            (type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>
      </div>

      {/* Zones Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Store Zones ({filteredZones.length})
          </h3>
        </div>

        {error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : filteredZones.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No zones found for the selected type.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredZones.map((zone) => (
              <div
                key={zone._id}
                className={`border-2 rounded-lg p-4 ${getZoneColor(zone.zoneType)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {zone.zoneName}
                    </h4>
                    <p className="text-sm text-gray-600">{zone.zoneId}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getZoneBadgeColor(zone.zoneType)}`}
                  >
                    {zone.zoneType}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-700 font-medium">Description</p>
                    <p className="text-gray-600">{zone.description}</p>
                  </div>

                  {zone.brandName && (
                    <div>
                      <p className="text-gray-700 font-medium">Brand</p>
                      <p className="text-gray-600">{zone.brandName}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-700 font-medium">Coordinates</p>
                    <p className="text-gray-600 text-xs">
                      X: {zone.coordinates.x1}-{zone.coordinates.x2}, Y:{' '}
                      {zone.coordinates.y1}-{zone.coordinates.y2}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands List */}
      {summary && summary.brands.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Brands in Store
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.brands.map((brand) => (
              <span
                key={brand}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
