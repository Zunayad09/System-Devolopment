import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'

const STATS = [
  { label: 'Total Cases',    value: '47',  color: 'text-primary' },
  { label: 'Pending Review', value: '3',   color: 'text-conf-low' },
  { label: 'Completed',      value: '41',  color: 'text-conf-high' },
  { label: 'Avg Confidence', value: '71%', color: 'text-conf-med' },
]

const RECENT = [
  { id: 'case-0042', patient: 'P-2042', sono: 'Dr. Kim', status: 'in_review',  conf: 68, date: '2026-05-07' },
  { id: 'case-0041', patient: 'P-2041', sono: 'Dr. Lee', status: 'completed',  conf: 81, date: '2026-05-06' },
  { id: 'case-0040', patient: 'P-2040', sono: 'Dr. Kim', status: 'completed',  conf: 74, date: '2026-05-05' },
  { id: 'case-0039', patient: 'P-2039', sono: 'Dr. Lee', status: 'in_review',  conf: 54, date: '2026-05-04' },
  { id: 'case-0038', patient: 'P-2038', sono: 'Dr. Kim', status: 'rejected',   conf: 41, date: '2026-05-03' },
]

const STATUS_STYLE = {
  in_review: 'bg-conf-med-bg text-conf-med',
  completed: 'bg-conf-high-bg text-conf-high',
  rejected:  'bg-conf-low-bg text-conf-low',
  pending:   'bg-primary-light text-primary',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  return (
    <AppShell title="Dashboard">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4">
            <p className="text-xs text-muted mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-6">
        {role === 'sonologist' && (
          <button onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm
              font-medium hover:opacity-90 transition-opacity">
            + New Upload
          </button>
        )}
        {role === 'expert_reviewer' && (
          <button onClick={() => navigate('/review')}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm
              font-medium hover:opacity-90 transition-opacity">
            Review Queue (3)
          </button>
        )}
      </div>

      {/* Recent cases table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-surface2 flex
          items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Recent Cases</h2>
            <p className="text-xs text-muted font-mono mt-0.5">Last 5 cases</p>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Case ID', 'Patient', 'Sonologist', 'Confidence', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-[10px]
                  font-mono font-semibold text-muted uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT.map(c => (
              <tr key={c.id}
                className="border-b border-border hover:bg-surface2
                  cursor-pointer transition-colors"
                onClick={() => navigate(`/results/${c.id}`)}>
                <td className="px-4 py-3 text-sm font-mono text-primary font-medium">
                  #{c.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{c.patient}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{c.sono}</td>
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
                  <span className={`text-[10px] font-mono font-semibold
                    px-2 py-0.5 rounded-full
                    ${STATUS_STYLE[c.status] || STATUS_STYLE.pending}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
