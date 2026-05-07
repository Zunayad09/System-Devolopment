import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCaseStore } from '../stores/useCaseStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useCaseStore(s => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '', role: 'sonologist' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // MOCK LOGIN — remove when backend is ready
    await new Promise(r => setTimeout(r, 600))
    const mockUser = { id: '1', email: form.email, role: form.role }
    const mockToken = 'mock-jwt-token-' + Date.now()
    localStorage.setItem('email', form.email)
    setAuth(mockUser, mockToken)
    navigate(form.role === 'sonologist' ? '/upload' : '/review')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface2 flex items-center
      justify-center p-4" style={{
        backgroundImage: `repeating-linear-gradient(0deg,transparent,
          transparent 39px,#E2DFD5 39px,#E2DFD5 40px),
          repeating-linear-gradient(90deg,transparent,transparent 39px,
          #E2DFD5 39px,#E2DFD5 40px)`,
        backgroundSize: '40px 40px',
      }}>
      <div className="bg-white border border-border rounded-xl
        p-8 w-full max-w-sm shadow-sm">

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center
            justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5"/>
              <path d="M7 12 Q9 8 12 12 Q15 16 17 12"
                stroke="white" strokeWidth="1.5" fill="none"
                strokeLinecap="round"/>
              <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.6)"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            SuperNova AI
          </h1>
          <p className="text-[10px] font-mono text-hint uppercase
            tracking-widest mt-0.5">
            Lesion Boundary Detection System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Username / Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="dr.kim@hospital.org"
              required
              className="w-full px-3 py-2 border border-border2 rounded-lg
                text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-border2 rounded-lg
                text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-border2 rounded-lg
                text-sm outline-none focus:border-primary bg-white
                transition-colors">
              <option value="sonologist">Sonologist</option>
              <option value="expert_reviewer">Expert Reviewer</option>
            </select>
          </div>

          {error && (
            <div className="bg-conf-low-bg border border-conf-low
              text-conf-low text-xs font-mono px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-gray-900 text-white rounded-lg
              font-mono text-xs font-semibold tracking-[2px] uppercase
              hover:bg-gray-700 transition-colors disabled:opacity-50
              disabled:cursor-not-allowed">
            {loading ? 'Logging in...' : 'L O G I N'}
          </button>
        </form>

        <p className="text-[10px] font-mono text-hint text-center mt-4">
          Session expires after inactivity
        </p>
      </div>
    </div>
  )
}
