from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_parser import extract_text
from app.services.flashcard_service import generate_flashcards

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