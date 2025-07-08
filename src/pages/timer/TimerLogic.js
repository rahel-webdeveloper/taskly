import SendSuggestionMain from "../../services/send_Sug";
import {
  selectedHour,
  selectedMinute,
  selectedSecond,
  startTimer,
  toggleTapTime,
  pauseTimer,
  resumeTimer,
  cancelTimer,
  startTime,
  elapsedTime,
  animationId,
  setAnimationId,
  isStarted,
  isPaused,
  isCanceled,
  timerStartState,
  remainingTimeCalculation,
  totalSelectedTime,
  getSelectedTimeOnSeconds,
  setInitialTimerScroll,
} from "./store";

export const TimerLogic = () => {
  // Initialize Infinite Picker
  populateInfinitePicker("hour-picker", 100);
  populateInfinitePicker("minute-picker", 60);
  populateInfinitePicker("second-picker", 60);

  addInfiniteScroll("hour-picker", 100, (hour) => {
    selectedHour.set(hour);
    totalSelectedTime();
  });
  addInfiniteScroll("minute-picker", 60, (minute) => {
    selectedMinute.set(minute);
    totalSelectedTime();
  });
  addInfiniteScroll("second-picker", 60, (second) => {
    selectedSecond.set(second);
    totalSelectedTime();
  });

  SendSuggestionMain();
};

export const TimerEls = () => {
  const timerFirstSection = document.querySelector(".timer-first-section");
  const timerSecondSection = document.querySelector(".timer-second-section");
  const countdownCircle = document.getElementById("countdown-circle");
  const tapTimeDiv = document.getElementById("tap-time-div");
  const timerText = document.getElementById("timer-text");
  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  const resumeBtn = document.getElementById("timer-resume");
  const cancelBtn = document.getElementById("timer-cancel");

  return {
    timerFirstSection,
    timerSecondSection,
    countdownCircle,
    tapTimeDiv,
    timerText,
    startBtn,
    pauseBtn,
    resumeBtn,
    cancelBtn,
  };
};

const redius = 35;
const circumference = 2 * Math.PI * redius;

function populateInfinitePicker(pickerId, range) {
  const pickerItems = document.querySelector(`#${pickerId} .picker-items`);

  if (!pickerItems) return;

  // Create cloned items for infinite scrolling
  const items = [];

  for (let i = 0; i < range; i++) items.push(i.toString().padStart(2, "0"));

  const allItems = [...items, ...items, ...items];

  allItems.forEach((value) => {
    const item = document.createElement("div");

    item.classList.add("picker-item");
    item.textContent = value;

    pickerItems.appendChild(item);
  });

  setInitialTimerScroll(99.1, 119.1, 119.1);
}

// Add infinite scroll adjustment
const addInfiniteScroll = (pickerId, range, onChange) => {
  const picker = document.getElementById(pickerId);
  const pickerItems = document.querySelector(".picker-items");

  if (!pickerItems) return;

  const itemHeight = 40;
  const totalHeight = pickerItems.scrollHeight;
  const visibleHeight = picker.clientHeight;

  picker.addEventListener("scroll", function () {
    let scrollTop = picker.scrollTop;

    // Check if scrolled to top or bottom
    if (scrollTop <= 0) picker.scrollTop = totalHeight / 3 - visibleHeight;
    if (scrollTop > totalHeight / 2) picker.scrollTop -= totalHeight;

    // Calculate current index
    const middleScrollPosition = picker.scrollTop + visibleHeight / 2;
    const index = Math.floor(middleScrollPosition / itemHeight) % range;

    // Update selected item
    const items = picker.querySelectorAll(".picker-item");

    items.forEach((item, i) =>
      item.classList.toggle("selected", i % range === index)
    );

    const { startBtn } = TimerEls();

    totalSelectedTime() >= 1000
      ? (startBtn.disabled = false)
      : (startBtn.disabled = true);

    // Trigger change event
    onChange(index);
  });
};

