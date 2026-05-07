import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import CanvasViewer from '../components/CanvasViewer'
import ConfidencePanel from '../components/ConfidencePanel'
import OverlayToggles from '../components/OverlayToggles'
import { useCaseStore } from '../stores/useCaseStore'

const TOOLS = [
  { key: 'select', label: 'Select', icon: '↖' },
  { key: 'brush',  label: 'Brush',  icon: '✏' },
  { key: 'erase',  label: 'Erase',  icon: '⌫' },
  { key: 'refine', label: 'Refine', icon: '◎' },
]

export default function CorrectionPage() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const { prediction, setEditedContour, showToast } = useCaseStore()
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTool, setActiveTool] = useState('select')

  const handleSaveRecheck = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    showToast('Correction saved — AI re-checking...', 'info')
    setTimeout(() => {
      showToast('Re-check complete — report generated ✓', 'success')
      navigate('/review')
    }, 2000)
    setSaving(false)
  }

  const handleAccept = () => {
    showToast('Case accepted — generating report...', 'success')
    setTimeout(() => navigate('/review'), 1500)
  }

  const handleReject = () => {
    showToast('Case rejected — returned to Sonologist', 'info')
    setTimeout(() => navigate('/review'), 1500)
  }

  return (
    <AppShell
      title={`Case #${caseId} — Expert Correction`}
      backTo="/review"
      backLabel="Review Queue">

      <div className="grid grid-cols-[1fr_260px] gap-4">

        {/* Left — Canvas with drag handles */}
        <CanvasViewer
          imageUrl={null}
          heatmapUrl={null}
          contourPts={prediction?.contour_pts || []}
          confidenceMap={prediction?.confidenceMap || []}
          isEditable={true}
          onContourUpdate={setEditedContour}
        />

        {/* Right — Expert tools */}
        <div className="space-y-3">

          {/* Tool palette */}
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono font-semibold text-muted
              uppercase tracking-wider mb-3">
              Annotation Tools
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {TOOLS.map(t => (
                <button key={t.key}
                  onClick={() => setActiveTool(t.key)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium
                    border transition-all flex items-center gap-1.5
                    ${activeTool === t.key
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface2 text-muted border-border'}`}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 text-xs font-mono text-muted
                border border-border rounded-lg hover:bg-surface2 transition-colors">
                ↩ Undo
              </button>
              <button className="flex-1 py-1.5 text-xs font-mono text-muted
                border border-border rounded-lg hover:bg-surface2 transition-colors">
                ↪ Redo
              </button>
            </div>
          </div>

          {/* Confidence panel */}
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono font-semibold text-muted
              uppercase tracking-wider mb-3">
              Analysis Panel
            </p>
            <ConfidencePanel prediction={prediction} />
          </div>

          {/* Overlay toggles */}
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono font-semibold text-muted
              uppercase tracking-wider mb-3">
              Overlay Toggles
            </p>
            <OverlayToggles />
          </div>

          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Reviewer notes (optional)..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-xl
              text-xs font-mono resize-none outline-none
              focus:border-primary bg-white text-gray-700"/>

          {/* Action buttons */}
          <div className="space-y-2">
            <button onClick={handleSaveRecheck} disabled={saving}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl
                text-sm font-medium flex items-center justify-center gap-2
                hover:bg-gray-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : 'Save & Re-check AI →'}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleAccept}
                className="py-2 bg-conf-high-bg text-conf-high rounded-lg
                  text-sm font-medium border border-conf-high
                  hover:bg-conf-high hover:text-white transition-all">
                ✓ Approve
              </button>
              <button onClick={handleReject}
                className="py-2 bg-conf-low-bg text-conf-low rounded-lg
                  text-sm font-medium border border-conf-low
                  hover:bg-conf-low hover:text-white transition-all">
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
