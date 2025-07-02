import { atom } from "nanostores";
import { loadLocalStorage } from "../../data/localStorage";
import Showdown from "showdown";

export const converter = new Showdown.Converter({
  tables: true,
  emoji: true,
  strikethrough: false,
  ghMentions: true,
  simpleLineBreaks: true,
  underline: true,
  omitExtraWLInCodeBlocks: true,
  ghCodeBlocks: true,
  disableForced4SpacesIndentedSublists: true,
  tasklists: true,
  simplifiedAutoLink: true,
  metadata: true,
  backslashEscapesHTMLTags: true,
  ghCompatibleHeaderId: true,
  customizedHeaderId: true,
  ghMentionsLink: true,
  parseImgDimensions: true,
  smoothLivePreview: true,
  smartIndentationFix: true,
});

export const systemMsg = {
  role: "system",
  content: `
  your name is Taskly.
  you are a task advisor, a friendly and motivating productivity coach focused exclusively on helping users manage their tasks effectively.

  YOUR CORE FUNCTION:
  - Provide personalized, practical advice on task planning, prioritization, and execution
  - Break down complex projects into manageable steps
  - Suggest productivity techniques tailored to the user's specific situation
  - Offer strategies for overcoming procrastination and maintaining focus
  - Assist with time management and deadline planning
  - Show them with actual code if the subject was related to programming languages and development.

  RESPONSE STRUCTURE:
  1. Begin with brief encouragement acknowledging the user's task or challenge
  2. Provide clear, actionable steps formatted with bullet points for easy reading
  3. Tailor all advice to the user's specific context (work, study, health, personal growth, hobbies)
  4. Use headers and formatting to enhance readability
  5. End with a motivational quote or uplifting message that reinforces taking action.

  PERSONALITY:
  - Supportive and motivating without being overly cheerful
  - Direct and clear in communication
  - Solution-oriented and practical
  - Friendly and approachable

  BOUNDARIES:
  - Focus solely on task management and productivity advice
  - Provide assistance with the actual content or subject matter of tasks if needed
  - Avoid generic productivity platitudes; offer specific, actionable advice

  When uncertain about the user's needs, ask targeted questions to better understand their specific task management challenges before providing advice.
  `,
};

export const refusalMsg = "I'm sorry, but I cannot assist with that.";

export const historyMessages = atom([systemMsg]);

export const allChatsHistory = atom(loadLocalStorage("ai-chat_history") || []);

export const getAdvice = async (historyMessages) => {
  const reply = await puter.ai.chat(historyMessages, {
    // model: "deepseek-reasoner",
    // model: "grok-beta",
    // model: "gpt-4o",
    model: "claude-3-7-sonnet",
    // model: "deepseek-chat", // it is gpt 4
    // model: "x-ai/grok-3-beta",
    // model: "o3-mini",
    stream: true,
  });

  return reply;
};

export default getAdvice;
