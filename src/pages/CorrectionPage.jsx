import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import CanvasViewer from '../components/CanvasViewer'
import ConfidencePanel from '../components/ConfidencePanel'
import OverlayToggles from '../components/OverlayToggles'
import { useCaseStore } from '../stores/useCaseStore'

export default function CorrectionPage() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const { prediction, patientInfo, setEditedContour, showToast } = useCaseStore()
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

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

  const handleApprove = () => {
    showToast('Case approved — generating report...', 'success')
    setTimeout(() => navigate('/review'), 1500)
  }

  const handleReAnnotate = () => {
    navigate(`/re-annotate/${caseId}`)
  }

  // Fallback mock patient info for cases opened from review queue
  const info = patientInfo || {
    patientId: 'P-2042',
    age: '52',
    gender: 'Female',
    date: '2026-05-13',
    note: '',
  }

  return (
    <AppShell
      title={`Case #${caseId} — Expert Review`}
      backTo="/review"
      backLabel="Review Queue">

      <div className="grid grid-cols-[1fr_280px] gap-4">

        {/* Left — Canvas */}
        <CanvasViewer
          imageUrl={null}
          heatmapUrl={null}
          contourPts={prediction?.contour_pts || []}
          confidenceMap={prediction?.confidenceMap || []}
          isEditable={false}
          onContourUpdate={setEditedContour}
        />

        {/* Right — panels */}
        <div className="space-y-3">

          {/* Patient information */}
          <div className="bg-white border border-border rounded-xl p-4">
            <p className="text-[10px] font-mono font-semibold text-muted
              uppercase tracking-wider mb-3">
              Patient Information
            </p>
            <div className="space-y-2">
              {[
                { label: 'Patient ID', value: info.patientId },
                { label: 'Age',        value: info.age ? `${info.age} yrs` : '—' },
                { label: 'Gender',     value: info.gender },
                { label: 'Date',       value: info.date },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline
                  py-1 border-b border-border last:border-0">
                  <span className="text-[10px] font-mono text-muted">{label}</span>
                  <span className="text-xs font-semibold text-gray-800">{value || '—'}</span>
                </div>
              ))}
              {info.note && (
                <div className="pt-1">
                  <p className="text-[10px] font-mono text-muted mb-1">
                    Note from Sonologist
                  </p>
                  <p className="text-xs text-gray-700 bg-surface2 rounded-lg
                    px-3 py-2 leading-relaxed">
                    {info.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Analysis panel */}
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

          {/* Reviewer notes */}
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
              <button onClick={handleApprove}
                className="py-2 bg-conf-high-bg text-conf-high rounded-lg
                  text-sm font-medium border border-conf-high
                  hover:bg-conf-high hover:text-white transition-all">
                ✓ Approve
              </button>
              <button onClick={handleReAnnotate}
                className="py-2 bg-primary-light text-primary rounded-lg
                  text-sm font-medium border border-primary
                  hover:bg-primary hover:text-white transition-all">
                ✎ Re-annotate
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
