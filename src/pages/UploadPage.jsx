import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import DropZone from '../components/DropZone'
import { useCaseStore } from '../stores/useCaseStore'

export default function UploadPage() {
  const navigate = useNavigate()
  const { currentCase, setCurrentCase, setPrediction, showToast } = useCaseStore()
  const [error, setError] = useState('')
  const [status, setStatus] = useState(null)
  const [running, setRunning] = useState(false)
  const [meta, setMeta] = useState(null)

  const isRejected = currentCase?.status === 'rejected'

  const handleFileAccepted = async (f) => {
    setError('')
    setStatus('uploading')

    // MOCK UPLOAD
    await new Promise(r => setTimeout(r, 800))
    const mockCase = { id: 'case-0042', status: 'pending' }
    setCurrentCase(mockCase)
    setMeta({ name: f.name, dims: '512×512px', depth: '8-bit grayscale' })
    setStatus('processed')
    showToast('Image uploaded and processed ✓', 'success')
  }

  const handleRunInference = async () => {
    setRunning(true)
    // MOCK INFERENCE
    await new Promise(r => setTimeout(r, 1200))
    setPrediction({
      id: 'pred-001',
      contour_pts: [
        [80,100],[120,60],[160,58],[200,100],
        [210,140],[190,190],[150,210],
        [110,205],[75,165],
      ],
      conf_high: 68, conf_medium: 19, conf_uncert: 13,
      hue_edge_len: 8.4, variance_max: 0.42, mc_dropout: 20,
      confidenceMap: ['high','high','high','high','medium',
                      'medium','uncertain','medium','medium'],
    })
    setRunning(false)
    navigate('/results/case-0042')
  }

  return (
    <AppShell title="Upload Ultrasound Image" backTo="/dashboard" backLabel="Back">

      {/* Full-height centered layout */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] py-8">

        <div className="w-full max-w-2xl">

          {/* Page heading */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Upload Ultrasound Image
            </h2>
            <p className="text-sm text-muted mt-1">
              Drop your scan below — AI will detect and segment lesion boundaries instantly
            </p>
          </div>

          {/* Rejection banner */}
          {isRejected && (
            <div className="bg-conf-low-bg border border-conf-low rounded-xl
              px-4 py-3 mb-5 flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#A32D2D" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-conf-low">
                  Case #{currentCase?.id} rejected by Expert Reviewer
                </p>
                <p className="text-xs font-mono text-conf-low opacity-75 mt-0.5">
                  Please upload a clearer image for re-analysis
                </p>
              </div>
            </div>
          )}

          {/* Drop zone — tall and prominent */}
          <div className="mb-4">
            <DropZone onFileAccepted={handleFileAccepted} onError={setError} />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-conf-low-bg border border-conf-low text-conf-low
              text-xs font-mono px-4 py-2.5 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Status bar */}
          {status === 'processed' && meta && (
            <div className="bg-white border border-border rounded-xl px-4 py-3
              flex items-center gap-3 mb-4">
              <span className="bg-conf-high-bg text-conf-high text-xs font-mono
                font-semibold px-2.5 py-1 rounded-full">
                ✓ Processed
              </span>
              <span className="text-xs text-muted font-mono">
                {meta.name} · {meta.dims} · {meta.depth}
              </span>
            </div>
          )}

          {/* Run button */}
          <button
            onClick={handleRunInference}
            disabled={status !== 'processed' || running}
            className="w-full py-4 bg-gray-900 text-white rounded-xl
              font-mono text-sm font-semibold tracking-[1.5px] uppercase
              flex items-center justify-center gap-3 transition-all
              hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
            {running ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                </svg>
                Running Inference...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3l14 9-14 9V3z"/>
                </svg>
                Run AI Inference
              </>
            )}
          </button>

        </div>
      </div>
    </AppShell>
  )
}
