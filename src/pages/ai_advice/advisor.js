export const getAdvice = async (prompt) => {
  const reply = await puter.ai.chat(prompt, {
    // model: "deepseek-reasoner",
    model: "grok-beta",
    // model: "o3-mini",
    // stream: true,
  });

  return reply;
};
export default getAdvice;
