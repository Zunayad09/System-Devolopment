import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import CanvasViewer from '../components/CanvasViewer'
import ConfidencePanel from '../components/ConfidencePanel'
import OverlayToggles from '../components/OverlayToggles'
import { useCaseStore } from '../stores/useCaseStore'

export default function ResultsPage() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const { prediction, showToast } = useCaseStore()
  const role = localStorage.getItem('role')

  const handleSendForReview = async () => {
    showToast('Case sent for Expert Review ✓', 'success')
    setTimeout(() => navigate('/upload'), 1500)
  }

  return (
    <AppShell
      title={`Case #${caseId} — Lesion Analysis`}
      backTo="/upload"
      backLabel="Upload">

      <div className="grid grid-cols-[1fr_260px] gap-4">

        {/* Left — Canvas */}
        <CanvasViewer
          imageUrl={null}
          heatmapUrl={null}
          contourPts={prediction?.contour_pts || []}
          confidenceMap={prediction?.confidenceMap || []}
          isEditable={role === 'expert_reviewer'}
        />

        {/* Right — Analysis panel */}
        <div className="space-y-3">
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono font-semibold text-muted
              uppercase tracking-wider mb-3">
              Analysis Panel
            </p>
            <ConfidencePanel prediction={prediction} />
          </div>

          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono font-semibold text-muted
              uppercase tracking-wider mb-3">
              Overlay Toggles
            </p>
            <OverlayToggles />
          </div>

          {role === 'sonologist' && (
            <button
              onClick={handleSendForReview}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl
                text-sm font-medium flex items-center justify-center gap-2
                hover:bg-gray-700 transition-colors">
              Send for Expert Review →
            </button>
          )}

          {role === 'expert_reviewer' && (
            <button
              onClick={() => navigate(`/correction/${caseId}`)}
              className="w-full py-2.5 bg-primary text-white rounded-xl
                text-sm font-medium flex items-center justify-center gap-2
                hover:opacity-90 transition-opacity">
              Open Correction Tools →
            </button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
