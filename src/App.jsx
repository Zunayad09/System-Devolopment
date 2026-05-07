import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import ReviewQueuePage from './pages/ReviewQueuePage'
import CorrectionPage from './pages/CorrectionPage'
import DashboardPage from './pages/DashboardPage'
import Toast from './components/Toast'

export default function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/upload" element={
          <ProtectedRoute role="sonologist">
            <UploadPage />
          </ProtectedRoute>
        } />

        <Route path="/results/:caseId" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />

        <Route path="/review" element={
          <ProtectedRoute role="expert_reviewer">
            <ReviewQueuePage />
          </ProtectedRoute>
        } />

        <Route path="/correction/:caseId" element={
          <ProtectedRoute role="expert_reviewer">
            <CorrectionPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
