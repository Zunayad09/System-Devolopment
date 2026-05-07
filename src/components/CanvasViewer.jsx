import { useState, useEffect } from 'react'
import { Stage, Layer, Image as KImage, Line, Circle } from 'react-konva'
import useImage from 'use-image'
import { useCaseStore } from '../stores/useCaseStore'

const CANVAS = 512
const MODEL  = 256
const SCALE  = CANVAS / MODEL

const CONF_COLORS = {
  high:      '#1D9E75',
  medium:    '#EF9F27',
  uncertain: '#E24B4A',
}

export default function CanvasViewer({
  imageUrl,
  heatmapUrl,
  contourPts = [],
  confidenceMap = [],
  isEditable = false,
  onContourUpdate,
}) {
  const { overlays } = useCaseStore()
  const [ultrasound] = useImage(imageUrl)
  const [heatmap]    = useImage(heatmapUrl)

  const [pts, setPts] = useState(
    contourPts.map(([x, y]) => [x * SCALE, y * SCALE])
  )

  useEffect(() => {
    setPts(contourPts.map(([x, y]) => [x * SCALE, y * SCALE]))
  }, [contourPts])

  const handleDrag = (i, e) => {
    const updated = [...pts]
    updated[i] = [e.target.x(), e.target.y()]
    setPts(updated)
    onContourUpdate?.(updated.map(([x, y]) => [x / SCALE, y / SCALE]))
  }

  const getColor = (i) => CONF_COLORS[confidenceMap[i]] || CONF_COLORS.uncertain

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0B0F14' }}>
      <p className="text-[10px] font-mono text-white/25 tracking-wider
        text-center pt-1.5 pb-0.5">
        Ultrasound Image (grayscale)
      </p>

      <Stage width={CANVAS} height={CANVAS}>
        <Layer>
          {ultrasound && (
            <KImage image={ultrasound} width={CANVAS} height={CANVAS} />
          )}

          {overlays.heatmap && heatmap && (
            <KImage image={heatmap} width={CANVAS} height={CANVAS} opacity={0.4} />
          )}

          {overlays.mask && pts.length > 0 && (
            <Line
              points={pts.flat()}
              closed
              fill="rgba(29,158,117,0.15)"
              stroke="rgba(29,158,117,0.4)"
              strokeWidth={1}
            />
          )}

          {overlays.contour && pts.length > 1 && pts.map((pt, i) => {
            const next = pts[(i + 1) % pts.length]
            return (
              <Line
                key={i}
                points={[pt[0], pt[1], next[0], next[1]]}
                stroke={getColor(i)}
                strokeWidth={2.5}
                lineCap="round"
              />
            )
          })}

          {isEditable && pts.map(([x, y], i) => (
            <Circle
              key={i}
              x={x} y={y}
              radius={5}
              fill={getColor(i)}
              stroke="white"
              strokeWidth={1}
              draggable
              onDragEnd={(e) => handleDrag(i, e)}
            />
          ))}
        </Layer>
      </Stage>

      {/* Legend */}
      <div className="flex gap-4 justify-center px-3 py-2"
        style={{ background: 'rgba(0,0,0,0.4)' }}>
        {[
          ['#1D9E75', 'High confidence'],
          ['#EF9F27', 'Medium'],
          ['#E24B4A', 'Uncertain'],
        ].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: c }}/>
            <span className="text-[10px] font-mono text-white/45">{l}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
