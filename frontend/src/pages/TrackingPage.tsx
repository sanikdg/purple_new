import { useEffect, useState } from 'react'
import axios from 'axios'

interface VisitorStats {
  totalVisitors: number
  activeVisitors: number
  endedVisitors: number
  averageFrameCount: number
  totalFrames: number
}

interface CameraStats {
  cameraId: string
  count: number
  activeCount: number
}

interface DurationStats {
  cameraId: string
  avgDuration: number
}

export default function TrackingPage() {
  const [selectedCamera, setSelectedCamera] = useState<string>('CAM1')
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [cameraStats, setCameraStats] = useState<CameraStats[]>([])
  const [durationStats, setDurationStats] = useState<DurationStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const cameras = ['CAM1', 'CAM2', 'CAM3', 'CAM4', 'CAM5']

  useEffect(() => {
    fetchTrackingData()
  }, [])

  const fetchTrackingData = async () => {
    try {
      const [statsRes, cameraRes, durationRes] = await Promise.all([
        axios.get('/api/tracking/stats'),
        axios.get('/api/tracking/stats/by-camera'),
        axios.get('/api/tracking/stats/duration')
      ])

      setStats(statsRes.data.data || null)
      setCameraStats(cameraRes.data.data || [])
      setDurationStats(durationRes.data.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch tracking data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRunTracking = async () => {
    try {
      setRunning(true)
      await axios.post('/api/tracking/run', { cameraId: selectedCamera })
      
      // Refresh data after tracking
      setTimeout(() => {
        fetchTrackingData()
        setRunning(false)
      }, 2000)
    } catch (err) {
      setError('Failed to run tracking')
      setRunning(false)
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading tracking data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tracking Control
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Camera
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {cameras.map((cam) => (
                <option key={cam} value={cam}>
                  {cam}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleRunTracking}
              disabled={running}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                running
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {running ? 'Running...' : 'Run Tracking'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Total Visitors
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalVisitors}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Active Visitors
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.activeVisitors}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Ended Sessions
            </h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {stats.endedVisitors}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Avg Frames/Visitor
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.averageFrameCount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Total Frames
            </h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {stats.totalFrames}
            </p>
          </div>
        </div>
      )}

      {/* Visitors by Camera */}
      {cameraStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Visitors by Camera
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {cameraStats.map((cam) => (
              <div
                key={cam.cameraId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <p className="text-sm font-medium text-gray-600">
                  {cam.cameraId}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {cam.count}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {cam.activeCount} active
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Average Session Duration */}
      {durationStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Average Session Duration (seconds)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {durationStats.map((cam) => (
              <div
                key={cam.cameraId}
                className="border border-gray-200 rounded-lg p-4 text-center"
              >
                <p className="text-sm font-medium text-gray-600">
                  {cam.cameraId}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {cam.avgDuration.toFixed(1)}s
                </p>
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

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Tracking results are stored in the database.
          Use the Run Tracking button to process videos and generate visitor
          sessions.
        </p>
      </div>
    </div>
  )
}
