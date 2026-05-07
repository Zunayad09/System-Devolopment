import { useCaseStore } from '../stores/useCaseStore'

const TOGGLES = [
  { key: 'contour', label: 'Contour' },
  { key: 'heatmap', label: 'Uncertainty map' },
  { key: 'mask',    label: 'Binary mask' },
]

export default function OverlayToggles() {
  const { overlays, setOverlay } = useCaseStore()

  return (
    <div className="space-y-1">
      {TOGGLES.map(({ key, label }) => (
        <div key={key}
          className="flex items-center gap-2 py-1 cursor-pointer group select-none"
          onClick={() => setOverlay(key, !overlays[key])}>
          <div className={`w-3.5 h-3.5 rounded-sm border-[1.5px] flex
            items-center justify-center flex-shrink-0 transition-colors
            ${overlays[key] ? 'bg-primary border-primary' : 'border-border2'}`}>
            {overlays[key] && (
              <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                <path d="M1 3l2.5 2.5L8 1" stroke="white"
                  strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <span className={`text-xs transition-colors
            ${overlays[key] ? 'text-gray-800' : 'text-hint'}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
