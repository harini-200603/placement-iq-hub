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
    const { difficulty = "medium", index = 0 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `You are a coding interview expert. Generate a ${difficulty} level coding problem that is commonly asked in campus placement coding rounds. Include clear problem statement, examples, constraints, test cases, starter code in Python/Java/C/C++/JavaScript, and hints.` },
          { role: "user", content: `Generate coding problem #${index + 1} of ${difficulty} difficulty for placement preparation.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "save_problem",
            description: "Return a coding problem with test cases and starter code.",
            parameters: {
              type: "object",
              properties: {
                problem: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    examples: { type: "array", items: { type: "object", properties: { input: { type: "string" }, output: { type: "string" } }, required: ["input", "output"], additionalProperties: false } },
                    constraints: { type: "array", items: { type: "string" } },
                    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                    testCases: { type: "array", items: { type: "object", properties: { input: { type: "string" }, expectedOutput: { type: "string" } }, required: ["input", "expectedOutput"], additionalProperties: false } },
                    starterCode: { type: "object", properties: { python: { type: "string" }, java: { type: "string" }, c: { type: "string" }, cpp: { type: "string" }, javascript: { type: "string" } }, required: ["python", "java", "c", "cpp", "javascript"], additionalProperties: false },
                    hints: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "description", "examples", "constraints", "difficulty", "testCases", "starterCode", "hints"],
                  additionalProperties: false,
                },
              },
              required: ["problem"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "save_problem" } },
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
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
