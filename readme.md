# Yamkela Jack – Full Stack Developer Portfolio

Personal portfolio website built by Yamkela Jack, a Computer Science student at Wits University. Features an AI assistant, dynamic project case studies, dark/light mode, and a working contact form.

## Tech Stack

**Frontend**  
- HTML5, CSS3, JavaScript (Vanilla)  
- Canvas API (particle network background)  
- Google Fonts (Permanent Marker, DM Mono, Inter)  

**Backend**  
- FastAPI (Python)  
- Gemini AI (Google Generative AI)  
- Gmail SMTP (email sending)  
- python-dotenv, slowapi (rate limiting)  

**Deployment**  
- Frontend: Vercel  
- Backend: Render  

## Features

- Interactive hero – typewriter tagline + animated name characters  
- Dark / Light mode – toggle with persistent localStorage  
- Particle network – dynamic canvas background with theme-aware colors  
- Responsive design – mobile menu, grid layout, touch-friendly cards  
- AI Assistant (AXIOM) – chat with a Gemini-powered assistant that answers questions using your portfolio data (grounded, no hallucinations)  
- Project detail views – click any project card to see full case study (why, what, features, stack, constraints, future roadmap)  
- Video demos – embedded Streamable videos for Study Flow & Moja Market  
- Contact form – sends emails to yamkelajack06@gmail.com via backend SMTP (rate-limited to 3 per minute)  
- Downloadable CV – cv-yamkela-jack.pdf (add your own file)  

## Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install fastapi uvicorn python-dotenv google-generativeai slowapi
uvicorn main:app --reload

# Frontend – open index.html with live server (e.g., VS Code Live Server)