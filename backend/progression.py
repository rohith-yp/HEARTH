from datetime import date, timedelta

from fastapi import HTTPException

from database import supabase
from wick import update_wick
from wick_memory import (
    save_task_memory,
    save_streak_memory,
    save_stage_memory,
)
from context import build_wick_context
from ai import generate_wick_response


ATTRIBUTE_LEVEL_XP = 100

WICK_STAGES = [
    ("Spark", 0),
    ("Ember", 100),
    ("Flame", 300),
    ("Blaze", 700),
    ("Hearthkeeper", 1500),
]


def get_wick_stage(total_xp: int) -> str:
    current_stage = "Spark"

    for stage, required_xp in WICK_STAGES:
        if total_xp >= required_xp:
            current_stage = stage
        else:
            break

    return current_stage


def detect_stage_up(old_xp: int, new_xp: int):
    old_stage = get_wick_stage(old_xp)
    new_stage = get_wick_stage(new_xp)

    if old_stage != new_stage:
        return {
            "old_stage": old_stage,
            "new_stage": new_stage,
        }

    return None


def complete_task(task_id: str, user_id: str):
    task_response = (
        supabase.table("tasks")
        .select("*")
        .eq("id", task_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    tasks = getattr(task_response, "data", None) or []

    if not tasks:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    task = tasks[0]

    if task.get("completed"):
        raise HTTPException(
            status_code=400,
            detail="Task is already completed",
        )

    xp_reward = int(task.get("xp_reward") or 0)
    coin_reward = int(task.get("coin_reward") or 0)
    attribute_name = task.get("attribute_name")

    updated_task_response = (
        supabase.table("tasks")
        .update({"completed": True})
        .eq("id", task_id)
        .eq("user_id", user_id)
        .eq("completed", False)
        .execute()
    )

    updated_tasks = getattr(updated_task_response, "data", None) or []

    if not updated_tasks:
        raise HTTPException(
            status_code=400,
            detail="Task is already completed",
        )


    supabase.table("task_completions").insert({
        "task_id": task_id,
        "user_id": user_id,
        "xp_earned": xp_reward,
        "coins_earned": coin_reward,
    }).execute()

    profile_response = (
        supabase.table("profiles")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    profiles = getattr(profile_response, "data", None) or []

    if not profiles:
        raise HTTPException(
            status_code=404,
            detail="User profile not found",
        )

    profile = profiles[0]

    old_total_xp = int(profile.get("total_xp") or 0)
    old_coins = int(profile.get("coins") or 0)
    old_streak = int(profile.get("current_streak") or 0)
    longest_streak = int(profile.get("longest_streak") or 0)

    today = date.today()
    last_active = profile.get("last_active_date")

    if last_active:
        if isinstance(last_active, str):
            last_active = date.fromisoformat(last_active)

        if last_active == today:
            new_streak = old_streak

        elif last_active == today - timedelta(days=1):
            new_streak = old_streak + 1

        else:
            new_streak = 1

    else:
        new_streak = 1

    new_longest_streak = max(
        longest_streak,
        new_streak,
    )

    new_total_xp = old_total_xp + xp_reward
    new_coins = old_coins + coin_reward

    stage_transition = detect_stage_up(
        old_xp=old_total_xp,
        new_xp=new_total_xp,
    )

    supabase.table("profiles").update({
        "total_xp": new_total_xp,
        "coins": new_coins,
        "current_streak": new_streak,
        "longest_streak": new_longest_streak,
        "last_active_date": today.isoformat(),
    }).eq("id", user_id).execute()

    attribute = None
    attribute_level_up = False

    if attribute_name:
        attribute_response = (
            supabase.table("attributes")
            .select("*")
            .eq("user_id", user_id)
            .eq("name", attribute_name)
            .limit(1)
            .execute()
        )

        attributes = getattr(attribute_response, "data", None) or []

        if attributes:
            attribute = attributes[0]

            old_attribute_xp = int(
                attribute.get("xp") or 0
            )

            old_level = int(
                attribute.get("level") or 1
            )

            new_attribute_xp = (
                old_attribute_xp + xp_reward
            )

            new_level = max(
                old_level,
                1 + (new_attribute_xp // ATTRIBUTE_LEVEL_XP),
            )

            if new_level > old_level:
                attribute_level_up = True

            attribute_update = (
                supabase.table("attributes")
                .update({
                    "xp": new_attribute_xp,
                    "level": new_level,
                })
                .eq("id", attribute["id"])
                .eq("user_id", user_id)
                .execute()
            )

            updated_attributes = (
                getattr(attribute_update, "data", None) or []
            )

            if updated_attributes:
                attribute = updated_attributes[0]

    wick = update_wick(
        user_id=user_id,
        completed_today=True,
    )

    save_task_memory(
        user_id=user_id,
        task_title=task.get("title") or "Untitled task",
        attribute_name=attribute_name,
    )

    if new_streak > old_streak:
        save_streak_memory(
            user_id=user_id,
            streak=new_streak,
        )

    if stage_transition:
        save_stage_memory(
            user_id=user_id,
            old_stage=stage_transition["old_stage"],
            new_stage=stage_transition["new_stage"],
        )


    wick_response = None

    try:
        if stage_transition:
            ai_message = (
                f"The user just completed the task "
                f"'{task.get('title') or 'Untitled task'}'. "
                f"Wick has evolved from "
                f"{stage_transition['old_stage']} to "
                f"{stage_transition['new_stage']}. "
                f"This is a significant evolution moment. "
                f"React to the stage-up naturally."
            )

        elif attribute_level_up:
            ai_message = (
                f"The user just completed the task "
                f"'{task.get('title') or 'Untitled task'}'. "
                f"Their {attribute_name} attribute has leveled up. "
                f"React naturally to this achievement."
            )

        elif new_streak > old_streak:
            ai_message = (
                f"The user just completed the task "
                f"'{task.get('title') or 'Untitled task'}'. "
                f"Their productivity streak has reached "
                f"{new_streak} days. "
                f"React naturally to the streak."
            )

        else:
            ai_message = (
                f"The user just completed the task "
                f"'{task.get('title') or 'Untitled task'}'."
            )

        context = build_wick_context(
            user_id=user_id,
            user_message=ai_message,
        )

        wick_response = generate_wick_response(context)

    except Exception:
        wick_response = None

    return {
        "message": "Task completed successfully",

        "task": (
            updated_task_response.data[0]
            if updated_task_response.data
            else task
        ),

        "rewards": {
            "xp": xp_reward,
            "coins": coin_reward,
        },

        "progression": {
            "total_xp": new_total_xp,
            "coins": new_coins,
            "current_streak": new_streak,
            "longest_streak": new_longest_streak,
        },

        "attribute": attribute,

        "attribute_level_up": attribute_level_up,

        "wick": wick,

        "stage_transition": stage_transition,

        "wick_response": wick_response,
    }
