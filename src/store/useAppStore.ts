import { create } from 'zustand'

export const useAppStore = create((set) => ({
  curMes: 1,
  setCurMes: (mes) => set({ curMes: mes }),

  // Auth state
  user: null,
  setUser: (user) => set({ user }),

  // Progress calculations cache
  progressData: null,
  setProgressData: (data) => set({ progressData: data }),
}))
