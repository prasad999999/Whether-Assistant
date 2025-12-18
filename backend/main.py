from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import ChatRequest, ChatResponse
from agent import run_agent

app = FastAPI()

# ✅ CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # React dev server (Vite)
        "http://localhost:3000",   # React (CRA, optional)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    response = run_agent(request.message)
    return ChatResponse(response=response)
