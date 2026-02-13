import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { module, count = 30 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const modulePrompts: Record<string, string> = {
      aptitude:
        "Generate placement aptitude MCQ questions covering quantitative aptitude, logical reasoning, data interpretation, number series, percentages, profit/loss, time & work, permutations, probability.",
      verbal:
        "Generate placement verbal ability MCQ questions covering grammar, vocabulary, reading comprehension, sentence correction, synonyms/antonyms, idioms, para jumbles.",
      technical:
        "Generate placement technical MCQ questions covering data structures, algorithms, OOP, DBMS, OS, networking, C/C++/Java/Python basics, SQL queries.",
      interview:
        "Generate placement interview preparation MCQ questions covering HR questions, behavioral questions, situational judgment, company culture fit, leadership scenarios.",
      general:
        "Generate general knowledge MCQ questions for placements covering current affairs, business awareness, basic science, technology trends, Indian economy.",
    };

    const prompt = modulePrompts[module] || modulePrompts.general;

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
            {
              role: "system",
              content: `You are a placement preparation expert. Generate exactly ${count} unique multiple choice questions. Each question must have 4 options (A, B, C, D) with exactly one correct answer. Vary difficulty across easy, medium, and hard. Provide a brief explanation for each answer.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "save_questions",
                description: `Return exactly ${count} MCQ questions.`,
                parameters: {
                  type: "object",
                  properties: {
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question: { type: "string" },
                          option_a: { type: "string" },
                          option_b: { type: "string" },
                          option_c: { type: "string" },
                          option_d: { type: "string" },
                          correct_option: {
                            type: "string",
                            enum: ["A", "B", "C", "D"],
                          },
                          difficulty: {
                            type: "string",
                            enum: ["easy", "medium", "hard"],
                          },
                          explanation: { type: "string" },
                        },
                        required: [
                          "question",
                          "option_a",
                          "option_b",
                          "option_c",
                          "option_d",
                          "correct_option",
                          "difficulty",
                        ],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["questions"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "save_questions" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const parsed = JSON.parse(toolCall.function.arguments);
    const questions = parsed.questions;

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const rows = questions.map((q: any) => ({
      ...q,
      module,
    }));

    const { error: insertError } = await supabase
      .from("questions")
      .insert(rows);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to store questions");
    }

    return new Response(
      JSON.stringify({ success: true, count: questions.length, questions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
