import { useNavigate } from 'react-router-dom'
import { useCaseStore } from '../stores/useCaseStore'

export default function AppShell({ title, backTo, backLabel, children }) {
  const navigate = useNavigate()
  const { user, logout } = useCaseStore()
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface2">
      {/* Topbar */}
      <div className="bg-[#1A1916] text-white flex items-center
        justify-between px-4 py-2.5 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center
            justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5"/>
              <path d="M7 12 Q9 8 12 12 Q15 16 17 12"
                stroke="white" strokeWidth="1.5" fill="none"
                strokeLinecap="round"/>
            </svg>
          </div>
          {backTo ? (
            <button onClick={() => navigate(backTo)}
              className="flex items-center gap-1.5 text-white/50
              hover:text-white font-mono text-xs transition-colors">
              ← {backLabel || 'Back'}
            </button>
          ) : (
            <span className="text-xs font-mono text-white/40">SuperNova AI</span>
          )}
        </div>

        <span className="text-sm font-medium absolute left-1/2
          -translate-x-1/2">{title}</span>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/50">
            {user?.email || localStorage.getItem('email') || 'User'}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider
            px-2 py-0.5 rounded-full
            ${role === 'expert_reviewer'
              ? 'bg-conf-high text-white'
              : 'bg-primary text-white'}`}>
            {role === 'expert_reviewer' ? 'Expert' : 'Sonologist'}
          </span>
          <button onClick={handleLogout}
            className="text-white/40 hover:text-white/80
            text-xs font-mono transition-colors">
            logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="p-4 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  )
}
