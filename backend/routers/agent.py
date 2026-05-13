from fastapi import APIRouter, Depends
from database import get_db
import schemas
from sqlalchemy.orm import Session
from agent.graph import run_agent

router = APIRouter(prefix="/api/agent", tags=["Agent"])

@router.get("/chat", response_model = schemas.ChatResponse)
def chat(payload: schemas.ChatRequest, db: Session = Depends(get_db)):
    reply = run_agent(payload.message, payload.session_id, db)

    return schemas.ChatResponse(reply=reply, session_id = payload.session_id)