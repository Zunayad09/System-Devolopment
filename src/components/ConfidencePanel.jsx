const BARS = [
  { key: 'high',   label: 'High',      color: '#1D9E75', bg: '#EAF3DE' },
  { key: 'medium', label: 'Medium',    color: '#EF9F27', bg: '#FAEEDA' },
  { key: 'uncert', label: 'Uncertain', color: '#E24B4A', bg: '#FCEBEB' },
]

export default function ConfidencePanel({ prediction }) {
  if (!prediction) return (
    <div className="text-xs text-hint font-mono text-center py-4">
      No prediction data
    </div>
  )

  const {
    conf_high = 68, conf_medium = 19, conf_uncert = 13,
    hue_edge_len = 8.4, variance_max = 0.42, mc_dropout = 20,
  } = prediction

  const vals = { high: conf_high, medium: conf_medium, uncert: conf_uncert }

  return (
    <div className="space-y-4">
      {/* Confidence bars */}
      <div>
        <p className="text-[10px] font-mono font-semibold text-muted
          uppercase tracking-wider mb-2">
          Lesion 1 — Boundary Confidence
        </p>
        {BARS.map(({ key, label, color }) => (
          <div key={key} className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: color }}/>
              <span className="text-xs text-gray-700 flex-1">{label}</span>
              <span className="text-xs font-semibold font-mono"
                style={{ color }}>
                {vals[key]}%
              </span>
            </div>
            <div className="h-[3px] bg-surface2 rounded-full">
              <div className="h-[3px] rounded-full transition-all duration-500"
                style={{ width: `${vals[key]}%`, background: color }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Uncertainty metrics */}
      <div>
        <p className="text-[10px] font-mono font-semibold text-muted
          uppercase tracking-wider mb-2">
          Uncertainty Metrics
        </p>
        <div className="space-y-1.5">
          {[
            { k: 'High-uncert edge len', v: `${hue_edge_len}mm`, highlight: true },
            { k: 'Variance map max',     v: variance_max },
            { k: 'MC Dropout samples',  v: mc_dropout },
          ].map(({ k, v, highlight }) => (
            <div key={k} className="flex justify-between items-baseline
              py-1 border-b border-border">
              <span className="text-[10px] font-mono text-muted">{k}</span>
              <span className={`text-[11px] font-semibold font-mono
                ${highlight ? 'text-conf-low' : 'text-gray-700'}`}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
