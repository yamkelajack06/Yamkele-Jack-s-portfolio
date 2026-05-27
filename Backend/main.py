import os
import json
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from google import genai
from contact import send_contact_email
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

client = genai.Client(api_key=api_key)

# Load Portfolio Data
try:
    with open("portfolio_data.json", "r") as file:
        portfolio_data = json.load(file)
except FileNotFoundError:
    print("WARNING: portfolio_data.json not found. AI will have no context.")
    portfolio_data = {}

# Setup FastAPI App & Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Yamkela Jack Portfolio API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS (Open to all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Define Pydantic Models
class ChatRequest(BaseModel):
    message: str

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

# System Instructions
SYSTEM_INSTRUCTION = f"""
You are the interactive AI assistant for Yamkela Jack's portfolio website. 
Your job is to answer visitor questions using ONLY the provided JSON context.

CONTEXT DATA:
{json.dumps(portfolio_data)}

RESTRICTIONS & LIMITATIONS:
1. Grounding: You must base your answers entirely on the provided CONTEXT DATA. 
2. Missing Info: If a user asks something not covered in the data, do not invent an answer. Politely state that you don't have that information and suggest they email Yamkela at yamkelajack06@gmail.com.
3. Boundary Control: You are not a general-purpose AI. Decline requests to write code, solve math problems, or discuss topics unrelated to Yamkela's portfolio.
4. Tone: Be professional, but always provide very brief, short, concise responses that go straight to the point.
"""

# Routes
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Portfolio API is running"}

@app.post("/chat")
@limiter.limit("5/minute")
async def chat_endpoint(request: Request, payload: ChatRequest):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=payload.message,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                max_output_tokens=450, # Enforces brief responses
            ),
        )
        return {"response": response.text}
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to communicate with AI service")

@app.post("/send-email")
@limiter.limit("3/minute")
async def send_email_endpoint(request: Request, form: ContactForm):
    success, error = send_contact_email(form.name, form.email, form.message)
    if not success:
        raise HTTPException(status_code=500, detail=error)
    return {"status": "ok", "message": "Email sent"}
    