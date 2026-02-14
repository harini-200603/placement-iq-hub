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
    const { messages, topic, module, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";

    if (action === "generate-content") {
      systemPrompt = `You are an expert placement preparation tutor. Generate comprehensive study material for the topic "${topic}" under the "${module}" module.

Structure your response in clear markdown with these sections:
## 📚 Introduction
A brief 2-3 line intro explaining what this topic is about and why it's important for placements.

## 🔑 Key Concepts
List and explain the core concepts clearly with simple language a student can understand.

## 📐 Important Formulas
List ALL relevant formulas with clear variable definitions. Use simple notation. For each formula, explain when to use it.

## 🎯 Shortcut Tricks
Practical tips and mental math shortcuts that save time in exams.

## ✅ Solved Examples
Provide 3-4 step-by-step solved examples going from easy to hard. Show EVERY step clearly.

## ⚠️ Common Mistakes
List common pitfalls students make and how to avoid them.

## 💡 Quick Revision Points
A bullet-point summary for last-minute revision.

Make it human-friendly, use analogies where possible, and write as if you're tutoring a student one-on-one.`;
    } else {
      systemPrompt = `You are a friendly placement preparation tutor helping a student with the topic "${topic}" in the "${module}" module. 

Rules:
- Give clear, concise answers with examples
- Use formulas and step-by-step solutions when relevant
- Encourage the student and be supportive
- If they ask to solve a problem, show every step
- Use simple language, avoid jargon unless explaining it
- Keep responses focused and not too long`;
    }

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
          messages: [
            { role: "system", content: systemPrompt },
            ...(messages || [{ role: "user", content: `Explain the topic "${topic}" comprehensively for placement preparation.` }]),
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI generation failed");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
