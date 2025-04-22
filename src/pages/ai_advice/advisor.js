export const getAdvice = async (prompt) => {
  const reply = await puter.ai.chat(prompt);

  return reply;
};
export default getAdvice;
