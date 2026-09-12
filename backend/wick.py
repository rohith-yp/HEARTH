from datetime import datetime, timezone
from database import supabase


STAGES = [
    ("Spark", 0),
    ("Ember", 100),
    ("Flame", 300),
    ("Blaze", 700),
    ("Hearthkeeper", 1500),
]


def calculate_stage(total_xp: int) -> str:
    current_stage = "Spark"

    for stage, required_xp in STAGES:
        if total_xp >= required_xp:
            current_stage = stage
        else:
            break

    return current_stage


def calculate_mood(
    energy: int,
    current_streak: int,
    completed_today: bool,
) -> str:
    if energy <= 20:
        return "tired"

    if completed_today and current_streak >= 7:
        return "joyful"

    if completed_today:
        return "happy"

    if energy <= 50:
        return "quiet"

    return "neutral"


def calculate_energy(
    current_energy: int,
    completed_today: bool,
) -> int:
    energy = current_energy

    if completed_today:
        energy += 15
    else:
        energy -= 5

    return max(0, min(100, energy))


def update_wick(
    user_id: str,
    completed_today: bool = False,
):
    profile_response = (
        supabase.table("profiles")
        .select("total_xp,current_streak")
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
        supabase.table("wick").insert({
            "user_id": user_id,
            "stage": "Spark",
            "mood": "neutral",
            "energy": 100,
            "bond": 0,
        }).execute()

        wick_rows = [{
            "stage": "Spark",
            "mood": "neutral",
            "energy": 100,
            "bond": 0,
        }]

    wick = wick_rows[0]

    total_xp = int(profile.get("total_xp") or 0)
    current_streak = int(profile.get("current_streak") or 0)
    current_energy = int(wick.get("energy") or 0)
    current_bond = int(wick.get("bond") or 0)

    new_stage = calculate_stage(total_xp)
    new_energy = calculate_energy(
        current_energy,
        completed_today,
    )
    new_mood = calculate_mood(
        new_energy,
        current_streak,
        completed_today,
    )

    if completed_today:
        new_bond = min(100, current_bond + 2)
    else:
        new_bond = current_bond

    update_response = (
        supabase.table("wick")
        .update({
            "stage": new_stage,
            "mood": new_mood,
            "energy": new_energy,
            "bond": new_bond,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })
        .eq("user_id", user_id)
        .execute()
    )

    updated_rows = getattr(update_response, "data", None) or []

    return updated_rows[0] if updated_rows else {
        "stage": new_stage,
        "mood": new_mood,
        "energy": new_energy,
        "bond": new_bond,
    }
