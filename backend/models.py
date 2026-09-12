from database import supabase


DEFAULT_ATTRIBUTES = [
    "Focus",
    "Health",
    "Knowledge",
    "Discipline",
    "Creativity",
]


def initialize_user(user_id: str, email: str | None = None):
    # -------------------------
    # PROFILE
    # -------------------------
    profile_result = (
        supabase
        .table("profiles")
        .select("id")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    profiles = getattr(profile_result, "data", None) or []

    if not profiles:
        username = (
            email.split("@")[0]
            if email and "@" in email
            else f"user_{user_id[:8]}"
        )

        # Make username safe if the email prefix already exists
        username_result = (
            supabase
            .table("profiles")
            .select("id")
            .eq("username", username)
            .limit(1)
            .execute()
        )

        existing_username = getattr(username_result, "data", None) or []

        if existing_username:
            username = f"{username}_{user_id[:6]}"

        supabase.table("profiles").insert({
            "id": user_id,
            "username": username,
            "display_name": username,
        }).execute()

    # -------------------------
    # WICK
    # -------------------------
    wick_result = (
        supabase
        .table("wick")
        .select("id")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    wick_rows = getattr(wick_result, "data", None) or []

    if not wick_rows:
        supabase.table("wick").insert({
            "user_id": user_id,
            "stage": "Spark",
            "mood": "neutral",
            "energy": 100,
            "bond": 0,
        }).execute()

    # -------------------------
    # ATTRIBUTES
    # -------------------------
    attributes_result = (
        supabase
        .table("attributes")
        .select("name")
        .eq("user_id", user_id)
        .execute()
    )

    attribute_rows = getattr(attributes_result, "data", None) or []

    existing_names = {
        item["name"]
        for item in attribute_rows
        if item.get("name")
    }

    missing_attributes = [
        {
            "user_id": user_id,
            "name": name,
            "level": 1,
            "xp": 0,
        }
        for name in DEFAULT_ATTRIBUTES
        if name not in existing_names
    ]

    if missing_attributes:
        supabase.table("attributes").insert(
            missing_attributes
        ).execute()

    return True
