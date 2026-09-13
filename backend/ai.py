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

    models_to_try = [
        "groq/compound-mini",
        "groq/compound",
        "qwen/qwen3.6-27b",
        "openai/gpt-oss-20b",
    ]

    for model in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model,
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
                temperature=0.7,
                max_tokens=250,
            )
            if response and response.choices and response.choices[0].message.content:
                content = response.choices[0].message.content.strip()
                if content:
                    return content
        except Exception as err:
            print(f"[Wick AI] Model {model} call failed: {err}")
            continue

    return "I'm right here beside you by the hearth fire. Keep feeding your habits and taking steady steps forward!"
