import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

// Mock the hooks to avoid testing actual Supabase logic in a basic render test
vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    recovery: false,
    signOut: vi.fn(),
    finishRecovery: vi.fn()
  })
}))

vi.mock('./hooks/useProgress', () => ({
  useProgress: () => ({
    loading: false,
    syncing: false,
    error: null,
    totalDone: 0,
    totalQuestions: 0,
    pctDone: 0,
    progress: {},
    totalSessions: 0,
    avgPerDay: 0,
    horasEstudadas: 0,
    studyDaysCount: 0,
    getMesProgress: vi.fn(),
    getSubjectStats: vi.fn(),
    getWeeklyData: vi.fn(),
    getDailyActivity: vi.fn(),
    clearProgress: vi.fn(),
    toggleDone: vi.fn(),
    setQuestions: vi.fn()
  })
}))

import { MemoryRouter } from 'react-router-dom'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(document.body).toBeDefined()
  })
})
