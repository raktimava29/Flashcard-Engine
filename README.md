# 📚 AI Flashcard Learning System

An AI-powered learning tool that converts PDFs into structured flashcards and enables adaptive practice using a simplified spaced repetition system.

---

## 🚀 Overview

This project allows users to upload any PDF and automatically generates high-quality flashcards using LLMs. It then provides an interactive practice interface where cards are reviewed based on user performance.

The system is designed to simulate real learning behavior by prioritizing weaker concepts and reducing repetition for familiar ones.

---

* #### Backend Deployed at: https://flashcard-engine-5zbb.onrender.com
* #### Frontend and usable project Deployed at: https://flashcard-engine-theta.vercel.app

---
## ✨ Features

* 📄 Upload PDF and extract content
* 🤖 AI-generated flashcards using LLM (Groq + LLaMA 3)
* 🧹 Structured JSON cleaning and validation
* 🔁 Simplified spaced repetition system
* 🎯 Difficulty-based adaptive review (Easy / Medium / Hard)
* ⚡ Fast in-memory processing (no database required)
* 🎮 Interactive frontend for practicing flashcards
* 📊 Session-based learning (focused subset of cards)

---

## 🧠 How It Works

### 1. PDF → Text Extraction

* Parses uploaded PDF using PyMuPDF
* Cleans and normalizes extracted text

### 2. Chunking

* Splits large text into manageable chunks
* Ensures LLM context remains meaningful

### 3. Flashcard Generation

* Uses Groq API with LLaMA 3 model
* Generates structured Q&A flashcards in JSON format

### 4. Data Cleaning

* Extracts valid JSON from LLM output
* Normalizes fields (question, answer, difficulty)
* Removes duplicates

### 5. Practice Mode

* Displays one card at a time
* User reveals answer and rates difficulty

### 6. Spaced Repetition Logic

Each card maintains:

* `interval` → how long before next review
* `next_review` → timestamp for reappearance

#### Behavior:

* Easy → interval increases → shown less frequently
* Medium → moderate increase
* Hard → interval resets → shown more often

Cards are selected based on earliest `next_review`.

---

## 🧱 Tech Stack

### Backend

* FastAPI (Python)
* Groq API (LLaMA 3)
* PyMuPDF (PDF parsing)

### Frontend

* React
* Tailwind CSS

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/raktimava29/Flashcard-Engine.git
cd Flashcard-Engine-main
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

Run server:

```bash
uvicorn app.main:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🎮 Usage

1. Upload a PDF
2. Flashcards are generated automatically
3. Start practicing:

   * Click “Show Answer”
   * Rate difficulty (Easy / Medium / Hard)
4. Cards adapt based on your responses

---

## ⚠️ Limitations

* No persistence (data resets on restart)
* Single-user session (no authentication)
* Simplified scheduling algorithm

---

## 🔮 Future Improvements

* Persistent storage (MongoDB / PostgreSQL)
* User authentication & multiple decks
* Advanced spaced repetition (SM-2 algorithm)
* Progress tracking dashboard
* Better UI/UX animations
