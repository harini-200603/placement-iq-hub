import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Tool schemas per analysis mode
const SCHEMAS: Record<string, any> = {
  batch_health: {
    name: "submit_batch_health",
    description: "Submit the AI batch health report for a placement batch",
    parameters: {
      type: "object",
      properties: {
        health_score: { type: "number", description: "Overall batch health 0-100" },
        grade: { type: "string", enum: ["A+", "A", "B", "C", "D"] },
        headline: { type: "string", description: "One-line summary of batch status" },
        summary: { type: "string", description: "2-3 sentence narrative summary" },
        strengths: { type: "array", items: { type: "string" }, description: "3-4 batch strengths" },
        risks: { type: "array", items: { type: "string" }, description: "3-4 key risks" },
        weak_topics: { type: "array", items: { type: "string" }, description: "Topics needing revision across batch" },
        recommendations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              priority: { type: "string", enum: ["high", "medium", "low"] },
              action: { type: "string" },
              impact: { type: "string" },
            },
            required: ["priority", "action", "impact"],
          },
        },
        forecast: { type: "string", description: "Placement forecast statement with an estimated placement %" },
      },
      required: ["health_score", "grade", "headline", "summary", "strengths", "risks", "weak_topics", "recommendations", "forecast"],
    },
  },
  student_analysis: {
    name: "submit_student_analysis",
    description: "Submit deep AI analysis for an individual student",
    parameters: {
      type: "object",
      properties: {
        placement_probability: { type: "number", description: "0-100 probability of placement" },
        band: { type: "string", enum: ["Ready", "Almost", "Needs Work", "At Risk"] },
        verdict: { type: "string", description: "One-line verdict" },
        strengths: { type: "array", items: { type: "string" } },
        learning_gaps: { type: "array", items: { type: "string" } },
        ready_companies: { type: "array", items: { type: "string" }, description: "Companies the student is currently ready for" },
        improvement_plan: {
          type: "array",
          items: {
            type: "object",
            properties: {
              week: { type: "string" },
              focus: { type: "string" },
              goal: { type: "string" },
            },
            required: ["week", "focus", "goal"],
          },
        },
        career_advice: { type: "string" },
      },
      required: ["placement_probability", "band", "verdict", "strengths", "learning_gaps", "ready_companies", "improvement_plan", "career_advice"],
    },
  },
  recommendations: {
    name: "submit_recommendations",
    description: "Submit faculty action recommendations for the batch",
    parameters: {
      type: "object",
      properties: {
        students_needing_help: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              reason: { type: "string" },
              action: { type: "string" },
            },
            required: ["name", "reason", "action"],
          },
        },
        topics_to_revise: { type: "array", items: { type: "string" } },
        company_readiness: {
          type: "array",
          items: {
            type: "object",
            properties: {
              company: { type: "string" },
              ready_count: { type: "number" },
              note: { type: "string" },
            },
            required: ["company", "ready_count", "note"],
          },
        },
        next_best_actions: { type: "array", items: { type: "string" } },
      },
      required: ["students_needing_help", "topics_to_revise", "company_readiness", "next_best_actions"],
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { mode = "batch_health", data = {} } = await req.json();
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const schema = SCHEMAS[mode];
    if (!schema) {
      return new Response(JSON.stringify({ error: "Invalid mode" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sys = `You are an expert AI placement analytics engine for Indian engineering colleges (PlacementIQ).
You analyze real student learning data (quiz scores, topic completion, test attempts) and produce sharp, actionable, data-grounded insights for placement faculty.
Be specific, realistic, and reference Indian recruiters (TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini, Amazon, etc.) where relevant. Use percentages and concrete numbers. Never invent students not present in the data.`;

    const userPrompt = `Analysis mode: ${mode}.
Here is the aggregated, anonymized batch/student data (JSON):
${JSON.stringify(data).slice(0, 12000)}

Produce the analysis by calling the ${schema.name} function. Ground every claim in the numbers provided.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sys }, { role: "user", content: userPrompt }],
        tools: [{ type: "function", function: schema }],
        tool_choice: { type: "function", function: { name: schema.name } },
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const txt = await resp.text();
      console.error("AI gateway error", resp.status, txt);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await resp.json();
    const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = JSON.parse(args || "{}");

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
