import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `You are an AI assistant for postgraduate thesis supervisors at UMaT (University of Mines and Technology). 
You help supervisors with:
- Evaluating student submissions and providing constructive feedback
- Understanding evaluation criteria and academic standards
- Tracking student progress and milestones
- Answering questions about thesis guidelines, formatting, and best practices
- Providing summaries of student work and historical feedback
Keep responses concise, professional, and actionable. When comparing items, listing student progress, showing schedules, evaluation criteria, or any structured data, ALWAYS use markdown tables (with | pipes and --- separator rows) for clarity. Use plain text for explanations.`,

  feedback: `You are an AI assistant helping a thesis supervisor review a student's submission.
Based on the submission details provided, generate 3-5 specific, constructive feedback suggestions.
Each suggestion should be actionable and professional.
Format each suggestion as a JSON array of objects with "text" (the feedback) and "category" (one of: "content", "formatting", "references", "methodology", "clarity").
Return ONLY the JSON array, no other text.`,

  checks: `You are an AI assistant that performs automated quality checks on thesis submissions.
Based on the submission details provided, identify potential issues.
Return a JSON array of objects with "issue" (description), "severity" (one of: "high", "medium", "low"), and "section" (affected area).
Return ONLY the JSON array, no other text.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode = "chat", context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...(context ? [{ role: "user", content: `Context: ${JSON.stringify(context)}` }] : []),
      ...messages,
    ];

    const isStreaming = mode === "chat";

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: allMessages,
          stream: isStreaming,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (isStreaming) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("supervisor-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
