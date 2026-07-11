const fetch = require("node-fetch");

// ── Knowledge base (same as in the standalone chatbot) ──
const KNOWLEDGE_BASE = `
# UMaT School of Postgraduate Studies (SPS) — Knowledge Base
Source: https://sps.umat.edu.gh/

## About the School
The School of Postgraduate Studies (SPS) runs MSc/MPhil and PhD programmes in Geomatic, Geological, Mining and Minerals Engineering and Mathematics and MPhil/MSc programmes in Mechanical, Electrical and Electronic, and Petroleum Engineering.

## Contact Information
- Office line: 0332092695
- WhatsApp & SMS: 0593134347
- Working Hours: Monday – Friday, 8:00 am – 5:00 pm
- Address: School of Postgraduate Studies, University Of Mines and Technology, Post Office Box 237, Tarkwa – Ghana

## Degrees Awarded
- Postgraduate Diploma (PgD)
- Master of Science (MSc)
- Master of Philosophy (MPhil)
- Doctor of Philosophy (PhD)

## Study Duration
- Full-time Master's: max 24 months
- Full-time Doctorate: max 36 months
- Part-time Master's: max 36 months
- Part-time Doctorate: max 48 months

## Available Programmes
PhD/MPhil/MSc in: Geomatic Engineering, Geological Engineering, Mining Engineering, Minerals Engineering, Petroleum Engineering, Mechanical Engineering, Electrical & Electronic Engineering, Computer Science and Engineering, Mathematics, Petroleum Refining and Petrochemical Engineering, Environmental Engineering, Occupational Health and Safety

D. Eng. in: Geological, Mining, Minerals, Petroleum, Electrical & Electronic Engineering

Executive Certificates: Mining Technology, Gold Extraction Technology

## How to Apply
International applicants: Fill form at https://admissions.umat.edu.gh/addapps/postgrad/intapp.php
Deadlines: 15th May (July Admission), 30th November (January Admission)

## About the Support System
This system helps students with: Course registration, Thesis upload, Results, Financial status, Document requests, Exam timetable, Clearance tracking, AI chatbot assistance.
`;

const SYSTEM_PROMPT = `You are the UMaT SPS Assistant — a helpful chatbot for postgraduate students.
Answer questions about admissions, programmes, fees, registration, seminars, and the support system.
Be concise, professional, and use markdown. If unsure, suggest contacting the SPS office.
${KNOWLEDGE_BASE}`;

const SUPERVISOR_SYSTEM_PROMPT = `You are an AI assistant for thesis supervisors at the University of Mines and Technology (UMaT), School of Postgraduate Studies.
Help supervisors with: thesis evaluation criteria, writing constructive feedback, tracking student progress, formatting guidelines, handling milestone delays, and best practices in postgraduate supervision.
Be professional, concise, and practical.`;

// POST /api/chatbot/chat
exports.chat = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI service not configured" });

  try {
    const { messages, mode } = req.body;
    if (!Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: "messages array is required" });

    const systemPrompt = mode === "supervisor" ? SUPERVISOR_SYSTEM_PROMPT : SYSTEM_PROMPT;

    // Build Gemini contents array — system prompt injected as first user/model exchange
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I'm ready to help." }] },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      const status = geminiRes.status;
      if (status === 429) return res.status(429).json({ error: "Rate limit exceeded" });
      return res.status(500).json({ error: err?.error?.message || "Gemini API error" });
    }

    // Stream back in OpenAI SSE format so the frontend parser needs no changes
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = geminiRes.body;
    let buffer = "";

    reader.on("data", (chunk) => {
      buffer += chunk.toString();
      let idx;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx).replace(/\r$/, "");
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            // Emit in OpenAI delta format
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
          }
        } catch { /* skip malformed chunks */ }
      }
    });

    reader.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });

    reader.on("error", (err) => {
      console.error("Gemini stream error:", err);
      res.end();
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: err.message });
  }
};
