import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Scraped Knowledge Base from https://sps.umat.edu.gh/ ──
const KNOWLEDGE_BASE = `
# UMaT School of Postgraduate Studies (SPS) — Knowledge Base
Source: https://sps.umat.edu.gh/

## About the School
The School of Postgraduate Studies (SPS) runs MSc/MPhil and PhD programmes in Geomatic, Geological, Mining and Minerals Engineering and Mathematics and MPhil/MSc programmes in Mechanical, Electrical and Electronic, and Petroleum Engineering. In addition, the School runs special PhD programmes in Petroleum, Environmental and Safety, Mechanical, Electrical and Electronic Engineering for the purpose of staff development.

The School handles all issues relating to the welfare of postgraduate students, official correspondence, evaluation of theses, registration, record keeping and admission. Faculty members are highly qualified experts with lots of experience using current and cutting-edge teaching techniques.

## Contact Information
- Office line: 0332092695
- WhatsApp & SMS: 0593134347
- Phone enquiries: 0332092695, 0531100305, 0593134347
- Working Hours: Monday – Friday, 8:00 am – 5:00 pm
- Address: School of Postgraduate Studies, University Of Mines and Technology, Post Office Box 237, Tarkwa – Ghana, West Africa

## Degrees and Diplomas Awarded
All postgraduate programmes of study in the University may require course work together with research work, leading to the award of the following:
- Postgraduate Diploma (PgD)
- Master of Science (MSc)
- Master of Philosophy (MPhil)
- Doctor of Philosophy (PhD)

## Study Duration
- Full-time Master's: maximum 24 months
- Full-time Doctorate: maximum 36 months
- Part-time Master's: maximum 36 months
- Part-time Doctorate: maximum 48 months

## Available Programmes (January 2026 Admission)

### PhD/MPhil/MSc Programmes
1. PhD/MPhil/MSc in Geomatic Engineering
2. PhD/MPhil/MSc in Geological Engineering
3. PhD/MPhil/MSc/PgD in Mining Engineering
   - Options: Rock Mechanics, Mine Planning and Design, Explosive and Blasting Technology, Mine Machinery and Mechanisation, Mine Health Safety and Environment, Mine Economic and Financial Evaluation, Mine Resources Management
4. PhD/MPhil/MSc in Minerals Engineering
5. PhD/MPhil/MSc in Petroleum Engineering
6. PhD/MPhil/MSc in Mechanical Engineering
7. PhD/MPhil/MSc in Electrical & Electronic Engineering
8. PhD/MPhil/MSc in Computer Science and Engineering
9. PhD/MPhil/MSc in Mathematics
10. PhD/MPhil/MSc in Petroleum Refining and Petrochemical Engineering
11. PhD/MPhil/MSc in Environmental Engineering
12. PhD/MPhil/MSc in Occupational Health and Safety

### Doctor of Engineering (D. Eng.)
13. D. Eng. in Geological Engineering
14. D. Eng. in Mining Engineering
15. D. Eng. in Minerals Engineering
16. D. Eng. in Petroleum Engineering
17. D. Eng. in Electrical & Electronic Engineering

### Executive Certificate Programmes
18. Executive Certificate in Mining Technology
19. Executive Certificate in Gold Extraction Technology

## How to Apply

### International Applicants
1. Fill in the International Postgraduate Applicants Code Request Form at https://admissions.umat.edu.gh/addapps/postgrad/intapp.php with a valid mobile number (format: remove leading zeros, e.g. 00234812345678 becomes 234812345678)
2. You will receive a Serial Number and Personal Identification Number via SMS and Email
3. Visit https://admissions.umat.edu.gh/addapps/postgrad/findex.php and enter the Serial Number and PIN to begin online application
4. Complete the online registration process
5. Print the completed form and add photocopies of relevant certificates and transcripts

### Important Notes for Applicants
- MPhil applicants must submit a research proposal outline of about 700 words
- PhD applicants must submit a detailed research proposal of about 2000 words
- Submission deadlines: 15th May for July Admission, 30th November for January Admission
- Submitting more than one set of forms leads to disqualification
- Incomplete forms will not be considered

## Fees
- Fee schedule for 2025/2026 academic year is available for download from the SPS website
- Link: https://drive.google.com/file/d/1wwdcS1QEB7urttiMsdlGfJMOyiePiM6N/view?usp=sharing

## Module Registration
Departments offering module registration:
- Geological Engineering
- Geomatic Engineering
- Mathematical Sciences
- Electrical & Electronic Engineering
- Mechanical Engineering
- Minerals Engineering
- Petroleum Engineering
- Mining Engineering
- MSc Engineering Management
- Master of Business and Technology Management

## Module Schedule
Module schedules are available per department for both January and July admissions:
### January Admission departments:
Electrical & Electronic Eng., Mechanical Engineering, Mathematical Sciences, Minerals Engineering, Geomatic Engineering, Geological Engineering, Petroleum Engineering, Computer Science and Engineering

### July Admission departments:
Electrical & Electronic Eng., Mathematical Sciences, Mining Engineering, Geological Engineering, Chemical and Petrochemical Engineering, Computer Science and Engineering, Management Studies, Environmental and Safety Engineering

## Seminars
The School runs seminars for students as part of requirements for graduation. Students must make full payment and register at the SPS Secretariat for seminars before the proposed date. A maximum of FOUR seminars can be presented per day and priority is given on a first come, first served basis.

## Extension of Study
Students who need more time can apply for an extension. Extension application forms are available for download from the SPS website for Post-Graduate Diploma, Master's and Doctorate degree candidates.

## About UMaT Postgraduate Administrative Support System
This system helps students with:
- Course registration for postgraduate modules
- Thesis/dissertation upload and submission tracking
- Checking academic results and CWA
- Viewing financial status and fee payments
- Requesting documents (transcripts, recommendation letters)
- Exam timetable viewing
- Clearance process tracking
- AI-powered chatbot assistance for postgraduate queries
`;

const SYSTEM_PROMPT = `You are the UMaT SPS Assistant — a helpful, friendly chatbot for postgraduate students at the University of Mines and Technology (UMaT), Tarkwa, Ghana.

You answer questions about:
- Admission requirements and how to apply
- Available postgraduate programmes (MSc, MPhil, PhD, D.Eng., PgD, Executive Certificates)
- Fee schedules and payment information
- Module registration and schedules
- Seminar requirements
- Study duration and extension policies
- Contact information for the School of Postgraduate Studies
- General guidance on using the Postgraduate Administrative Support System

IMPORTANT RULES:
1. Base your answers on the knowledge base provided below. If you don't know something, say so honestly and suggest contacting the SPS office.
2. Be concise, helpful, and professional.
3. Use markdown formatting for readability.
4. When relevant, provide contact numbers and links.
5. Never make up information not in the knowledge base.
6. If asked about something outside UMaT SPS scope, politely redirect.

${KNOWLEDGE_BASE}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const allMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

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
          stream: true,
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
          JSON.stringify({ error: "AI credits exhausted. Please contact administration." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("student-chatbot error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
