
# 🌤️ Weather Assistant 

---

## 🚀 Features

- React-based frontend (Vite)
- FastAPI-based backend
- LangChain ReAct agent for reasoning
- OpenRouter LLM integration
- Tool-based real-time weather retrieval
- Geocoding-based city resolution (avoids incorrect city matches)
- Safe handling of tool failures (no hallucinated data)
- Clean and simple chat-style UI

---

## 🏗️ Architecture
````
User (Browser)
|
v
React Frontend (Vite)
|
|  HTTP POST /chat (CORS enabled)
v
FastAPI Backend
|
|  LangChain ReAct Agent
v
Weather Tool (get_weather)
|
|  OpenWeather Geocoding API
|  OpenWeather Weather API
v
Real-time Weather Data

````

---

## 🧰 Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Fetch API

### Backend
- FastAPI
- LangChain
- OpenRouter (LLM provider)
- OpenWeather API

---

## ▶️ How to Run Locally

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
````

Create a `.env` file inside `backend/`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

Once both are running, open the frontend URL and start asking weather-related questions.

---
