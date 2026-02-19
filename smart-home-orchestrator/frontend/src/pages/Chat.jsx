import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { askChat } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m your Smart Home AI. Ask me anything about your home — device states, agent decisions, energy usage, and more.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const data = await askChat(userMessage)
      setMessages(prev => [...prev, { role: 'bot', text: data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '❌ Something went wrong. Please try again.' }])
    }

    setLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm">← Back</button>
          <h1 className="text-lg font-semibold">🧠 Smart Home AI Assistant</h1>
        </div>
        <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded-full">
          RAG Powered · Gemini
        </span>
      </div>

      {/* Suggested questions */}
      <div className="px-6 py-3 flex gap-2 flex-wrap bg-gray-900 border-b border-gray-800">
        {[
          'Why did the AC turn on?',
          'Which room uses the most energy?',
          'Any security alerts today?',
          'What is the current light state?'
        ].map(q => (
          <button key={q}
            onClick={() => setInput(q)}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm mr-3 mt-1 shrink-0">
                🏠
              </div>
            )}
            <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-800 text-gray-100 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm mr-3 shrink-0">
              🏠
            </div>
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-6 py-4 bg-gray-900 border-t border-gray-800 flex gap-3">
        <textarea
          rows={1}
          className="flex-1 bg-gray-800 text-white placeholder-gray-500 px-4 py-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask about your home... (Enter to send)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 px-5 py-3 rounded-xl font-semibold transition-colors">
          Send
        </button>
      </div>

    </div>
  )
}