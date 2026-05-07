import { create } from 'zustand'

export const useCaseStore = create((set) => ({
  // Auth
  user: null,
  token: localStorage.getItem('token') || null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', user.role)
    set({ user, token })
  },
  logout: () => {
    localStorage.clear()
    set({ user: null, token: null, currentCase: null, prediction: null })
  },

  // Current case
  currentCase: null,
  setCurrentCase: (c) => set({ currentCase: c }),

  // Prediction
  prediction: null,
  setPrediction: (p) => set({ prediction: p }),

  // Canvas overlay toggles
  overlays: { contour: true, heatmap: true, mask: false },
  setOverlay: (key, val) =>
    set(s => ({ overlays: { ...s.overlays, [key]: val } })),

  // Expert correction
  editedContour: null,
  setEditedContour: (pts) => set({ editedContour: pts }),

  // Toast notifications
  toast: null,
  showToast: (message, type = 'info') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },
}))
