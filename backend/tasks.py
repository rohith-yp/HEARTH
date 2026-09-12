from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator

from auth import get_current_user
from database import supabase

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    category: str | None = None
    attribute_name: str | None = None
    due_date: date | None = None

    @field_validator("due_date", mode="before")
    @classmethod
    def parse_due_date(cls, value):
        if value is None or value == "":
            return None

        if isinstance(value, date):
            return value

        if isinstance(value, str):
            value = value.strip()

            for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
                try:
                    return datetime.strptime(value, fmt).date()
                except ValueError:
                    continue

        raise ValueError(
            "Invalid due_date. Use DD/MM/YYYY or YYYY-MM-DD."
        )

    @field_validator("attribute_name", mode="before")
    @classmethod
    def normalize_attribute(cls, value):
        if value is None or value == "":
            return None

        if not isinstance(value, str):
            raise ValueError("attribute_name must be a string")

        value = value.strip()

        if not value:
            return None

        attribute_map = {
            "focus": "Focus",
            "health": "Health",
            "knowledge": "Knowledge",
            "discipline": "Discipline",
            "creativity": "Creativity",
        }

        return attribute_map.get(value.lower(), value)


@router.post("")
def create_task(
    data: TaskCreate,
    current_user=Depends(get_current_user),
):
    user_id = str(current_user.id)

    title = data.title.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Task title cannot be empty",
        )

    task_data = {
        "user_id": user_id,
        "title": title,
        "description": data.description,
        "category": data.category,
        "attribute_name": data.attribute_name,
        "xp_reward": 10,
        "coin_reward": 5,
        "completed": False,
        "due_date": (
            data.due_date.isoformat()
            if data.due_date
            else None
        ),
    }

    try:
        response = (
            supabase
            .table("tasks")
            .insert(task_data)
            .execute()
        )

        tasks = getattr(response, "data", None) or []

        if not tasks:
            raise HTTPException(
                status_code=500,
                detail="Task could not be created",
            )

        return {
            "message": "Task created successfully",
            "task": tasks[0],
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create task: {str(e)}",
        )


@router.get("")
def get_tasks(
    current_user=Depends(get_current_user),
):
    user_id = str(current_user.id)

    try:
        response = (
            supabase
            .table("tasks")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "tasks": getattr(response, "data", None) or []
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch tasks: {str(e)}",
        )


@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    current_user=Depends(get_current_user),
):
    user_id = str(current_user.id)

    try:
        existing = (
            supabase
            .table("tasks")
            .select("id")
            .eq("id", task_id)
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        existing_tasks = getattr(existing, "data", None) or []

        if not existing_tasks:
            raise HTTPException(
                status_code=404,
                detail="Task not found",
            )

        (
            supabase
            .table("tasks")
            .delete()
            .eq("id", task_id)
            .eq("user_id", user_id)
            .execute()
        )

        return {
            "message": "Task deleted successfully",
            "task_id": task_id,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete task: {str(e)}",
        )
