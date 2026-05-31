import { useEffect, useState } from 'react'
import axios from 'axios'

interface Event {
  eventId: string
  visitorId: string
  trackId: string
  cameraId: string
  zoneId?: string
  eventType: string
  timestamp: string
  metadata?: Record<string, any>
}

interface EventStats {
  totalEvents: number
  eventsByType: Record<string, number>
  uniqueVisitors: number
  uniqueZones: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<EventStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchEventsData()
  }, [])

  const fetchEventsData = async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([
        axios.get('/api/events/live?limit=100'),
        axios.get('/api/events/stats')
      ])

      setEvents(eventsRes.data.data || [])
      setStats(statsRes.data.data || null)
      setError(null)
    } catch (err) {
      setError('Failed to fetch events data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'ZONE_ENTER':
        return 'bg-green-100 text-green-800'
      case 'ZONE_EXIT':
        return 'bg-red-100 text-red-800'
      case 'ZONE_TRANSITION':
        return 'bg-blue-100 text-blue-800'
      case 'VISITOR_SESSION_START':
        return 'bg-purple-100 text-purple-800'
      case 'VISITOR_SESSION_END':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.eventType === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalEvents}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Unique Visitors</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.uniqueVisitors}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Zones Visited</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.uniqueZones}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Event Types</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {Object.keys(stats.eventsByType).length}
            </p>
          </div>
        </div>
      )}

      {/* Event Type Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Events</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Events
          </button>
          {stats && Object.keys(stats.eventsByType).map(eventType => (
            <button
              key={eventType}
              onClick={() => setFilter(eventType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === eventType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {eventType} ({stats.eventsByType[eventType]})
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Live Events ({filteredEvents.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No events found
            </div>
          ) : (
            filteredEvents.map(event => (
              <div key={event.eventId} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Visitor:</strong> {event.visitorId}</p>
                      <p><strong>Camera:</strong> {event.cameraId}</p>
                      {event.zoneId && <p><strong>Zone:</strong> {event.zoneId}</p>}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <p><strong>Details:</strong> {JSON.stringify(event.metadata)}</p>
                      )}
                    </div>
                  </div>
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
