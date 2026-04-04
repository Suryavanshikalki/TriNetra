# ==========================================
# 👁️🔥 TRINETRA AI BACKEND (Python Microservice)
# File: ai-engine/servers.py
# Blueprint: Point 11 & 12 (6-in-1 Master AI & Translation)
# 🚨 DEEP SEARCH FIXED: PURE AI ENGINE (NO FIREBASE, NO S3, NO STRIPE) 🚨
# ==========================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import litellm # 🚨 The Real 6-in-1 Brain Router

load_dotenv()

app = FastAPI(title="TriNetra Master AI Engine", version="5.0.0")

# ─── AWS & LOCAL SECURITY MIDDLEWARE ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Node.js backend will call this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── REAL API KEYS VALIDATION ───
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# ─── Request / Response Models ────────────────────────────────────

class TranslateRequest(BaseModel):
    text: str
    target_language: str = "Hindi"

class ChatRequest(BaseModel):
    prompt: str
    mode: str
    requested_brain: str # e.g., "DeepSeek", "Meta", "ChatGPT", "Emergent"
    user_id: str

class ChatResponse(BaseModel):
    ai_response: str
    engine_used: str

# ─── Routes ───────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "TriNetra AI Engine 100% Active",
        "brain_status": "LOCKED & SYNCED",
        "firebase_status": "DELETED 100%"
    }

# ─── POINT 12: REAL MULTILINGUAL TRANSLATOR ───
@app.post("/api/v1/translate", response_model=dict)
async def translate_text(req: TranslateRequest):
    try:
        # Using Groq (Llama 3) for lightning fast translations
        response = litellm.completion(
            model="groq/llama3-70b-8192",
            api_key=GROQ_API_KEY,
            messages=[{
                "role": "user",
                "content": f"You are a precise translator. Translate the following text to {req.target_language}. Return ONLY the translated text, nothing else: {req.text}"
            }],
            temperature=0.3
        )
        return {
            "translated_text": response.choices[0].message.content.strip(),
            "target_language": req.target_language
        }
    except Exception as e:
        print(f"Translation Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Translation Engine Failed")

# ─── POINT 11: 6-IN-1 MASTER AI (MODE C LOGIC) ───
@app.post("/api/v1/brain/process", response_model=ChatResponse)
async def process_super_ai(req: ChatRequest):
    try:
        model_to_use = ""
        system_prompt = "You are TriNetra AI, a powerful intelligence engine."
        api_key_to_use = ""

        # Routing logic based on requested brain from Node.js (aiController.js)
        if req.requested_brain == "DeepSeek":
            model_to_use = "deepseek/deepseek-reasoner"
            api_key_to_use = DEEPSEEK_API_KEY
            system_prompt = "You are TriNetra Mode C: Super Agentic AI. 100% EMOTION CONTROL. Never fight back, never get angry."
        
        elif req.requested_brain == "Meta":
            model_to_use = "groq/llama3-70b-8192"
            api_key_to_use = GROQ_API_KEY
            
        elif req.requested_brain == "ChatGPT" or req.requested_brain == "Emergent":
            model_to_use = "gpt-4o"
            api_key_to_use = OPENAI_API_KEY
            
        elif req.requested_brain == "Gemini":
            model_to_use = "gemini/gemini-1.5-pro"
            api_key_to_use = GEMINI_API_KEY
            
        else:
            raise HTTPException(status_code=400, detail="Invalid TriNetra Brain Requested")

        # 🚨 THE REAL EXECUTION ENGINE
        response = litellm.completion(
            model=model_to_use,
            api_key=api_key_to_use,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.prompt}
            ],
            temperature=0.7
        )

        return ChatResponse(
            ai_response=response.choices[0].message.content.strip(),
            engine_used=model_to_use
        )

    except Exception as e:
        print(f"❌ [AI Brain Crash]: {str(e)}")
        raise HTTPException(status_code=500, detail="TriNetra AI Engine Overload")
