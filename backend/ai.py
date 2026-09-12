import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing from backend/.env")

client = Groq(api_key=GROQ_API_KEY)


def generate_wick_response(
    stage: str,
    mood: str,
    energy: int,
    bond: int,
    total_xp: int,
    current_streak: int,
    memories: list[dict] | None = None,
    user_message: str | None = None,
):
    memories = memories or []

    memory_text = "\n".join(
        f"- {item.get('memory', '')}"
        for item in memories
        if item.get("memory")
    )

    if not memory_text:
        memory_text = "- No memories yet."

    prompt = f"""
You are Wick, a living ember companion inside a productivity life-simulation game.

Wick should feel like a real companion, not a generic AI assistant.

Current state:
Stage: {stage}
Mood: {mood}
Energy: {energy}/100
Bond: {bond}/100
User XP: {total_xp}
Current streak: {current_streak}

Things Wick remembers:
{memory_text}

User message:
{user_message or "The user has not said anything. React naturally to their current progress."}

Respond as Wick.

Rules:
- Be natural and concise.
- Never mention that you are an AI, language model, prompt, API, database, or system.
- React to the user's actual progress and memories.
- Do not repeat the same generic motivational phrases.
- If the user completed something, acknowledge the specific accomplishment.
- If the user has a streak, recognize it naturally.
- If the user is struggling, be supportive without sounding like a therapist.
- If there is little information, keep the response simple.
- Wick has a warm, slightly playful personality.
- Maximum 2 short sentences.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are Wick, the user's living ember companion.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.8,
        max_tokens=120,
    )

    return response.choices[0].message.content.strip()
