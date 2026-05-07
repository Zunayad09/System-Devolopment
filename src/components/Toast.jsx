import { useCaseStore } from '../stores/useCaseStore'

const COLORS = {
  success: 'bg-conf-high-bg border-conf-high text-conf-high',
  error:   'bg-conf-low-bg border-conf-low text-conf-low',
  info:    'bg-primary-light border-primary text-primary',
}

export default function Toast() {
  const toast = useCaseStore(s => s.toast)
  if (!toast) return null
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border
      text-sm font-medium font-mono shadow-md transition-all
      ${COLORS[toast.type] || COLORS.info}`}>
      {toast.message}
    </div>
  )
}
