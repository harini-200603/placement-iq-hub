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
    const { subject, topic, company = "general", count = 10 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const currentYear = new Date().getFullYear();

    const companyContext = company !== "general"
      ? `Focus specifically on ${company} placement exam patterns for ${currentYear}. Include the style, difficulty level, and question types that ${company} is known to ask.`
      : `Cover questions from TCS, Infosys, Wipro, Cognizant, Accenture placement exams for ${currentYear}.`;

    const subjectPrompts: Record<string, string> = {
      aptitude: `Generate ${count} MCQ questions on "${topic}" for quantitative aptitude placement preparation. ${companyContext} Include numerical problems, formula-based questions, and shortcut-method questions.`,
      "logical-reasoning": `Generate ${count} MCQ questions on "${topic}" for logical reasoning placement preparation. ${companyContext} Include pattern recognition, analytical reasoning, and logical deduction questions.`,
      "verbal-ability": `Generate ${count} MCQ questions on "${topic}" for verbal ability placement preparation. ${companyContext} Include grammar, vocabulary, comprehension, and sentence correction questions.`,
      "hr-interview": `Generate ${count} scenario-based MCQ questions on "${topic}" for HR interview preparation. ${companyContext} Include behavioral, situational judgment, and company culture fit questions.`,
      java: `Generate ${count} technical MCQ questions on "${topic}" in Java programming. ${companyContext} Include code output prediction, concept-based, and debugging questions with code snippets.`,
      python: `Generate ${count} technical MCQ questions on "${topic}" in Python programming. ${companyContext} Include code output prediction, concept-based, and debugging questions with code snippets.`,
      "c-lang": `Generate ${count} technical MCQ questions on "${topic}" in C programming. ${companyContext} Include code output, pointer-based, and memory management questions.`,
      html: `Generate ${count} technical MCQ questions on "${topic}" in HTML. ${companyContext} Include semantic HTML, attributes, and web standards questions.`,
      css: `Generate ${count} technical MCQ questions on "${topic}" in CSS. ${companyContext} Include layout, styling, responsive design, and specificity questions.`,
      javascript: `Generate ${count} technical MCQ questions on "${topic}" in JavaScript. ${companyContext} Include code output, async, DOM, and ES6+ feature questions.`,
    };

    const prompt = subjectPrompts[subject] || `Generate ${count} MCQ questions on "${topic}" for placement preparation. ${companyContext}`;

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
              content: `You are a placement preparation expert specializing in ${currentYear} campus recruitment. Generate exactly ${count} unique MCQ questions. Each must have 4 options (A, B, C, D) with exactly one correct answer. Vary difficulty (easy/medium/hard). Provide a clear explanation for each answer. For coding questions, include code snippets in the question text.`,
            },
            { role: "user", content: prompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "save_questions",
                description: `Return exactly ${count} MCQ questions with solutions.`,
                parameters: {
                  type: "object",
                  properties: {
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question: { type: "string", description: "The question text, can include code snippets" },
                          option_a: { type: "string" },
                          option_b: { type: "string" },
                          option_c: { type: "string" },
                          option_d: { type: "string" },
                          correct_option: { type: "string", enum: ["A", "B", "C", "D"] },
                          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                          explanation: { type: "string", description: "Detailed explanation of the correct answer with solution steps" },
                          company_relevance: { type: "string", description: "Which companies frequently ask this type (e.g. TCS, Infosys)" },
                        },
                        required: ["question", "option_a", "option_b", "option_c", "option_d", "correct_option", "difficulty", "explanation"],
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
          tool_choice: { type: "function", function: { name: "save_questions" } },
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

    return new Response(
      JSON.stringify({ success: true, questions: parsed.questions }),
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
