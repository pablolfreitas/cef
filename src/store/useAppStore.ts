import { create } from 'zustand'

interface AppStore {
  curMes: number
  setCurMes: (mes: number) => void
  user: null | { id: string; email: string }
  setUser: (user: AppStore['user']) => void
  progressData: unknown
  setProgressData: (data: unknown) => void
}

export const useAppStore = create<AppStore>((set) => ({
  curMes: 1,
  setCurMes: (mes) => set({ curMes: mes }),

  user: null,
  setUser: (user) => set({ user }),

  progressData: null,
  setProgressData: (data) => set({ progressData: data }),
}))
