from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import get_current_user
from database import auth_client, supabase
from models import initialize_user
from tasks import router as tasks_router

app = FastAPI(
    title="Hearth API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)


class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def root():
    return {
        "message": "Hearth API is running",
        "status": "ok"
    }


@app.get("/health")
def health():
    try:
        supabase.table("profiles").select("id").limit(1).execute()

        return {
            "status": "ok",
            "supabase": "connected",
            "database": "reachable"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.post("/api/auth/signup")
def signup(data: SignupRequest):
    try:
        response = auth_client.auth.sign_up({
            "email": data.email,
            "password": data.password,
        })

        if not response.user:
            raise HTTPException(
                status_code=400,
                detail="Signup failed"
            )

        initialize_user(
            user_id=str(response.user.id),
            email=response.user.email
        )

        return {
            "message": "Account created successfully",
            "user": {
                "id": str(response.user.id),
                "email": response.user.email
            },
            "session": (
                {
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token
                }
                if response.session
                else None
            )
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@app.post("/api/auth/login")
def login(data: LoginRequest):
    try:
        response = auth_client.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })

        if not response.user or not response.session:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        initialize_user(
            user_id=str(response.user.id),
            email=response.user.email
        )

        return {
            "message": "Login successful",
            "user": {
                "id": str(response.user.id),
                "email": response.user.email
            },
            "session": {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token
            }
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


@app.get("/api/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email
    }


@app.get("/api/dashboard")
def get_dashboard(current_user=Depends(get_current_user)):
    user_id = str(current_user.id)

    profile_result = (
        supabase
        .table("profiles")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    wick_result = (
        supabase
        .table("wick")
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    attributes_result = (
        supabase
        .table("attributes")
        .select("*")
        .eq("user_id", user_id)
        .order("name")
        .execute()
    )

    profiles = getattr(profile_result, "data", None) or []
    wick = getattr(wick_result, "data", None) or []
    attributes = getattr(attributes_result, "data", None) or []

    if not profiles:
        raise HTTPException(
            status_code=404,
            detail="Hearth profile not found"
        )

    if not wick:
        raise HTTPException(
            status_code=404,
            detail="Wick not found"
        )

    return {
        "profile": profiles[0],
        "wick": wick[0],
        "attributes": attributes
    }

from progression import complete_task as complete_task_progression


@app.post("/api/tasks/{task_id}/complete")
def complete_task_endpoint(
    task_id: str,
    current_user=Depends(get_current_user)
):
    return complete_task_progression(
        task_id=task_id,
        user_id=str(current_user.id)
    )
from wick_memory import get_memories

@app.get("/api/wick/memories")
def get_wick_memories(
    current_user=Depends(get_current_user),
):
    memories = get_memories(
        user_id=str(current_user.id),
        limit=20,
    )

    return {
        "memories": memories,
    }

from wick_chat import router as wick_chat_router
app.include_router(wick_chat_router)
