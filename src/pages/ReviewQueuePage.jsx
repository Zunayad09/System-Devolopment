import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useCaseStore } from '../stores/useCaseStore'

const MOCK_CASES = [
  { id: 'case-0042', sonologist: 'Dr. Kim', date: '2026-05-07', status: 'in_review', conf: 68 },
  { id: 'case-0041', sonologist: 'Dr. Lee', date: '2026-05-06', status: 'in_review', conf: 54 },
  { id: 'case-0039', sonologist: 'Dr. Kim', date: '2026-05-05', status: 'in_review', conf: 71 },
]

export default function ReviewQueuePage() {
  const navigate = useNavigate()
  const { setCurrentCase } = useCaseStore()
  const [cases] = useState(MOCK_CASES)

  return (
    <AppShell title="Review Queue" backTo="/dashboard" backLabel="Dashboard">

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-surface2 flex
          items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Pending Review</h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              {cases.length} case{cases.length !== 1 ? 's' : ''} waiting
            </p>
          </div>
          <span className="bg-conf-low-bg text-conf-low text-xs font-mono
            font-bold px-2.5 py-1 rounded-full">
            {cases.length} pending
          </span>
        </div>

        {cases.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">No cases pending review</p>
            <p className="text-xs text-hint font-mono mt-1">All caught up ✓</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Case ID', 'Sonologist', 'Date', 'Confidence', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-[10px]
                    font-mono font-semibold text-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id}
                  className="border-b border-border hover:bg-surface2
                    cursor-pointer transition-colors"
                  onClick={() => {
                    setCurrentCase(c)
                    navigate(`/correction/${c.id}`)
                  }}>
                  <td className="px-4 py-3 text-sm font-mono text-primary font-medium">
                    #{c.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.sonologist}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted">{c.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono font-semibold
                      ${c.conf >= 65
                        ? 'text-conf-high'
                        : c.conf >= 50
                          ? 'text-conf-med'
                          : 'text-conf-low'}`}>
                      {c.conf}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-conf-med-bg text-conf-med text-[10px]
                      font-mono font-semibold px-2 py-0.5 rounded-full">
                      in_review
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-primary font-medium">Review →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  )
}
