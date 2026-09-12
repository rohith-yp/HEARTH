from database import supabase


def save_memory(
    user_id: str,
    memory: str,
    importance: int = 1,
):
    if not memory or not memory.strip():
        return None

    memory_data = {
        "user_id": user_id,
        "memory": memory.strip(),
        "importance": importance,
    }

    response = (
        supabase
        .table("wick_memories")
        .insert(memory_data)
        .execute()
    )

    memories = getattr(response, "data", None) or []

    return memories[0] if memories else None


def get_memories(
    user_id: str,
    limit: int = 10,
):
    response = (
        supabase
        .table("wick_memories")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )

    return getattr(response, "data", None) or []


def save_task_memory(
    user_id: str,
    task_title: str,
    attribute_name: str | None = None,
):
    if attribute_name:
        memory = (
            f"User completed the task '{task_title}' "
            f"and worked on {attribute_name}."
        )
    else:
        memory = f"User completed the task '{task_title}'."

    return save_memory(
        user_id=user_id,
        memory=memory,
        importance=2,
    )


def save_streak_memory(
    user_id: str,
    streak: int,
):
    memory = f"User reached a {streak}-day productivity streak."

    return save_memory(
        user_id=user_id,
        memory=memory,
        importance=3,
    )
