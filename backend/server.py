from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TriNetra AI Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False


# ─── Request / Response Models ────────────────────────────────────

class TranslateRequest(BaseModel):
    text: str
    target_language: str = "Hindi"
    source_language: Optional[str] = None


class TranslateResponse(BaseModel):
    translated_text: str
    target_language: str


class ChatRequest(BaseModel):
    message: str
    session_id: str


class ChatResponse(BaseModel):
    reply: str
    session_id: str


# ─── Routes ───────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "TriNetra AI Backend",
        "ai_available": AI_AVAILABLE and bool(EMERGENT_LLM_KEY),
    }


@app.post("/api/ai/translate", response_model=TranslateResponse)
async def translate_text(req: TranslateRequest):
    if not AI_AVAILABLE or not EMERGENT_LLM_KEY:
        return TranslateResponse(
            translated_text=f"[Translation unavailable] {req.text}",
            target_language=req.target_language,
        )
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"translate_{abs(hash(req.text + req.target_language)) % 100000}",
            system_message=(
                f"You are a precise translator. "
                f"Translate the given text to {req.target_language}. "
                f"Return ONLY the translated text, nothing else. No explanations, no quotes."
            ),
        ).with_model("gemini", "gemini-2.5-flash")

        source_hint = f"from {req.source_language} " if req.source_language else ""
        response = await chat.send_message(
            UserMessage(text=f"Translate {source_hint}to {req.target_language}: {req.text}")
        )
        return TranslateResponse(
            translated_text=response.strip(),
            target_language=req.target_language,
        )
    except Exception as e:
        return TranslateResponse(
            translated_text=req.text,
            target_language=req.target_language,
        )


@app.post("/api/ai/chat", response_model=ChatResponse)
async def ai_chat(req: ChatRequest):
    if not AI_AVAILABLE or not EMERGENT_LLM_KEY:
        return ChatResponse(
            reply="TriNetra AI is currently unavailable. Please check back later.",
            session_id=req.session_id,
        )
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=req.session_id,
            system_message=(
                "You are TriNetra AI — the intelligent assistant built into India's "
                "premium social super-app TriNetra. You help users write engaging posts, "
                "translate content between Hindi and English, summarize discussions, "
                "find connections, and answer questions. "
                "Be concise, friendly, and culturally aware of Indian context. "
                "Support both Hindi and English responses naturally."
            ),
        ).with_model("gemini", "gemini-2.5-flash")

        response = await chat.send_message(UserMessage(text=req.message))
        return ChatResponse(reply=response.strip(), session_id=req.session_id)
    except Exception as e:
        return ChatResponse(
            reply="Sorry, I encountered an error. Please try again.",
            session_id=req.session_id,
        )
