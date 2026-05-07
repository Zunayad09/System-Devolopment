import { useState, useRef } from 'react'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg']
const MAX_MB = 10

export default function DropZone({ onFileAccepted, onError }) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const inputRef = useRef()

  const validate = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError('Only PNG and JPEG formats are accepted.')
      return false
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      onError(`File exceeds ${MAX_MB}MB limit.`)
      return false
    }
    return true
  }

  const handleFile = (file) => {
    if (!file) return
    if (!validate(file)) return
    setFileName(file.name)
    onFileAccepted(file)
  }

  return (
    <div
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl min-h-[340px]
        flex flex-col items-center justify-center gap-5 cursor-pointer
        transition-all duration-200 select-none
        ${isDragging
          ? 'border-primary bg-primary-light scale-[1.01]'
          : fileName
            ? 'border-conf-high bg-conf-high-bg'
            : 'border-border2 bg-white hover:border-primary hover:bg-primary-light'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {fileName ? (
        <>
          <div className="w-16 h-16 rounded-2xl bg-conf-high-bg flex items-center
            justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="#1D9E75" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base text-conf-high font-semibold">{fileName}</p>
            <p className="text-sm text-conf-high font-mono opacity-70 mt-1">
              Ready to process
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-2xl bg-surface2 flex items-center
            justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="#9B9890" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-gray-700">
              Drop your image here
            </p>
            <p className="text-sm text-muted mt-1">
              or{' '}
              <span className="text-primary font-medium underline underline-offset-2">
                click to browse
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {['PNG', 'JPEG'].map(fmt => (
              <span key={fmt} className="px-3 py-1 bg-surface2 border border-border
                rounded-full text-xs font-mono text-muted">
                {fmt}
              </span>
            ))}
            <span className="text-xs text-hint font-mono">Max {MAX_MB}MB</span>
          </div>
        </>
      )}
    </div>
  )
}
