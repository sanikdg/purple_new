import { useEffect, useState } from 'react'
import axios from 'axios'

interface Journey {
  _id: string
  visitorId: string
  cameraId: string
  visitedZones: string[]
  totalDwellTime: number
  entryTime: string
  exitTime?: string
  zoneSequence: Array<{
    zoneId: string
    entryTime: string
    exitTime?: string
    dwellTime: number
  }>
}

interface JourneyStats {
  totalJourneys: number
  averageZonesVisited: number
  averageDwellTime: number
  totalDwellTime: number
}

interface ZoneFrequency {
  zoneId: string
  visitCount: number
  averageDwell: number
}

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [stats, setStats] = useState<JourneyStats | null>(null)
  const [zoneFrequency, setZoneFrequency] = useState<ZoneFrequency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJourneysData()
  }, [])

  const fetchJourneysData = async () => {
    try {
      const [journeysRes, statsRes, frequencyRes] = await Promise.all([
        axios.get('/api/journeys'),
        axios.get('/api/journeys/stats'),
        axios.get('/api/journeys/zones/frequency')
      ])

      setJourneys(journeysRes.data.data || [])
      setStats(statsRes.data.data || null)
      setZoneFrequency(frequencyRes.data.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch journeys data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading journeys...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Journeys</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalJourneys}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Avg Zones Visited</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.averageZonesVisited}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Avg Dwell Time (s)</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.averageDwellTime}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Dwell Time (s)</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {stats.totalDwellTime}
            </p>
          </div>
        </div>
      )}

      {/* Zone Frequency */}
      {zoneFrequency.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone Visit Frequency</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zoneFrequency.map(zone => (
              <div key={zone.zoneId} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">{zone.zoneId}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{zone.visitCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: {zone.averageDwell}s
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journeys List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Visitor Journeys ({journeys.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {journeys.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No journeys found
            </div>
          ) : (
            journeys.map(journey => (
              <div key={journey._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{journey.visitorId}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(journey.entryTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">
                      {journey.visitedZones.length} zones
                    </p>
                    <p className="text-sm text-gray-500">
                      {journey.totalDwellTime}s dwell
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <strong>Path:</strong> {journey.zoneSequence.map(z => z.zoneId).join(' → ')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}
