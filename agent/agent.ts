import OpenAI from "openai";
import { TOOLS, executeTool } from "./tools";
import { getProfile, extractAndSaveProfile } from "./db";

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

function buildSystemMessage(profile: Record<string, any>): Message {
  const profileSection =
    Object.keys(profile).length > 0
      ? `\n\nKNOWN USER PROFILE (use these numbers directly — do not ask again):\n${JSON.stringify(profile, null, 2)}`
      : "";

  return {
    role: "system",
    content: `You are WealthifyX's financial calculator assistant.

YOUR ONLY JOB: Help users with personal finance calculations using your tools.

HARD RULES — NO EXCEPTIONS:
1. If user asks ANYTHING not related to personal finance → respond ONLY: "I'm a financial calculator assistant. I can only help with finance topics like savings, investments, loans, retirement, or dividends."
2. NEVER answer from memory. ALWAYS use a tool. If no tool fits → say "I don't have a calculator for that."
3. NEVER make up numbers. Every number must come from a tool result.
4. If user profile has the numbers you need — use them directly. Never ask for info you already have.
5. NEVER assume missing inputs. If a required value is not in user profile and not mentioned in conversation → ask for it. One missing value = one question. Never ask multiple questions at once.
6. Required inputs you must NEVER assume:
   - monthly_expenses → always ask if not provided
   - retirement_age → always ask if not provided
   - goal amount → always ask if not provided
   - investment amount → always ask if not provided
7. NEVER run a calculator until you have ALL required inputs either from user profile or from the conversation.
8. If user provides financial info without asking a question →
acknowledge the info and ask "What would you like to calculate?"
9. If any result shows time > 50 years or monthly amount > 80%
of income → flag it as unrealistic and suggest alternatives.

TOOLS YOU HAVE:
- calculate_compound_interest: lump sum investment growth
- calculate_sip: monthly recurring investment returns
- calculate_retirement: corpus needed + monthly SIP to retire
- calculate_roth_ira: US Roth IRA balance at retirement
- calculate_401k: 401k balance with employer match
- calculate_savings_goal: time to reach a savings target
- calculate_options_profit: options P&L, breakeven, max profit/loss
- calculate_capital_gains_tax: US tax on stock sales
- calculate_dividend: dividend income and portfolio growth

NOTHING ELSE. You are a calculator, not a chatbot.${profileSection}`,
  };
}

function normalizeMessages(history: any[]): Message[] {
  const result: Message[] = [];

  for (const msg of history) {
    if (msg.parts && Array.isArray(msg.parts)) {
      let role: Role | null = null;
      if (msg.role === "model") role = "assistant";
      else if (msg.role === "user") role = "user";
      else continue;

      const content = msg.parts.map((p: any) => p?.text || "").join("");
      if (!content) continue;

      result.push({ role, content });
      continue;
    }

    if (msg.content && ["user", "assistant", "system", "tool"].includes(msg.role)) {
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
  sessionId: string,
  conversationHistory: any[] = []
): Promise<AgentResponse> {

  const profile = await getProfile(sessionId);


  const messages: Message[] = [
    buildSystemMessage(profile),
    ...normalizeMessages(conversationHistory),
    { role: "user", content: userMessage },
  ];

  validateMessages(messages);

  const toolsUsed: string[] = [];
  const MAX_ITERATIONS = 5;
  let iteration = 0;

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any[],
      tools: toOpenAITools(),
      tool_choice: toolsUsed.length === 0 ? "required" : "auto",
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;

    messages.push({
      role: "assistant",
      content: assistantMessage.content || "",
      tool_calls: assistantMessage.tool_calls,
    });

    if (choice.finish_reason === "stop" || !assistantMessage.tool_calls?.length) {
      const finalAnswer = assistantMessage.content || "I couldn't generate a response.";

      extractAndSaveProfile(sessionId, userMessage, finalAnswer).catch((e) =>
        console.error("[Profile extract failed]", e)
      );

      return { answer: finalAnswer, toolsUsed };
    }

    for (const toolCall of assistantMessage.tool_calls) {
      if (toolCall.type !== "function") continue;

      const name = toolCall.function.name;
      const parsedInput = safeParseJSON(toolCall.function.arguments);

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
        content: typeof result === "string" ? result : JSON.stringify(result),
      });
    }
  }

  return {
    answer: "Agent stopped due to too many iterations.",
    toolsUsed,
  };
}