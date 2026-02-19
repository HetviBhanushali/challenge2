# 🏠 Smart Home Orchestrator
### A Compressed-State Multi-Agent System for Low-Latency Home Automation

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/Gemini-API-4285F4?logo=google)](https://ai.google.dev)

---

## 📖 Overview

The **Smart Home Orchestrator** is a multi-agent home automation system that uses **compressed state representations** instead of raw sensor streams to make faster, cheaper, and more scalable decisions.

Instead of streaming raw sensor values continuously:
```
Temperature: 27.34°C  |  Humidity: 61.2%  |  Light: 143 Lux
```

The system compresses them into compact symbolic state vectors:
```json
{ "room": "LivingRoom", "occupied": 1, "time": "Night", "temp_state": "High" }
```

This drastically reduces bandwidth, speeds up agent coordination, and enables a **RAG-powered AI assistant** that answers questions about your home's behavior using stored state history.

---

## 🎯 Key Features

- ⚡ **Ultra-low latency** decision-making via compressed state vectors
- 🤖 **Multi-agent architecture** — Lighting, Climate, Security, Energy, and Orchestrator agents
- 🧠 **RAG-powered AI assistant** using Gemini API + pgvector for semantic search
- 🔐 **Authentication system** with Supabase Auth (email/password + JWT)
- 📉 **Event-driven messaging** — agents only communicate on state changes
- 🔁 **Conflict resolution** via policy-based priority engine
- 📊 **Real-time dashboard** showing live device states and agent decisions
- 🛡️ **Fault tolerance** — agents operate locally if orchestrator is unavailable

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend (Vite)               │
│         Dashboard  |  Chat (RAG)  |  Auth UI         │
└──────────────────────────┬──────────────────────────┘
                           │ REST / WebSocket
┌──────────────────────────▼──────────────────────────┐
│                   FastAPI Backend                    │
│                                                      │
│  ┌─────────────┐  ┌───────────────┐  ┌───────────┐  │
│  │ State       │  │ Agent Engine  │  │ RAG       │  │
│  │ Compression │  │ (5 Agents)    │  │ Pipeline  │  │
│  │ Engine      │  │               │  │           │  │
│  └──────┬──────┘  └──────┬────────┘  └─────┬─────┘  │
└─────────┼────────────────┼────────────────┼─────────┘
          │                │                │
    ┌─────▼──────┐   ┌─────▼──────┐   ┌────▼───────┐
    │ Supabase   │   │ Supabase   │   │ Gemini API │
    │ User DB    │   │ RAG DB     │   │ (LLM +     │
    │ (Auth +    │   │ (pgvector) │   │ Embeddings)│
    │ History)   │   │            │   │            │
    └────────────┘   └────────────┘   └────────────┘
```

### Agent Roles

| Agent | Responsibility |
|-------|---------------|
| 🏠 **Room Context Agent** | Maintains compressed room state, detects conflicts |
| 💡 **Lighting Agent** | Controls brightness based on occupancy + light state |
| 🌬️ **Climate Agent** | Manages fan/AC using temperature + occupancy state |
| 🔐 **Security Agent** | Detects anomalous state transitions, triggers alerts |
| ⚡ **Energy Agent** | Monitors power, schedules throttling, prevents idle waste |
| 🎛️ **Orchestrator Agent** | Resolves conflicts, enforces policies, syncs global state |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS |
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **Auth** | Supabase Auth (JWT) |
| **User Database** | Supabase PostgreSQL (user data + chat history) |
| **RAG Database** | Supabase PostgreSQL + pgvector (smart home knowledge) |
| **LLM + Embeddings** | Google Gemini API (`gemini-1.5-flash` + `embedding-001`) |
| **Real-time** | FastAPI WebSockets |


<div align="center">
  Built by Hetvi Bhanushali
</div>
