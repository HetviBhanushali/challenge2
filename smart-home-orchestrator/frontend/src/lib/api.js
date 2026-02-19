console.log("API BASE URL:", import.meta.env.VITE_API_URL)

import { supabase } from './supabase'

const BASE = import.meta.env.VITE_API_URL

async function getToken() {
  // Try supabase client first
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) return data.session.access_token

  // Fallback — read directly from localStorage
  const keys = Object.keys(localStorage).filter(k => k.includes('auth-token'))
  if (keys.length > 0) {
    const raw = localStorage.getItem(keys[0])
    const parsed = JSON.parse(raw)
    return parsed.access_token
  }
  return null
}

async function authHeaders() {
  const token = await getToken()
  console.log("Token found:", !!token) // will show true/false in console
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export async function sendSensorData(payload) {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/api/sensor`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function askChat(query) {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query })
  })
  return res.json()
}

export async function getHistory() {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/api/history`, { headers })
  return res.json()
}