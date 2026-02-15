import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, question, answer, passage, spoken } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "get-questions") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are an HR interview expert for campus placements." },
            { role: "user", content: "Generate 10 common HR interview questions asked in campus placements. For each question provide tips on how to answer and a sample answer." },
          ],
          tools: [{
            type: "function",
            function: {
              name: "save_questions",
              description: "Return HR interview questions with tips and sample answers.",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        tips: { type: "array", items: { type: "string" } },
                        sampleAnswer: { type: "string" },
                      },
                      required: ["question", "tips", "sampleAnswer"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "save_questions" } },
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI error");
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call");
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ questions: parsed.questions }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "evaluate-answer") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are an HR interview coach. Evaluate the candidate's answer. Give a score out of 10, highlight strengths, areas to improve, and suggest a better version. Be encouraging but honest. Use markdown formatting." },
            { role: "user", content: `HR Question: "${question}"\n\nCandidate's Answer: "${answer}"\n\nPlease evaluate this answer.` },
          ],
        }),
      });
      if (!response.ok) throw new Error("AI error");
      const data = await response.json();
      const feedback = data.choices?.[0]?.message?.content || "No feedback available.";
      return new Response(JSON.stringify({ feedback }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "get-reading-passage") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "Generate a short professional passage (80-120 words) suitable for a reading fluency assessment in a placement interview. The passage should be about technology, business, or professional development. Return ONLY the passage text, no extra formatting." },
            { role: "user", content: "Generate a reading passage for fluency assessment." },
          ],
        }),
      });
      if (!response.ok) throw new Error("AI error");
      const data = await response.json();
      const passage_text = data.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ passage: passage_text }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "evaluate-reading") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a reading and communication skills assessor. Compare the original passage with what was spoken. Evaluate: accuracy (words matched), fluency, pronunciation quality (based on speech-to-text accuracy), and overall reading score out of 10. Provide specific feedback. Use markdown." },
            { role: "user", content: `Original Passage:\n"${passage}"\n\nSpoken Text (from speech-to-text):\n"${spoken}"\n\nEvaluate the reading.` },
          ],
        }),
      });
      if (!response.ok) throw new Error("AI error");
      const data = await response.json();
      const feedback = data.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ feedback }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
