import React from 'react'
import { useState } from 'react'
import { sendSensorData } from '../lib/api'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [sensors, setSensors] = useState({
    room: 'LivingRoom',
    temperature: 22,
    light_lux: 100,
    co2_ppm: 400,
    motion: false,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSimulate() {
    setLoading(true)
    const data = await sendSensorData(sensors)
    setResult(data)
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">🏠 Smart Home Orchestrator</h1>
        <div className="flex gap-3">
          <a href="/chat" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm">
            💬 AI Assistant
          </a>
          <button onClick={handleSignOut}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* SECTION 1 — Sensor Simulator */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">⚙️ Sensor Simulator</h2>

          {/* Room selector */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Room</label>
            <select
              className="w-full bg-gray-800 text-white p-2 rounded-lg mt-1"
              value={sensors.room}
              onChange={e => setSensors({ ...sensors, room: e.target.value })}>
              <option>LivingRoom</option>
              <option>Bedroom</option>
              <option>Kitchen</option>
              <option>Bathroom</option>
            </select>
          </div>

          {/* Temperature slider */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Temperature: <span className="text-white font-semibold">{sensors.temperature}°C</span>
            </label>
            <input type="range" min="10" max="40"
              className="w-full mt-1 accent-blue-500"
              value={sensors.temperature}
              onChange={e => setSensors({ ...sensors, temperature: Number(e.target.value) })} />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10°C (Low)</span><span>26°C (Normal)</span><span>40°C (High)</span>
            </div>
          </div>

          {/* Light slider */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Light Intensity: <span className="text-white font-semibold">{sensors.light_lux} Lux</span>
            </label>
            <input type="range" min="0" max="1000"
              className="w-full mt-1 accent-yellow-400"
              value={sensors.light_lux}
              onChange={e => setSensors({ ...sensors, light_lux: Number(e.target.value) })} />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Dark</span><span>Moderate</span><span>Bright</span>
            </div>
          </div>

          {/* CO2 slider */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              CO₂ Level: <span className="text-white font-semibold">{sensors.co2_ppm} ppm</span>
            </label>
            <input type="range" min="300" max="2000"
              className="w-full mt-1 accent-green-400"
              value={sensors.co2_ppm}
              onChange={e => setSensors({ ...sensors, co2_ppm: Number(e.target.value) })} />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Good (300)</span><span>Poor (1000+)</span>
            </div>
          </div>

          {/* Motion toggle */}
          <div className="flex items-center justify-between mb-6">
            <label className="text-gray-400 text-sm">Motion Detected</label>
            <button
              onClick={() => setSensors({ ...sensors, motion: !sensors.motion })}
              className={`w-14 h-7 rounded-full transition-colors ${sensors.motion ? 'bg-green-500' : 'bg-gray-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full mx-1 transition-transform ${sensors.motion ? 'translate-x-7' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 p-3 rounded-lg font-semibold">
            {loading ? 'Processing...' : '▶ Simulate Sensor Input'}
          </button>
        </div>

        {/* SECTION 2 — Compressed State Vector */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">📦 Compressed State Vector</h2>
          {result && result.state ? (
            <div className="space-y-3">
              {Object.entries(result.state).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm capitalize">{key.replace('_', ' ')}</span>
                  <span className={`font-semibold text-sm px-2 py-1 rounded ${
                    value === 'High' || value === 'Poor' ? 'bg-red-900 text-red-300' :
                    value === 'Low' ? 'bg-blue-900 text-blue-300' :
                    value === 1 || value === 'Normal' || value === 'Good' ? 'bg-green-900 text-green-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {String(value)}
                  </span>
                </div>
              ))}
              <div className="mt-4 bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Raw JSON packet sent:</p>
                <pre className="text-green-400 text-xs overflow-auto">
                  {JSON.stringify(result.state, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <p className="text-4xl mb-3">📡</p>
              <p className="text-sm">Hit simulate to see compressed state</p>
            </div>
          )}
        </div>

        {/* SECTION 3 — Agent Actions */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">🤖 Agent Decisions</h2>
          {result && result.action !== 'no_change' ? (
            <div className="space-y-3">
              {Object.entries(result.action).map(([agent, action]) => (
                <div key={agent} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {agent === 'lighting' ? '💡' :
                       agent === 'ac' ? '🌬️' :
                       agent === 'security' ? '🔐' : '⚡'}
                    </span>
                    <span className="font-semibold capitalize">{agent} Agent</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    action === 'turn_on' || action === 'cool' ? 'bg-blue-900 text-blue-300' :
                    action === 'turn_off' ? 'bg-gray-700 text-gray-400' :
                    action === 'monitor' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    → {action}
                  </span>
                </div>
              ))}
            </div>
          ) : result?.action === 'no_change' ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-sm">No state change — agents idle</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <p className="text-4xl mb-3">🎛️</p>
              <p className="text-sm">Agent decisions appear here</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}