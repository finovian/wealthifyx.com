import OpenAI from "openai";
import { TOOLS, executeTool } from "./tools";

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});


type Role = "user" | "assistant" | "system" | "tool";

export interface Message {
  role: Role;
  content: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface AgentResponse {
  answer: string;
  toolsUsed: string[];
}

function toOpenAITools() {
  return TOOLS.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  }));
}

const SYSTEM_MESSAGE: Message = {
  role: "system",
  content: `You are WealthifyX's personal financial advisor — a sharp, numbers-first assistant that helps people make better financial decisions.

You have access to 9 financial calculators:
- Compound Interest: lump sum investments, investment growth
- SIP: monthly recurring investments
- Retirement Corpus: how much to save to retire
- Roth IRA: US tax-free retirement account projections
- 401k: US employer-matched retirement account projections
- Savings Goal: how long to reach a financial target
- Options Profit: options trading P&L, breakeven, max profit/loss
- Capital Gains Tax: US tax on selling stocks
- Dividend Calculator: dividend income and portfolio growth

YOUR RULES:
1. Always give specific numbers. Never say "you should invest regularly" — run the calculator and give the actual number.
2. If user hasn't given you enough info, ask for ONLY the missing piece. One question at a time.
3. After calculating, explain what the number means in plain English.
4. If someone's goal is unrealistic, tell them honestly with the math to prove it.
5. Only talk about personal finance. Redirect anything else politely.
6. Keep responses conversational — smart friend, not a bank brochure.
7. Never give specific stock picks or tell users to buy/sell specific securities.
8. Always end with: "This is for educational purposes only, not financial advice."

RESPONSE FORMAT:
- Lead with the key number
- Explain what it means in 2-3 sentences
- Give one actionable next step
- Keep it under 150 words unless user asks for more detail`,
}

function normalizeMessages(history: any[]): Message[] {
  const result: Message[] = [];

  for (const msg of history) {

    if (msg.parts && Array.isArray(msg.parts)) {
      let role: Role | null = null;

      if (msg.role === "model") role = "assistant";
      else if (msg.role === "user") role = "user";
      else continue;

      const content = msg.parts
        .map((p: any) => p?.text || "")
        .join("");

      if (!content) continue;

      result.push({ role, content });
      continue;
    }

    if (
      msg.content &&
      ["user", "assistant", "system", "tool"].includes(msg.role)
    ) {
      result.push({
        role: msg.role,
        content: String(msg.content),
        tool_call_id: msg.tool_call_id,
        tool_calls: msg.tool_calls,
      });
    }
  }

  return result;
}

function validateMessages(messages: Message[]) {
  const validRoles = ["system", "user", "assistant", "tool"];

  for (const msg of messages) {
    if (!validRoles.includes(msg.role)) {
      throw new Error(`Invalid role detected: ${msg.role}`);
    }

    if (typeof msg.content !== "string") {
      throw new Error(`Invalid content for role: ${msg.role}`);
    }
  }
}


function safeParseJSON(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}


export async function runAgent(
  userMessage: string,
  conversationHistory: any[] = []
): Promise<AgentResponse> {
  const messages: Message[] = [
    SYSTEM_MESSAGE,
    ...normalizeMessages(conversationHistory),
    { role: "user", content: userMessage },
  ];

  validateMessages(messages)

  const toolsUsed: string[] = [];

  const MAX_ITERATIONS = 5;
  let iteration = 0;

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any[],
      tools: toOpenAITools(),
      tool_choice: toolsUsed.length === 0 ? "required" : "auto"
    });
    const choice = response.choices[0];
    const assistantMessage = choice.message;


    messages.push({
      role: "assistant",
      content: assistantMessage.content || "",
      tool_calls: assistantMessage.tool_calls,
    });


    if (
      choice.finish_reason === "stop" ||
      !assistantMessage.tool_calls?.length
    ) {
      return {
        answer:
          assistantMessage.content ||
          "I couldn't generate a response.",
        toolsUsed,
      };
    }


    for (const toolCall of assistantMessage.tool_calls) {
      if (toolCall.type !== "function") continue;
      const name = toolCall.function.name;

      const parsedInput = safeParseJSON(
        toolCall.function.arguments
      );

      if (!parsedInput) {
        console.error("Invalid tool arguments:", toolCall.function.arguments);
        continue;
      }

      toolsUsed.push(name);

      let result;
      try {
        result = executeTool(name, parsedInput);
      } catch (err) {
        console.error("Tool execution failed:", err);
        result = "Tool execution failed.";
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content:
          typeof result === "string"
            ? result
            : JSON.stringify(result),
      });
    }
  }


  return {
    answer: "Agent stopped due to too many iterations.",
    toolsUsed,
  };
}













