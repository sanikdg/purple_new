import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Health from './pages/Health'
import DatasetPage from './pages/DatasetPage'
import CameraPage from './pages/CameraPage'
import StoreLayoutPage from './pages/StoreLayoutPage'
import DetectionPage from './pages/DetectionPage'
import TrackingPage from './pages/TrackingPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/datasets" element={<DatasetPage />} />
          <Route path="/cameras" element={<CameraPage />} />
          <Route path="/store-layout" element={<StoreLayoutPage />} />
          <Route path="/detection" element={<DetectionPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
