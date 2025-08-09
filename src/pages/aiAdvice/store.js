import hljs from "highlight.js/lib/core";

import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import csharp from "highlight.js/lib/languages/csharp";
import haml from "highlight.js/lib/languages/haml";
import go from "highlight.js/lib/languages/go";
import cpp from "highlight.js/lib/languages/cpp";
import swift from "highlight.js/lib/languages/swift";
import noderepl from "highlight.js/lib/languages/node-repl";
import excel from "highlight.js/lib/languages/excel";

import { atom } from "nanostores";
import Showdown from "showdown";
import { loadLocalStorage, saveLocalStorage } from "../../data/localStorage";
import {
  addCopyButtonsToCodeBlocks,
  aiAdviceEls,
  controAllConversaOperation,
  createNewConve,
  renderConversationList,
  scrollToEndOfChat,
} from "./AIAdviceLogic";
import { chatErrorCompo } from "./AIAdviceRender";

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
  Your name is Taskly.
  You are a task advisor, a friendly and motivating productivity coach focused exclusively on helping users manage their tasks effectively.

  YOUR CORE FUNCTION:
  - Provide personalized, practical advice on task planning, prioritization, and execution
  - Break down complex projects into manageable steps
  - Suggest productivity techniques tailored to the user's specific situation
  - Offer strategies for overcoming procrastination and maintaining focus
  - Assist with time management and deadline planning
  - Show them with actual code if the subject is related to programming languages and development
  - Use subject-related emojis to add emotional impact and make responses more engaging (e.g., 📚 for study, 💻 for coding, 🏃‍♂️ for health, ⏰ for time, ✅ for completion, etc.)

  RESPONSE STRUCTURE:
  1. Begin with brief encouragement acknowledging the user's task or challenge (consider using a relevant emoji)
  2. Provide clear, actionable steps formatted with bullet points for easy reading
  3. Tailor all advice to the user's specific context (work, study, health, personal growth, hobbies)
  4. Use headers and formatting to enhance readability
  5. End with a motivational quote or uplifting message that reinforces taking action (add a positive emoji)

  PERSONALITY:
  - Supportive and motivating without being overly cheerful
  - Direct and clear in communication
  - Solution-oriented and practical
  - Friendly and approachable

  BOUNDARIES:
  - Focus solely on task management and productivity advice
  - Provide assistance with the actual content or subject matter of tasks if needed
  - Avoid generic productivity platitudes; offer specific, actionable advice
  - Do not generate more than 2500 characters in one response

  SUGGESTIONS FOR ENGAGEMENT:
  - Use subject-related emojis to make advice more relatable and emotionally resonant
  - Vary sentence structure and formatting for better readability
  - Ask clarifying questions if the user's needs are unclear
  - When providing code, use proper formatting and highlight key parts

  When uncertain about the user's needs, ask targeted questions to better understand their specific task management challenges before providing advice.
  `,
};

export const refusalMsg = "I'm sorry, but I cannot assist with that.";

export const historyMessages = atom([systemMsg]);

// export const allChatsHistory = atom(loadLocalStorage("ai-chat_history") || []);

export const conversations = atom(loadLocalStorage("all_Conversations") || []);
export const activeConversation_Id = atom(null);

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

export const generateAdvice = async () => {
  const { userInput, aiAdviceOutput, chatArea } = aiAdviceEls();
  const aiAdviceOutputLength = aiAdviceOutput.length;

  let fullMarkdown = "";
  const loadingDiv = document.querySelectorAll(".loading-div");

  try {
    // Add user input
    findActiveConversation(activeConversation_Id.get()).messages.push({
      role: "user",
      content: userInput.value.trim(),
    });

    const response = await getAdvice(
      findActiveConversation(activeConversation_Id.get()).messages
    );

    // **---------     For streaming response
    for await (const part of response) {
      fullMarkdown += part?.text;

      const htmlContent = converter.makeHtml(fullMarkdown);
      aiAdviceOutput[aiAdviceOutputLength - 1].innerHTML = htmlContent;
      scrollToEndOfChat(true);
    }

    findActiveConversation(activeConversation_Id.get()).messages.push({
      role: "assistant",
      content: fullMarkdown,
    });

    addCopyButtonsToCodeBlocks();
    highlightCode();
    saveLocalStorage(conversations.get(), "all_Conversations");
    // **------   Delete loading div after completing response

    for (let i = 0; i < loadingDiv.length; i++) loadingDiv[i].remove();
  } catch (err) {
    for (let i = 0; i < loadingDiv.length; i++) loadingDiv[i].remove();

    chatArea.innerHTML += chatErrorCompo(err);
  }
};

export function findActiveConversation(id) {
  const activeConversation = conversations
    .get()
    .find((conve) => conve.id === id);

  if (activeConversation) return activeConversation;
  else createNewConve();
}

export const deleteConversation = (id) => {
  conversations.set(conversations.get().filter((conve) => conve.id !== id));

  controAllConversaOperation();
};

export const highlightCode = () => {
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("html", html);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("sql", sql);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("rust", rust);
  hljs.registerLanguage("csharp", csharp);
  hljs.registerLanguage("haml", haml);
  hljs.registerLanguage("go", go);
  hljs.registerLanguage("cpp", cpp);
  hljs.registerLanguage("swift", swift);
  hljs.registerLanguage("node-repl", noderepl);
  hljs.registerLanguage("excel", excel);

  // Initilize the highlight.js
  hljs.highlightAll();
};

export default getAdvice;
