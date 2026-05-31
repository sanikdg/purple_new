import { useEffect, useState } from 'react'
import axios from 'axios'

interface DetectionStats {
  totalDetections: number
  totalFrames: number
  camerasWithDetections: number
  averageConfidence: number
}

interface CameraStats {
  cameraId: string
  count: number
}

interface ConfidenceStats {
  cameraId: string
  avgConfidence: number
}

export default function DetectionPage() {
  const [selectedCamera, setSelectedCamera] = useState<string>('CAM1')
  const [stats, setStats] = useState<DetectionStats | null>(null)
  const [cameraStats, setCameraStats] = useState<CameraStats[]>([])
  const [confidenceStats, setConfidenceStats] = useState<ConfidenceStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const cameras = ['CAM1', 'CAM2', 'CAM3', 'CAM4', 'CAM5']

  useEffect(() => {
    fetchDetectionData()
  }, [])

  const fetchDetectionData = async () => {
    try {
      const [statsRes, cameraRes, confidenceRes] = await Promise.all([
        axios.get('/api/detection/stats'),
        axios.get('/api/detection/stats/by-camera'),
        axios.get('/api/detection/stats/confidence')
      ])

      setStats(statsRes.data.data || null)
      setCameraStats(cameraRes.data.data || [])
      setConfidenceStats(confidenceRes.data.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch detection data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRunDetection = async () => {
    try {
      setRunning(true)
      await axios.post('/api/detection/run', { cameraId: selectedCamera })
      
      // Refresh data after detection
      setTimeout(() => {
        fetchDetectionData()
        setRunning(false)
      }, 2000)
    } catch (err) {
      setError('Failed to run detection')
      setRunning(false)
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading detection data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detection Control
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
              onClick={handleRunDetection}
              disabled={running}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                running
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {running ? 'Running...' : 'Run Detection'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Total Detections
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalDetections}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Frames</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.totalFrames}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Cameras Active
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.camerasWithDetections}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Avg Confidence
            </h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {(stats.averageConfidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Detection by Camera */}
      {cameraStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detections by Camera
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {cameraStats.map((cam) => (
              <div
                key={cam.cameraId}
                className="border border-gray-200 rounded-lg p-4 text-center"
              >
                <p className="text-sm font-medium text-gray-600">
                  {cam.cameraId}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {cam.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence by Camera */}
      {confidenceStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Average Confidence by Camera
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {confidenceStats.map((cam) => (
              <div
                key={cam.cameraId}
                className="border border-gray-200 rounded-lg p-4 text-center"
              >
                <p className="text-sm font-medium text-gray-600">
                  {cam.cameraId}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(cam.avgConfidence * 100).toFixed(1)}%
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
          <strong>Note:</strong> Detection results are stored in the database.
          Use the Run Detection button to process videos and generate new
          detections.
        </p>
      </div>
    </div>
  )
}
