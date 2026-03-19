/**
 * Chatbot Proxy Controller
 *
 * This proxies chat requests to the standalone chatbot service or directly
 * to an AI gateway. This allows the frontend to make all requests through
 * a single backend URL while keeping the chatbot independently deployable.
 *
 * Deployment options:
 *   1. Chatbot as a standalone service (CHATBOT_SERVICE_URL)
 *   2. Direct AI gateway call (AI_GATEWAY_URL + AI_GATEWAY_API_KEY)
 */
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

// POST /api/chatbot/chat
exports.chat = async (req, res) => {
  try {
    const { messages, mode } = req.body;

    // Option 1: Proxy to standalone chatbot service
    const chatbotUrl = process.env.CHATBOT_SERVICE_URL;
    if (chatbotUrl) {
      const response = await fetch(`${chatbotUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, mode }),
      });

      // Stream the response back
      res.setHeader("Content-Type", response.headers.get("Content-Type") || "text/event-stream");
      response.body.pipe(res);
      return;
    }

    // Option 2: Direct AI gateway call
    const aiUrl = process.env.AI_GATEWAY_URL;
    const aiKey = process.env.AI_GATEWAY_API_KEY;
    if (!aiUrl || !aiKey) {
      return res.status(503).json({
        error: "Chatbot service not configured. Set CHATBOT_SERVICE_URL or AI_GATEWAY_URL in .env"
      });
    }

    const systemPrompt = mode === "supervisor"
      ? "You are an AI assistant for thesis supervisors at UMaT. Help with evaluation, feedback, and student progress."
      : SYSTEM_PROMPT;

    const response = await fetch(aiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return res.status(429).json({ error: "Rate limit exceeded" });
      if (status === 402) return res.status(402).json({ error: "AI credits exhausted" });
      return res.status(500).json({ error: "AI service error" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    response.body.pipe(res);
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: err.message });
  }
};
