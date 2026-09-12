from database import supabase


def build_wick_context(user_id: str, user_message: str | None = None):
    profile_response = (
        supabase.table("profiles")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    profiles = getattr(profile_response, "data", None) or []

    if not profiles:
        raise ValueError("User profile not found")

    profile = profiles[0]

    wick_response = (
        supabase.table("wick")
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    wick_rows = getattr(wick_response, "data", None) or []

    if not wick_rows:
        raise ValueError("Wick state not found")

    wick = wick_rows[0]

    attributes_response = (
        supabase.table("attributes")
        .select("name,level,xp")
        .eq("user_id", user_id)
        .order("name")
        .execute()
    )

    attributes = getattr(attributes_response, "data", None) or []

    memories_response = (
        supabase.table("wick_memories")
        .select("memory,importance,created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(10)
        .execute()
    )

    memories = getattr(memories_response, "data", None) or []

    return {
        "user": {
            "username": profile.get("username"),
            "display_name": profile.get("display_name"),
        },
        "progression": {
            "total_xp": int(profile.get("total_xp") or 0),
            "coins": int(profile.get("coins") or 0),
            "current_streak": int(profile.get("current_streak") or 0),
            "longest_streak": int(profile.get("longest_streak") or 0),
        },
        "wick": {
            "stage": wick.get("stage"),
            "mood": wick.get("mood"),
            "energy": int(wick.get("energy") or 0),
            "bond": int(wick.get("bond") or 0),
        },
        "attributes": attributes,
        "memories": memories,
        "user_message": user_message,
    }
