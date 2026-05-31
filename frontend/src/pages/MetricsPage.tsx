import { useEffect, useState } from 'react'
import axios from 'axios'

interface OverviewMetrics {
  totalVisitors: number
  activeVisitors: number
  averageVisitDuration: number
  mostVisitedZone: string | null
  completedVisits: number
}

interface ZoneMetrics {
  zoneVisits: Record<string, number>
  uniqueZoneVisitors: Record<string, number>
  averageZoneDwellTime: Record<string, number>
  mostVisitedZones: Array<{ zone: string; visits: number }>
  leastVisitedZones: Array<{ zone: string; visits: number }>
}

interface JourneyMetrics {
  averageVisitDuration: number
  averageZonesVisited: number
  mostCommonPaths: Array<{ path: string; count: number }>
  storeEntryCount: number
  storeExitCount: number
}

interface OperationalMetrics {
  activeVisitors: number
  completedVisits: number
  averageSessionLength: number
}

export default function MetricsPage() {
  const [overview, setOverview] = useState<OverviewMetrics | null>(null)
  const [zones, setZones] = useState<ZoneMetrics | null>(null)
  const [journeys, setJourneys] = useState<JourneyMetrics | null>(null)
  const [operational, setOperational] = useState<OperationalMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const [overviewRes, zonesRes, journeysRes, operationalRes] = await Promise.all([
        axios.get('/api/metrics/overview'),
        axios.get('/api/metrics/zones'),
        axios.get('/api/metrics/journeys'),
        axios.get('/api/metrics/operational')
      ])

      setOverview(overviewRes.data.data || null)
      setZones(zonesRes.data.data || null)
      setJourneys(journeysRes.data.data || null)
      setOperational(operationalRes.data.data || null)
      setError(null)
    } catch (err) {
      setError('Failed to fetch metrics data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading metrics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Visitors</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {overview.totalVisitors}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Active Visitors</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {overview.activeVisitors}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Avg Visit Duration (s)</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {overview.averageVisitDuration}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Most Visited Zone</h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {overview.mostVisitedZone || 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Completed Visits</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {overview.completedVisits}
            </p>
          </div>
        </div>
      )}

      {/* Operational Metrics */}
      {operational && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Active Visitors</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {operational.activeVisitors}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Completed Visits</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {operational.completedVisits}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Avg Session Length (s)</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {operational.averageSessionLength}
            </p>
          </div>
        </div>
      )}

      {/* Zone Performance */}
      {zones && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Visited Zones</h3>
            <div className="space-y-2">
              {zones.mostVisitedZones.slice(0, 5).map((zone, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">{zone.zone}</span>
                  <span className="font-bold text-blue-600">{zone.visits}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Least Visited Zones</h3>
            <div className="space-y-2">
              {zones.leastVisitedZones.slice(0, 5).map((zone, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">{zone.zone}</span>
                  <span className="font-bold text-orange-600">{zone.visits}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Journey Metrics */}
      {journeys && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-600">Avg Visit Duration</p>
              <p className="text-2xl font-bold text-gray-900">{journeys.averageVisitDuration}s</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Avg Zones Visited</p>
              <p className="text-2xl font-bold text-gray-900">{journeys.averageZonesVisited}</p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <p className="text-sm text-gray-600">Store Entries</p>
              <p className="text-2xl font-bold text-gray-900">{journeys.storeEntryCount}</p>
            </div>
            <div className="border-l-4 border-orange-600 pl-4">
              <p className="text-sm text-gray-600">Store Exits</p>
              <p className="text-2xl font-bold text-gray-900">{journeys.storeExitCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Common Paths */}
      {journeys && journeys.mostCommonPaths.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Visitor Paths</h3>
          <div className="space-y-3">
            {journeys.mostCommonPaths.slice(0, 5).map((path, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-700 flex-1">{path.path}</p>
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {path.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone Dwell Times */}
      {zones && Object.keys(zones.averageZoneDwellTime).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Zone Dwell Times</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(zones.averageZoneDwellTime).slice(0, 9).map(([zone, dwell]) => (
              <div key={zone} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">{zone}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{dwell}s</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}
