const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const getBackgroundQueryFromGemini = async ({
  condition,
  description,
  city,
  isNight,
}) => {
  if (!GEMINI_API_KEY) {
    return null;
  }

  try {
    const prompt = `
You help pick beautiful background photo keywords for a weather app.

Weather condition: ${condition || "Unknown"}
Description: ${description || "n/a"}
City: ${city || "n/a"}
Theme: ${isNight ? "night / dark" : "day / light"}

Return a SHORT comma-separated phrase (max 6 words total) that can be used as an Unsplash search query.
Examples:
- "sunny blue sky, warm city"
- "night skyline, glowing city lights"
- "heavy rain, moody streets"

Only return the keywords, nothing else.
`;

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    return text;
  } catch {
    return null;
  }
};

