from groq import Groq
import os
import json
from app.utils.chunker import chunker
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key = os.getenv("GROQ_API_KEY"))

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

def parse_flashcards(response_text):
    try:
        return json.loads(response_text)
    except:
        return []
    
def generate_flashcards(text):
    chunks = chunker(text)
    all_cards = []
    
    for chunk in chunks:
        raw_output = generate_flashcards_from_chunk(chunk)
        parsed_cards = parse_flashcards(raw_output)
        
        all_cards.extend(parsed_cards)
    
    return all_cards        