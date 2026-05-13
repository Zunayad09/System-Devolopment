import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import CanvasViewer from '../components/CanvasViewer'
import { useCaseStore } from '../stores/useCaseStore'

const TOOLS = [
  { key: 'select', label: 'Select', icon: '↖', desc: 'Select & move points' },
  { key: 'brush',  label: 'Brush',  icon: '✏', desc: 'Draw new boundary'   },
  { key: 'erase',  label: 'Erase',  icon: '⌫', desc: 'Erase boundary area' },
  { key: 'refine', label: 'Refine', icon: '◎', desc: 'Smooth edges'        },
]

export default function ReAnnotatePage() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const { prediction, setEditedContour, showToast } = useCaseStore()
  const [activeTool, setActiveTool] = useState('select')
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState('')

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    showToast('Re-annotation saved ✓', 'success')
    setTimeout(() => navigate('/review'), 1500)
    setSaving(false)
  }

  return (
    <AppShell
      title={`Case #${caseId} — Re-annotate`}
      backTo={`/correction/${caseId}`}
      backLabel="Back to Review">

      <div className="grid grid-cols-[1fr_280px] gap-4">

        {/* Left — Editable canvas */}
        <div>
          <div className="bg-[#1A1916] text-white/40 text-[10px] font-mono
            px-3 py-1.5 rounded-t-xl flex items-center justify-between">
            <span>Re-annotation Mode — drag points to correct boundary</span>
            <span className="text-primary font-semibold uppercase tracking-wider
              text-[9px]">
              {TOOLS.find(t => t.key === activeTool)?.desc}
            </span>
          </div>
          <CanvasViewer
            imageUrl={null}
            heatmapUrl={null}
            contourPts={prediction?.contour_pts || []}
            confidenceMap={prediction?.confidenceMap || []}
            isEditable={true}
            onContourUpdate={setEditedContour}
          />
        </div>

        {/* Right — Annotation tools */}
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
                  className={`py-3 px-3 rounded-xl text-xs font-medium
                    border transition-all flex flex-col items-center gap-1
                    ${activeTool === t.key
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-surface2 text-muted border-border hover:border-primary'}`}>
                  <span className="text-lg">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Undo / Redo */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 text-xs font-mono text-muted
                border border-border rounded-lg hover:bg-surface2
                transition-colors flex items-center justify-center gap-1">
                ↩ Undo
              </button>
              <button className="flex-1 py-2 text-xs font-mono text-muted
                border border-border rounded-lg hover:bg-surface2
                transition-colors flex items-center justify-center gap-1">
                ↪ Redo
              </button>
            </div>
          </div>

          {/* Brush size (shown only for brush/erase) */}
          {(activeTool === 'brush' || activeTool === 'erase') && (
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-[10px] font-mono font-semibold text-muted
                uppercase tracking-wider mb-3">
                Brush Size
              </p>
              <input type="range" min="2" max="20" defaultValue="6"
                className="w-full accent-primary"/>
              <div className="flex justify-between text-[10px] font-mono
                text-hint mt-1">
                <span>Fine</span>
                <span>Thick</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-primary-light border border-primary/20
            rounded-xl p-4">
            <p className="text-[10px] font-mono font-semibold text-primary
              uppercase tracking-wider mb-2">
              How to annotate
            </p>
            <ul className="space-y-1.5">
              {[
                'Drag contour points to correct boundary',
                'Use Brush to draw new segments',
                'Use Erase to remove incorrect areas',
                'Use Refine to smooth jagged edges',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs
                  text-primary/80">
                  <span className="font-mono font-bold mt-0.5">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Annotation notes (optional)..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-xl
              text-xs font-mono resize-none outline-none
              focus:border-primary bg-white text-gray-700"/>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 bg-gray-900 text-white rounded-xl
              text-sm font-medium flex items-center justify-center gap-2
              hover:bg-gray-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                </svg>
                Saving...
              </>
            ) : (
              'Save Re-annotation →'
            )}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
