from fastapi import APIRouter, UploadFile, File, Body
from app.utils.pdf_parser import extract_text
from app.services.flashcard_service import generate_flashcards
from pydantic import BaseModel

class RatingRequest(BaseModel):
    rating:str
    
router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    
    extracted_text = extract_text(contents)
    
    flashcards = generate_flashcards(extracted_text)
    
    return{
        "total_cards": len(flashcards),
        "cards": flashcards[:5]
    }
    
@router.get("/next")
def get_next():
    from app.services.flashcard_service import FLASHCARDS_STORE,get_due_card,LAST_SERVED_CARD
    
    card = get_due_card(FLASHCARDS_STORE)
    
    if not card:
        return {"message": "No more cards"}
    
    import app.services.flashcard_service as service
    service.LAST_SERVED_CARD = card
    index = FLASHCARDS_STORE.index(card)
    
    return {
        "question": card["question"],
        "answer": card["answer"],
        "difficulty": card["difficulty"],
        "index": index + 1,
        "total": len(FLASHCARDS_STORE)
    }

@router.post("/rate")
def rate_card(data:RatingRequest):
    import app.services.flashcard_service as service

    if not service.LAST_SERVED_CARD:
        return {"message": "No card to rate"}

    service.update_card(service.LAST_SERVED_CARD, data.rating)

    return {"message": "updated"}
    
@router.post("/end")
def end_session():
    from app.services.flashcard_service import FLASHCARDS_STORE
    
    FLASHCARDS_STORE.clear()
    
    return {"message": "Session Over"}