import { useEffect, useState } from 'react'
import axios from 'axios'

interface SystemStatus {
  status: string
  timestamp: string
}

export default function Dashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/api/health')
        setStatus(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch system status')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          {loading ? (
            <p className="text-gray-600 mt-2">Loading...</p>
          ) : error ? (
            <p className="text-red-600 mt-2">{error}</p>
          ) : (
            <div className="mt-4">
              <p className="text-2xl font-bold text-green-600">
                {status?.status || 'Unknown'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {status?.timestamp}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Cameras</h3>
          <p className="text-2xl font-bold text-blue-600 mt-4">0</p>
          <p className="text-sm text-gray-600 mt-2">Connected devices</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-4">0</p>
          <p className="text-sm text-gray-600 mt-2">Active alerts</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Information
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Phase 1: Foundation & Architecture</p>
          <p>Status: Development</p>
          <p>Last Updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
