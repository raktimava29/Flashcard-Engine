import os
import json
import re
import time
from groq import Groq
from app.utils.chunker import chunker
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key = os.getenv("GROQ_API_KEY"))

FLASHCARDS_STORE =[]
LAST_SERVED_CARD = None

def build_prompt(chunk):
    return f"""
You are an expert teacher.

From the text below, generate high-quality flashcards.

Rules:
- Cover key concepts, definitions, and relationships
- Include conceptual and application-based questions
- Avoid trivial or obvious questions
- Avoid repeating similar questions
- Ensure coverage of different aspects of the topic

Return ONLY valid JSON in this format:
[
  {{
    "question": "...",
    "answer": "...",
    "difficulty": "easy/medium/hard"
  }}
]

Do NOT include any explanation or text outside JSON.

Text:
{chunk}
"""

def generate_flashcards_from_chunk(chunk):
    prompt = build_prompt(chunk)
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role":"user", "content": prompt}
        ],
        temperature=0.5
    )
    
    return response.choices[0].message.content

def extract_json(text):
    try:
        return json.loads(text)
    except:
        pass
    
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except:
            pass
    
    return []        

def normalize_card(card):
    if not isinstance(card,dict):
        return None
    
    question = card.get("question", "").strip()
    answer = card.get("answer", "").strip()
    difficulty = card.get("difficulty", "medium").lower()
    
    if not question or not answer:
        return None
    
    if difficulty not in ["easy", "medium", "hard"]:
        difficulty = "medium"
        
    return {
        "question": question,
        "answer": answer,
        "difficulty": difficulty
    }
    
def clean_flashcards(cards):
    cleaned = []
    
    for card in cards:
        normalized = normalize_card(card)
        if normalized:
            cleaned.append(normalized)

    return cleaned
        
def deduplicate_cards(cards)        :
    seen = set()
    unique = []
    
    for card in cards:
        key = card["question"].lower()
        
        if key not in seen:
            seen.add(key)
            unique.append(card)
    
    return unique        

def initialize_cards(cards):
    now = time.time()
    
    for card in cards:
        card["interval"] = 1
        card["next_review"] = now
        
    return cards

def get_due_card(cards):
    now = time.time()
    
    print("NEXT REVIEWS:", [c["next_review"] for c in cards])

    due_cards = [c for c in cards if c["next_review"] <= now]

    print("DUE CARDS COUNT:", len(due_cards))

    if not due_cards:
        return None

    return min(due_cards, key=lambda c: c["next_review"])

def update_card(card,rating):
    now = time.time()
    
    if rating == "easy":
        card["interval"] *= 2
    elif rating == "medium":
        card["interval"] *= 1.5
    else:
        card["interval"] = 1
        
    card["next_review"] = now + card["interval"] * 5
    
def generate_flashcards(text):
    global FLASHCARDS_STORE, LAST_SERVED_CARD
    chunks = chunker(text)
    all_cards = []
    
    for chunk in chunks:
        raw_output = generate_flashcards_from_chunk(chunk)
        extracted = extract_json(raw_output)
        cleaned = clean_flashcards(extracted)
        
        all_cards.extend(cleaned)

    final_cards = deduplicate_cards(all_cards)
    initialized_cards = initialize_cards(final_cards)
    
    FLASHCARDS_STORE = initialized_cards[:5]
    LAST_SERVED_CARD = None
    return initialized_cards