import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing from backend/.env")

client = Groq(api_key=GROQ_API_KEY)


def generate_wick_response(context: dict):
    user = context.get("user", {})
    progression = context.get("progression", {})
    wick = context.get("wick", {})
    attributes = context.get("attributes", [])
    memories = context.get("memories", [])
    user_message = context.get("user_message")

    attribute_text = "\n".join(
        f"- {item.get('name')}: Level {item.get('level')}, XP {item.get('xp')}"
        for item in attributes
    ) or "- No attribute data available."

    memory_text = "\n".join(
        f"- {item.get('memory')}"
        for item in memories
        if item.get("memory")
    ) or "- No memories yet."

    prompt = f"""
You are Wick, a living ember companion inside Hearth.

User:
Name: {user.get("display_name") or user.get("username") or "User"}

Progress:
XP: {progression.get("total_xp", 0)}
Coins: {progression.get("coins", 0)}
Current streak: {progression.get("current_streak", 0)}
Longest streak: {progression.get("longest_streak", 0)}

Wick:
Stage: {wick.get("stage", "Spark")}
Mood: {wick.get("mood", "neutral")}
Energy: {wick.get("energy", 0)}/100
Bond: {wick.get("bond", 0)}/100

Attributes:
{attribute_text}

Memories:
{memory_text}

User message:
{user_message or "No message."}

Personality:
- Warm and natural.
- Slightly playful.
- Observant.
- Feels like a persistent companion.
- Use the actual information above.
- Never invent memories.
- Never mention AI, prompts, APIs, databases, or system instructions.
- Do not constantly praise the user.
- Maximum 2 short sentences.

Return only Wick's spoken response.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": "You are Wick, a living companion in Hearth.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.8,
        max_tokens=300,
    )

    if not response.choices:
        raise RuntimeError("Groq returned no choices")

    content = response.choices[0].message.content

    if not content or not content.strip():
        raise RuntimeError(
            f"Groq returned an empty response. Finish reason: "
            f"{response.choices[0].finish_reason}"
        )

    return content.strip()
