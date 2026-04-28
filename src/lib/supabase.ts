import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const missingConfigError = {
  message: 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.',
}

if (!url || !key) {
  console.warn(
    '[Supabase] Variaveis de ambiente nao encontradas.\n' +
    'Crie o arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  )
}

function createMissingClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: missingConfigError }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signUp: async () => ({ data: null, error: missingConfigError }),
      signInWithPassword: async () => ({ data: null, error: missingConfigError }),
      resetPasswordForEmail: async () => ({ data: null, error: missingConfigError }),
      updateUser: async () => ({ data: null, error: missingConfigError }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ eq: async () => ({ data: [], error: missingConfigError }) }),
      upsert: async () => ({ data: null, error: missingConfigError }),
      delete: () => ({ eq: async () => ({ data: null, error: missingConfigError }) }),
    }),
  }
}

export const supabase = url && key
  ? createClient(url, key)
  : createMissingClient()
