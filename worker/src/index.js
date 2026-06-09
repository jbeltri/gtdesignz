const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers
    }
  });

const getAllowedOrigin = (request, env) => {
  const origin = request.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return allowed.includes(origin) ? origin : "";
};

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin"
});

const richText = (value) => ({
  rich_text: [{ type: "text", text: { content: String(value || "").slice(0, 1900) } }]
});

const validatePayload = (payload) => {
  if (!payload || typeof payload !== "object") return "Invalid request.";
  if (!payload.consent) return "Consent is required.";
  if (String(payload.name || "").trim().length < 2) return "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email || ""))) return "A valid email is required.";
  if (String(payload.phone || "").replace(/\D/g, "").length < 7) return "A valid phone number is required.";
  if (String(payload.address || "").trim().length < 4) return "A property address is required.";
  if (String(payload.brief || "").trim().length < 12) return "A project brief is required.";
  if (String(payload.brief || "").length > 5000) return "The project brief is too long.";
  return "";
};

const createNotionPage = async (payload, env) => {
  const dispute = Boolean(payload.flags?.dispute);
  const title = `${payload.name} - ${payload.address}`.slice(0, 180);
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2026-03-11"
    },
    body: JSON.stringify({
      parent: {
        type: "data_source_id",
        data_source_id: env.NOTION_DATA_SOURCE_ID
      },
      properties: {
        "Client Project": {
          title: [{ type: "text", text: { content: title } }]
        },
        Status: {
          select: { name: dispute ? "Needs callback" : "New" }
        },
        Email: { email: payload.email },
        Phone: { phone_number: payload.phone },
        "Property address": richText(payload.address),
        "Project type": richText(payload.projectType),
        "Project brief": richText(payload.brief),
        "Budget band": richText(payload.budget || "Not stated"),
        "Target timescale": richText(payload.timescale || "Not stated"),
        "Likely RIBA stage": richText(payload.likelyRibaStage || "To be reviewed"),
        "Planning history requested": {
          checkbox: Boolean(payload.flags?.planningHistory)
        },
        "Build over query": {
          checkbox: Boolean(payload.flags?.buildOver)
        },
        "Party Wall query": {
          checkbox: Boolean(payload.flags?.partyWall)
        },
        "Dispute escalation": {
          checkbox: dispute
        },
        "Consent recorded": {
          checkbox: true
        },
        Submitted: {
          date: { start: payload.submittedAt || new Date().toISOString() }
        },
        Source: {
          select: { name: "Website assistant" }
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Assistant reference: ${String(payload.conversationId || "Not supplied")}`
                }
              }
            ]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Source page: ${String(payload.pageUrl || "Not supplied").slice(0, 1800)}`
                }
              }
            ]
          }
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Notion create page failed", response.status, error);
    throw new Error("Unable to create the enquiry record.");
  }
  return response.json();
};

export default {
  async fetch(request, env) {
    const origin = getAllowedOrigin(request, env);

    if (request.method === "OPTIONS") {
      if (!origin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method === "GET") {
      return json({ service: "GT Designz intake", status: "ok" });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    if (!origin) {
      return json({ error: "Origin not allowed." }, 403);
    }

    if (!env.NOTION_TOKEN || !env.NOTION_DATA_SOURCE_ID) {
      return json({ error: "Service is not configured." }, 503, corsHeaders(origin));
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON." }, 400, corsHeaders(origin));
    }

    const validationError = validatePayload(payload);
    if (validationError) {
      return json({ error: validationError }, 400, corsHeaders(origin));
    }

    try {
      const page = await createNotionPage(payload, env);
      return json(
        {
          ok: true,
          reference: payload.conversationId,
          recordId: page.id
        },
        201,
        corsHeaders(origin)
      );
    } catch {
      return json(
        { error: "The enquiry could not be recorded. Please use the email fallback." },
        502,
        corsHeaders(origin)
      );
    }
  }
};
