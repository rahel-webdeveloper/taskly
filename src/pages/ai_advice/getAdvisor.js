import { historyMessages } from "./store";

export const getAdvice = async () => {
  const reply = await puter.ai.chat(historyMessages.get(), {
    // model: "deepseek-reasoner",
    // model: "grok-beta",
    // model: "gpt-4o",
    model: "claude-3-7-sonnet",
    // model: "deepseek-chat", // it is gpt 4
    // model: "x-ai/grok-3-beta",
    // model: "o3-mini",
    // stream: true,
  });

  return reply;
};

export default getAdvice;
