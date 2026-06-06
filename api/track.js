// api/track.js — Analytics Event Collector
// Nhận behavioral events từ app, log vào Vercel, có thể pipe sang bất kỳ warehouse nào

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const body = req.body;
    const event = {
      ...body,
      ts: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown",
      ua: req.headers["user-agent"] || "",
      ref: req.headers["referer"] || "",
    };

    // Vercel logs — xem trong Dashboard > Functions > Logs
    // Dùng prefix LAKA_EVT để dễ filter
    console.log("LAKA_EVT", JSON.stringify(event));

    // ── Optional: Pipe sang Google Sheets / Slack / Webhook ──
    // if (process.env.WEBHOOK_URL) {
    //   await fetch(process.env.WEBHOOK_URL, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(event),
    //   });
    // }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
}
