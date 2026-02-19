import React from 'react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

async function handleSubmit() {
  setError('')
  let result
  if (isSignUp) {
    result = await supabase.auth.signUp({ email, password })
  } else {
    result = await supabase.auth.signInWithPassword({ email, password })
  }
  if (result.error) setError(result.error.message)
}

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-96 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">🏠 Smart Home</h1>
        <p className="text-gray-400 mb-6">Orchestrator Dashboard</p>
        <input className="w-full bg-gray-800 text-white p-3 rounded-lg mb-3"
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full bg-gray-800 text-white p-3 rounded-lg mb-4"
          placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-semibold">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>
        <p className="text-gray-500 text-center mt-4 text-sm cursor-pointer"
          onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  )
}