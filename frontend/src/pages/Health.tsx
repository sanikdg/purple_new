import { useEffect, useState } from 'react'
import axios from 'axios'

interface HealthData {
  backend?: {
    status: string
    timestamp: string
  }
  aiService?: {
    status: string
    timestamp: string
  }
  database?: {
    status: string
    timestamp: string
  }
}

export default function Health() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get('/api/health/detailed')
        setHealth(response.data)
      } catch (err) {
        console.error('Failed to fetch health data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'ok':
        return 'text-green-600'
      case 'degraded':
        return 'text-yellow-600'
      case 'unhealthy':
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">System Health</h2>

      {loading ? (
        <p className="text-gray-600">Loading health data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {health?.backend && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Backend</h3>
              <p className={`text-2xl font-bold mt-4 ${getStatusColor(health.backend.status)}`}>
                {health.backend.status}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {health.backend.timestamp}
              </p>
            </div>
          )}

          {health?.aiService && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">AI Service</h3>
              <p className={`text-2xl font-bold mt-4 ${getStatusColor(health.aiService.status)}`}>
                {health.aiService.status}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {health.aiService.timestamp}
              </p>
            </div>
          )}

          {health?.database && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Database</h3>
              <p className={`text-2xl font-bold mt-4 ${getStatusColor(health.database.status)}`}>
                {health.database.status}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {health.database.timestamp}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
