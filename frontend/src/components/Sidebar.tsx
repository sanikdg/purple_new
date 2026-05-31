import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold">SIS</h2>
        <p className="text-xs text-gray-400 mt-1">Store Intelligence</p>
      </div>
      <nav className="mt-8">
        <Link
          to="/"
          className="block px-6 py-3 hover:bg-gray-800 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/datasets"
          className="block px-6 py-3 hover:bg-gray-800 transition"
        >
          Datasets
        </Link>
        <Link
          to="/cameras"
          className="block px-6 py-3 hover:bg-gray-800 transition"
        >
          Cameras
        </Link>
        <Link
          to="/store-layout"
          className="block px-6 py-3 hover:bg-gray-800 transition"
        >
          Store Layout
        </Link>
        <Link
          to="/detection"
          className="block px-6 py-3 hover:bg-gray-800 transition"
        >
          Detection
        </Link>
        <Link
          to="/tracking"
          className="block px-6 py-3 hover:bg-gray-800 transition"
        >
          Tracking
        </Link>
        <Link
          to="/health"
          className="block px-6 py-3 hover:bg-gray-800 transition"
        >
          System Health
        </Link>
      </nav>
    </aside>
  )
}
