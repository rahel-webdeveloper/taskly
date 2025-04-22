import Showdown from "showdown";
import getAdvice from "./advisor";
import { markdownText } from "./store";

const converter = new Showdown.Converter({
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
});

const AIAdviceLogic = async () => {
  const aiAdviceContainerEl = document.querySelector(".ai-advice_container");
  const getAdviceBtn = document.getElementById("get-advice_btn");

  if (aiAdviceContainerEl) {
    addStyleToMarkdownContainer();
    getUserInput();
  }
};

const getUserInput = async () => {
  const getAdviceBtn = document.getElementById("get-advice_btn");
  const userInputEl = document.getElementById("user-input");

  userInputEl.addEventListener("input", function () {
    this.value
      ? (getAdviceBtn.disabled = false)
      : (getAdviceBtn.disabled = true);
  });

  getAdviceBtn.addEventListener("click", () => {
    renderAdviceInHtml(userInputEl.value);

    userInputEl.value = "";
    getAdviceBtn.disabled = true;
  });
};

const addStyleToMarkdownContainer = () => {
  const responseAreaEl = document.getElementById("response-area");

  responseAreaEl.style.cssText = `
  min-width: 200px;
  width: 100%;
  max-width: 980px;
  margin: .37rem auto 5rem;
  background-color: #1a1d27;
  // border: 1px solid red;
  border-radius: 0.7rem;
  min-height: 85vh;
`;
};

const renderAdviceInHtml = async (userInput) => {
  const responseAreaEl = document.getElementById("response-area");

  responseAreaEl.innerHTML = "<h2>Thinking...</h2>";

  const text = await getAdvice(userInput);

  const htmlContent = converter.makeHtml(text.message.content);
  // const htmlContent = converter.makeHtml(markdownText);

  responseAreaEl.innerHTML = htmlContent;
};

export default AIAdviceLogic;
