// api/ai.js — Vercel Serverless Function
// Proxy Gemini calls để giữ API key an toàn trên server
// Đồng thời log event analytics vào Vercel KV (nếu có) hoặc console

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt, city, vibe, days, budget, sessionId } = req.body;

    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) return res.status(500).json({ error: "API key not configured" });

    // Log analytics event
    console.log(JSON.stringify({
      event: "ai_generate",
      ts: new Date().toISOString(),
      sessionId: sessionId || "anon",
      city,
      vibe,
      days,
      budget,
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown",
      ua: req.headers["user-agent"] || ""
    }));

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 2000 },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      return res.status(geminiRes.status).json({ error: err?.error?.message || "Gemini error" });
    }

    const data = await geminiRes.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("AI proxy error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
