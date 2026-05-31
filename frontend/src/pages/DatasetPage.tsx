import { useEffect, useState } from 'react'
import axios from 'axios'

interface Dataset {
  _id: string
  datasetId: string
  cameraId: string
  fileName: string
  filePath: string
  status: string
  duration: number
  fps: number
  resolution: string
  fileSize: number
  createdAt: string
}

interface DatasetStats {
  totalDatasets: number
  totalCameras: number
  totalDuration: number
  averageFps: number
  statusBreakdown: Record<string, number>
}

export default function DatasetPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [stats, setStats] = useState<DatasetStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datasetsRes, statsRes] = await Promise.all([
          axios.get('/api/datasets'),
          axios.get('/api/datasets/stats/summary')
        ])

        setDatasets(datasetsRes.data.data || [])
        setStats(statsRes.data.data || null)
        setError(null)
      } catch (err) {
        setError('Failed to fetch datasets')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading datasets...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Datasets</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats?.totalDatasets || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Cameras</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats?.totalCameras || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Duration</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {stats?.totalDuration || 0}s
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Average FPS</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {stats?.averageFps?.toFixed(1) || 0}
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Datasets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Datasets ({datasets.length})
          </h3>
        </div>

        {error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : datasets.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No datasets found. Register datasets to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Dataset ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Camera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    FPS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Resolution
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {datasets.map((dataset) => (
                  <tr key={dataset._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dataset.datasetId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dataset.cameraId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dataset.fileName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dataset.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : dataset.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : dataset.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {dataset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dataset.duration}s
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dataset.fps}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dataset.resolution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
