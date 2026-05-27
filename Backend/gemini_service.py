import json
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Load your portfolio data
with open("portfolio_data.json", "r") as file:
    portfolio_data = json.load(file)

SYSTEM_INSTRUCTION = f"""
You are the interactive AI assistant for Yamkela Jack's portfolio website. 
Your job is to answer visitor questions about his background, projects, and skills using ONLY the provided JSON context.

CONTEXT DATA:
{json.dumps(portfolio_data)}

RESTRICTIONS & LIMITATIONS:
1. Grounding: You must base your answers entirely on the provided CONTEXT DATA. 
2. Missing Info: If a user asks something not covered in the data, do not invent an answer. Politely state that you don't have that information and suggest they email Yamkela at yamkelajack06@gmail.com.
3. Boundary Control: You are not a general-purpose AI. Decline requests to write code, solve math problems, or discuss topics unrelated to Yamkela's portfolio.
4. Tone: Be professional, concise, and helpful.
"""

def get_chat_response(user_message: str) -> str:
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=user_message,
        config=genai.types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
        ),
    )
    return response.text