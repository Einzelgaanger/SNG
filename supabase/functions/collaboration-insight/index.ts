// AI collaboration insights — uses Lovable AI Gateway (Gemini 3 Flash) to generate
// a 2-sentence rationale for why two stakeholders should collaborate.
import { corsHeaders } from "@supabase/supabase-js/cors";
import { z } from "npm:zod@3.23.8";

const BodySchema = z.object({
  viewer: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional().default(""),
    interests: z.array(z.string()).default([]),
    initiatives: z.array(z.string()).default([]),
    region: z.string().optional().default(""),
  }),
  match: z.object({
    name: z.string(),
    role: z.string(),
    organization: z.string().optional().default(""),
    bio: z.string().optional().default(""),
    interests: z.array(z.string()).default([]),
    region: z.string().optional().default(""),
    sharedInterests: z.array(z.string()).default([]),
    score: z.number(),
  }),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { viewer, match } = parsed.data;
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert stakeholder-network strategist for the Vision Globe Group (VGG), a platform connecting entrepreneurs, investors, universities, government agencies, corporates and nonprofits worldwide.

Generate concise, actionable collaboration insights between two stakeholders. Output MUST be exactly 2 short sentences (max 50 words total). Tone: professional, specific, optimistic. Always reference at least one concrete shared interest, complementary capability, or geographic angle. Never use marketing fluff. Never repeat the names back. Start with the value, not "These two…".`;

    const userPrompt = `VIEWER (me):
- Name: ${viewer.name}
- Role: ${viewer.role}
- Region: ${viewer.region}
- Bio: ${viewer.bio || "n/a"}
- Interests: ${viewer.interests.join(", ") || "n/a"}
- Initiatives: ${viewer.initiatives.join(", ") || "n/a"}

POTENTIAL PARTNER:
- Name: ${match.name}
- Role: ${match.role}
- Organization: ${match.organization}
- Region: ${match.region}
- Bio: ${match.bio || "n/a"}
- Interests: ${match.interests.join(", ") || "n/a"}
- Shared interests: ${match.sharedInterests.join(", ") || "none explicit"}
- Match score: ${match.score}/100

Write the 2-sentence collaboration rationale now.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (aiRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (aiRes.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable workspace." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI gateway error", aiRes.status, txt);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const insight = data?.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("collaboration-insight error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
