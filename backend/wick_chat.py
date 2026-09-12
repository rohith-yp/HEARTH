from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import get_current_user
from context import build_wick_context
from ai import generate_wick_response

router = APIRouter(prefix="/api/wick", tags=["Wick AI"])


class WickChatRequest(BaseModel):
    message: str


@router.post("/chat")
def wick_chat(
    data: WickChatRequest,
    current_user=Depends(get_current_user),
):
    message = data.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    try:
        context = build_wick_context(
            user_id=str(current_user.id),
            user_message=message,
        )

        response = generate_wick_response(context)

        return {
            "response": response,
            "wick": context["wick"],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Wick AI failed: {str(e)}",
        )
