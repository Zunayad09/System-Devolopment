import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import DropZone from '../components/DropZone'
import { useCaseStore } from '../stores/useCaseStore'

const GENDERS = ['Male', 'Female', 'Other']

export default function UploadPage() {
  const navigate = useNavigate()
  const { currentCase, setCurrentCase, setPrediction,
          setPatientInfo, showToast } = useCaseStore()

  const [error, setError] = useState('')
  const [status, setStatus] = useState(null)
  const [running, setRunning] = useState(false)
  const [meta, setMeta] = useState(null)
  const [patient, setPatient] = useState({
    patientId: '',
    age: '',
    gender: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [ageError, setAgeError] = useState('')

  const isRejected = currentCase?.status === 'rejected'

  const isPatientFormValid =
    patient.patientId.trim() &&
    patient.age.trim() &&
    patient.gender

  const handleFileAccepted = async (f) => {
    setError('')
    setStatus('uploading')
    await new Promise(r => setTimeout(r, 800))
    const mockCase = { id: 'case-0042', status: 'pending' }
    setCurrentCase(mockCase)
    setMeta({ name: f.name, dims: '512×512px', depth: '8-bit grayscale' })
    setStatus('processed')
    showToast('Image uploaded and processed ✓', 'success')
  }

  const handleRunInference = async () => {
    if (!isPatientFormValid) {
      setError('Please fill in Patient ID, Age and Gender before running inference.')
      return
    }
    setPatientInfo(patient)
    setRunning(true)
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

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">
        {label} <span className="text-conf-low">*</span>
      </label>
      <input
        type={type}
        value={patient[key]}
        onChange={e => setPatient({ ...patient, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-border2 rounded-lg text-sm
          outline-none focus:border-primary transition-colors bg-white"
      />
    </div>
  )

  return (
    <AppShell title="Upload Ultrasound Image" backTo="/dashboard" backLabel="Back">

      <div className="flex flex-col items-center justify-center
        min-h-[calc(100vh-56px)] py-8">

        <div className="w-full max-w-2xl space-y-4">

          {/* Heading */}
          <div className="text-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Upload Ultrasound Image
            </h2>
            <p className="text-sm text-muted mt-1">
              Fill in patient details and upload the scan for AI analysis
            </p>
          </div>

          {/* Rejection banner */}
          {isRejected && (
            <div className="bg-conf-low-bg border border-conf-low rounded-xl
              px-4 py-3 flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#A32D2D" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-conf-low">
                  Case #{currentCase?.id} — please re-upload a clearer image
                </p>
              </div>
            </div>
          )}

          {/* Patient info form */}
          <div className="bg-white border border-border rounded-xl p-5">
            <p className="text-[10px] font-mono font-semibold text-muted
              uppercase tracking-wider mb-4">
              Patient Information
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {field('Patient ID', 'patientId', 'text', 'e.g. P-2042')}

              {/* Age — numbers only, no spinner */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Age <span className="text-conf-low">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={patient.age}
                  onChange={e => {
                    const val = e.target.value
                    if (val === '' || /^\d+$/.test(val)) {
                      setPatient({ ...patient, age: val })
                      setAgeError('')
                    } else {
                      setAgeError('Age must be numbers only.')
                    }
                  }}
                  placeholder="e.g. 45"
                  className={`w-full px-3 py-2 border rounded-lg text-sm
                    outline-none transition-colors bg-white
                    [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none
                    ${ageError ? 'border-conf-low focus:border-conf-low' : 'border-border2 focus:border-primary'}`}
                />
                {ageError && (
                  <p className="text-[11px] text-conf-low font-mono mt-1">
                    {ageError}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Gender <span className="text-conf-low">*</span>
                </label>
                <select
                  value={patient.gender}
                  onChange={e => setPatient({ ...patient, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-border2 rounded-lg
                    text-sm outline-none focus:border-primary bg-white
                    transition-colors">
                  <option value="">Select gender</option>
                  {GENDERS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={patient.date}
                  onChange={e => setPatient({ ...patient, date: e.target.value })}
                  className="w-full px-3 py-2 border border-border2 rounded-lg
                    text-sm outline-none focus:border-primary bg-white
                    transition-colors"
                />
              </div>
            </div>

            {/* Note from Sonologist */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Note from Sonologist
              </label>
              <textarea
                value={patient.note}
                onChange={e => setPatient({ ...patient, note: e.target.value })}
                placeholder="Any clinical observations or notes for the reviewer..."
                rows={2}
                className="w-full px-3 py-2 border border-border2 rounded-lg
                  text-sm outline-none focus:border-primary bg-white
                  transition-colors resize-none font-sans"
              />
            </div>
          </div>

          {/* Drop zone */}
          <DropZone onFileAccepted={handleFileAccepted} onError={setError} />

          {/* Error */}
          {error && (
            <div className="bg-conf-low-bg border border-conf-low text-conf-low
              text-xs font-mono px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {/* Status bar */}
          {status === 'processed' && meta && (
            <div className="bg-white border border-border rounded-xl px-4 py-3
              flex items-center gap-3">
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
