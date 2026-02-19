from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.orchestrator import orchestrator
from rag.pipeline import answer_query
from db.supabase_client import supabase
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.replace("Bearer ", "")
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

class SensorData(BaseModel):
    room: str
    temperature: float
    motion: bool
    light_lux: float
    co2_ppm: float

class ChatRequest(BaseModel):
    query: str

@app.post("/api/sensor")
def process_sensor(data: SensorData, user=Depends(get_current_user)):
    result = orchestrator.process(data.dict())
    supabase.table("state_history").insert({
        "user_id": user.id,
        "room": data.room,
        "state_vector": result["state"],
        "agent_action": str(result["action"])
    }).execute()
    return result

@app.post("/api/chat")
def chat(req: ChatRequest, user=Depends(get_current_user)):
    answer = answer_query(req.query, user.id)
    return {"answer": answer}

@app.get("/api/history")
def get_history(user=Depends(get_current_user)):
    data = supabase.table("state_history")\
        .select("*")\
        .eq("user_id", user.id)\
        .order("created_at", desc=True)\
        .limit(20)\
        .execute()
    return data.data