export const tapChooseTimeFunc = (isStartBtnDisabled) => {
  const { tapTimeDiv } = TimerEls();
  if (isStartBtnDisabled) {
    setInitialTimerScroll(99.1, 14.1, 119.1);
    tapTimeDiv.style.cssText = `
        background-color: transparent;
        border: 1px solid #bbb2cc;
      `;
  } else {
    setInitialTimerScroll(99.1, 119.1, 119.1);
    tapTimeDiv.style.cssText = `
        background-color: #17181c;
        border: none;
      `;
  }
};

// Circle logic
export const updateCountdownCircle = (totalSeconds) => {
  const { countdownCircle, timerText } = TimerEls();
  const now = Date.now();

  elapsedTime.set(Math.min((now - startTime.get()) / 1000, totalSeconds));

  if (isPaused.get() || isCanceled.get()) return;

  // Circle offset meaining how much circle should hide
  const offset = (elapsedTime.get() / totalSeconds) * circumference;
  countdownCircle.style.strokeDashoffset = offset;

  const { remainingHours, remainingMinutes, remainingSeconds } =
    remainingTimeCalculation(totalSeconds, elapsedTime.get());

  timerText.textContent = remainingTimerInUI(
    remainingHours,
    remainingMinutes,
    remainingSeconds
  );

  elapsedTime.get() < totalSeconds
    ? setAnimationId(getSelectedTimeOnSeconds())
    : resetUI();
};

// Remaining time in UI
const remainingTimerInUI = (
  remainingHours,
  remainingMinutes,
  remainingSeconds
) => {
  if (remainingSeconds < 6 && remainingHours <= 0 && remainingMinutes <= 0)
    countdownCircle.style.stroke = "#fa6e6e";

  return `
    ${!remainingHours ? "" : remainingHours + ":"}
    ${
      !remainingMinutes && !remainingHours
        ? ""
        : remainingHours
        ? remainingMinutes.toString().padStart(2, "0") + ":"
        : remainingMinutes + ":"
    }
    ${
      remainingHours || remainingMinutes
        ? remainingSeconds.toString().padStart(2, "0")
        : remainingSeconds
    }`;
};

export const resetUI = () => {
  const {
    countdownCircle,
    timerText,
    cancelBtn,
    resumeBtn,
    pauseBtn,
    startBtn,
    tapTimeDiv,
  } = TimerEls();

  countdownCircle.style.strokeDashoffset = circumference;
  countdownCircle.style.stroke = "#bbb2cc";
  timerText.textContent = 0;

  cancelBtn.disabled = true;
  resumeBtn.disabled = true;
  pauseBtn.disabled = true;

  startBtn.disabled = false;
  tapTimeDiv.disabled = false;

  togglePauseResumeBtns(false);

  if (!isWindowLarge()) toggleStartSection(false);
};

export const togglePauseResumeBtns = (isPausedState) => {
  const { pauseBtn, resumeBtn } = TimerEls();

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      pauseBtn.style.display = isPausedState ? "none" : "inline";
      resumeBtn.style.display = isPausedState ? "inline" : "none";
    });
  } else {
    pauseBtn.style.display = isPausedState ? "none" : "inline";
    resumeBtn.style.display = isPausedState ? "inline" : "none";
  }
};

export const toggleStartSection = (isStarted) => {
  const { timerFirstSection, timerSecondSection } = TimerEls();

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      timerFirstSection.style.display = isStarted ? "none" : "inline";
      timerSecondSection.style.display = isStarted ? "inline" : "none";
    });
  } else {
    timerFirstSection.style.display = isStarted ? "none" : "inline";
    timerSecondSection.style.display = isStarted ? "inline" : "none";
  }
};

export const isWindowLarge = () => {
  const { timerFirstSection, timerSecondSection } = TimerEls();
  const width = window.innerWidth;
  if (width >= 1024) {
    timerFirstSection.style.display = "grid";
    timerSecondSection.style.display = "grid";
    return true;
  } else {
    isStartedTimer(isStarted.get());
    return false;
  }
};

export const isStartedTimer = (isStarted) => {
  const { timerFirstSection, timerSecondSection } = TimerEls();
  if (isStarted) {
    timerFirstSection.style.display = "none";
    timerSecondSection.style.display = "grid";
  } else {
    timerFirstSection.style.display = "grid";
    timerSecondSection.style.display = "none";
  }
};

export default TimerLogic;
