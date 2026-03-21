from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TriNetra AI Backend", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
AWS_ACCESS_KEY   = os.environ.get("AWS_ACCESS_KEY", "")
AWS_SECRET_KEY   = os.environ.get("AWS_SECRET_KEY", "")
AWS_S3_BUCKET    = os.environ.get("AWS_S3_BUCKET", "trinetra-media")
AWS_REGION       = os.environ.get("AWS_REGION", "ap-south-1")

try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False

try:
    import boto3
    from botocore.exceptions import ClientError
    AWS_AVAILABLE = bool(AWS_ACCESS_KEY and AWS_SECRET_KEY)
except ImportError:
    AWS_AVAILABLE = False


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


# ─── AWS S3 Media Upload ─────────────────────────────────────────
@app.post("/api/aws/upload")
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form(default="images"),
):
    """Upload a media file to AWS S3. Returns the public CDN URL."""
    if not AWS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="AWS S3 is not configured. Add AWS_ACCESS_KEY and AWS_SECRET_KEY to backend .env",
        )

    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")

        s3 = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION,
        )

        ext = (file.filename or "file").rsplit(".", 1)[-1].lower()
        key = f"{folder}/{uuid.uuid4()}.{ext}"

        s3.put_object(
            Bucket=AWS_S3_BUCKET,
            Key=key,
            Body=contents,
            ContentType=file.content_type or "application/octet-stream",
        )

        cdn_url = f"https://{AWS_S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
        return {"url": cdn_url, "key": key, "bucket": AWS_S3_BUCKET}

    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 upload failed: {e.response['Error']['Message']}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")


# ─── Creator Analytics ───────────────────────────────────────────
class PayoutRequest(BaseModel):
    user_id: str
    amount: float
    method: str  # 'upi' | 'paypal'
    destination: str


@app.get("/api/creator/stats/{user_id}")
async def get_creator_stats(user_id: str):
    """
    Returns creator analytics for a user.
    In production, this reads from Firestore creator_analytics collection.
    For now returns a stub structure — the Flutter app writes and reads
    Firestore directly via the CreatorController.
    """
    return {
        "user_id": user_id,
        "total_posts": 0,
        "total_views": 0,
        "total_ad_impressions": 0,
        "gross_ad_revenue": 0.0,
        "pending_payout": 0.0,
        "paid_out": 0.0,
        "is_creator_pro": False,
        "payout_history": [],
        "note": "Creator analytics are maintained in Firestore. Use the Flutter SDK directly.",
    }


@app.post("/api/creator/payout_request")
async def create_payout_request(req: PayoutRequest):
    """
    Structural payout endpoint.
    The Flutter CreatorController writes to Firestore payout_requests collection.
    This backend endpoint can be used for webhook-based confirmation later.
    """
    return {
        "status": "received",
        "user_id": req.user_id,
        "amount": req.amount,
        "method": req.method,
        "message": "Payout request queued. Processing within 3-5 business days.",
    }


# ─── Stripe Payment Intent (Structural) ─────────────────────────
class StripeIntentRequest(BaseModel):
    amount_inr: float
    currency: str = "inr"
    description: str


@app.post("/api/payment/stripe_intent")
async def create_stripe_intent(req: StripeIntentRequest):
    """
    Structural Stripe Payment Intent endpoint.
    Replace with real Stripe SDK when STRIPE_SECRET_KEY is available.
    """
    stripe_secret = os.environ.get("STRIPE_SECRET_KEY", "")
    if not stripe_secret:
        return {
            "client_secret": f"dummy_pi_{int(req.amount_inr)}_secret_PENDING_STRIPE_ACCOUNT",
            "amount": int(req.amount_inr * 100),
            "currency": req.currency,
            "note": "DUMMY — Add STRIPE_SECRET_KEY to GitHub Secrets for live payments",
        }
    # TODO: Real implementation when Stripe account is ready:
    # import stripe
    # stripe.api_key = stripe_secret
    # intent = stripe.PaymentIntent.create(
    #     amount=int(req.amount_inr * 100),
    #     currency=req.currency,
    #     description=req.description,
    # )
    # return {"client_secret": intent.client_secret}
    return {"client_secret": "not_implemented"}
