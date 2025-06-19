import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { generateLandValuation, ValuationData, PropertyData, openaiClient } from "./openai";

export interface AgentMessageRequest {
  sessionId?: string;
  message: string;
}

export interface AgentMessageResponse {
  sessionId: string;
  message: string;
}

interface Session {
  messages: ChatCompletionMessageParam[];
}

const sessions = new Map<string, Session>();

// Simple valuation adjustment function
export function adjustValuation(params: { valuation: ValuationData; factor: number }): ValuationData {
  const { valuation, factor } = params;
  return {
    p10: Math.round(valuation.p10 * factor),
    p50: Math.round(valuation.p50 * factor),
    p90: Math.round(valuation.p90 * factor),
    totalValue: Math.round(valuation.totalValue * factor),
    pricePerAcre: Math.round(valuation.pricePerAcre * factor),
    confidence: valuation.confidence,
  };
}

export async function handleAgentMessage(request: AgentMessageRequest) : Promise<AgentMessageResponse> {
  const { sessionId = crypto.randomUUID(), message } = request;

  const session = sessions.get(sessionId) || {
    messages: [
      { role: "system", content: "You are a helpful land valuation assistant." },
    ],
  };

  session.messages.push({ role: "user", content: message });

  const tools: any = [
    {
      type: "function",
      function: {
        name: "generateLandValuation",
        description: "Generate a land valuation for the given property",
        parameters: {
          type: "object",
          properties: {
            propertyDescription: { type: "string" },
            acreage: { type: "number" },
            location: { type: "string" },
            irrigated: { type: "boolean" },
            tillable: { type: "boolean" },
            cropType: { type: "string" },
          },
          required: ["propertyDescription", "acreage", "location", "irrigated", "tillable"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "adjustValuation",
        description: "Adjust an existing valuation by a factor",
        parameters: {
          type: "object",
          properties: {
            valuation: { type: "object" },
            factor: { type: "number" },
          },
          required: ["valuation", "factor"],
        },
      },
    },
  ];

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    messages: session.messages,
    tools,
  });

  const choice = completion.choices[0];
  const assistantMessage = choice.message;

  session.messages.push(assistantMessage as ChatCompletionMessageParam);

  if (assistantMessage.tool_calls) {
    for (const call of assistantMessage.tool_calls) {
      const fnName = call.function.name;
      const args = JSON.parse(call.function.arguments || "{}");
      let result: any = {};
      if (fnName === "generateLandValuation") {
        result = await generateLandValuation(args as PropertyData);
      } else if (fnName === "adjustValuation") {
        result = adjustValuation(args as { valuation: ValuationData; factor: number });
      }
      session.messages.push({ role: "tool", content: JSON.stringify(result), tool_call_id: call.id } as any);
    }

    const followUp = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: session.messages,
    });

    const finalMessage = followUp.choices[0].message;
    session.messages.push(finalMessage as ChatCompletionMessageParam);
    sessions.set(sessionId, session);
    return { sessionId, message: finalMessage.content || "" };
  }

  sessions.set(sessionId, session);
  return { sessionId, message: assistantMessage.content || "" };
}
