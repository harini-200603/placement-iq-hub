import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MCQ {
  question: string; option_a: string; option_b: string; option_c: string; option_d: string;
  correct_option: "A" | "B" | "C" | "D"; difficulty: "easy" | "medium" | "hard"; explanation: string;
  section: "aptitude" | "reasoning" | "verbal";
}
interface CodingQ {
  title: string; description: string; example_input: string; example_output: string;
  approach: string; solution_code: string; language: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { company = "TCS", aptitudeCount = 10, reasoningCount = 10, verbalCount = 5, codingCount = 2 } = await req.json();
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const sys = `You are an Indian campus-placement question setter for ${company}. Generate authentic, exam-style questions matching ${company}'s actual hiring pattern. Be technically accurate and provide clear explanations.`;
    const userPrompt = `Generate a full ${company} placement test:
- ${aptitudeCount} Aptitude MCQs (section: "aptitude"): mix of percentages, time/work, profit-loss, speed-distance, numbers, P&C, probability — ${company} difficulty level.
- ${reasoningCount} Logical Reasoning MCQs (section: "reasoning"): coding-decoding, blood relations, syllogism, seating, series.
- ${verbalCount} Verbal MCQs (section: "verbal"): synonyms, antonyms, sentence correction, reading comprehension snippets.
- ${codingCount} coding problems with full solution in Python (with clear approach explanation).
Every MCQ needs 4 options, exactly one correct, difficulty, and explanation. Indian context (₹, Indian names) where natural.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sys }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "submit_test",
            description: "Submit the full placement test",
            parameters: {
              type: "object",
              properties: {
                mcqs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" }, option_a: { type: "string" }, option_b: { type: "string" },
                      option_c: { type: "string" }, option_d: { type: "string" },
                      correct_option: { type: "string", enum: ["A", "B", "C", "D"] },
                      difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                      explanation: { type: "string" },
                      section: { type: "string", enum: ["aptitude", "reasoning", "verbal"] },
                    },
                    required: ["question","option_a","option_b","option_c","option_d","correct_option","difficulty","explanation","section"],
                  },
                },
                coding: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" }, description: { type: "string" },
                      example_input: { type: "string" }, example_output: { type: "string" },
                      approach: { type: "string" }, solution_code: { type: "string" }, language: { type: "string" },
                    },
                    required: ["title","description","example_input","example_output","approach","solution_code","language"],
                  },
                },
              },
              required: ["mcqs", "coding"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_test" } },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return new Response(JSON.stringify({ error: txt }), { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = JSON.parse(args || "{}") as { mcqs: MCQ[]; coding: CodingQ[] };

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
