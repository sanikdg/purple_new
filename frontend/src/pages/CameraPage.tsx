import { useEffect, useState } from 'react'
import axios from 'axios'

interface Camera {
  _id: string
  cameraId: string
  cameraName: string
  cameraLocation: string
  status: string
  streamType: string
  streamUrl?: string
  createdAt: string
}

export default function CameraPage() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get('/api/cameras')
        setCameras(response.data.data || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch cameras')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCameras()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading cameras...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Cameras</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {cameras.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Active</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {cameras.filter((c) => c.status === 'active').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Offline</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {cameras.filter((c) => c.status === 'offline').length}
          </p>
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Camera Registry
          </h3>
        </div>

        {error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : cameras.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No cameras registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {cameras.map((camera) => (
              <div
                key={camera._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {camera.cameraName}
                    </h4>
                    <p className="text-sm text-gray-600">{camera.cameraId}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      camera.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : camera.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {camera.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="text-gray-900">{camera.cameraLocation}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Stream Type</p>
                    <p className="text-gray-900 uppercase">{camera.streamType}</p>
                  </div>

                  {camera.streamUrl && (
                    <div>
                      <p className="text-gray-600">Stream URL</p>
                      <p className="text-gray-900 truncate text-xs">
                        {camera.streamUrl}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="text-gray-900 text-xs">
                      {new Date(camera.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
