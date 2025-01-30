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
} from "./store";

const timerLogic = () => {
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

  // Timer events
  if (timerContainer)
    timerContainer.addEventListener("click", handleTimerEvents);

  // For large screen UI
  window.addEventListener("resize", isWindowLarge);
};

let timerContainer,
  timerFirstSection,
  timerSecondSection,
  countdownCircle,
  tapTimeDiv,
  timerText,
  startBtn,
  pauseBtn,
  resumeBtn,
  cancelBtn;

document.addEventListener("DOMContentLoaded", function () {
  timerContainer = document.querySelector(".timer-container");
  timerFirstSection = document.querySelector(".timer-first-section");
  timerSecondSection = document.querySelector(".timer-second-section");
  countdownCircle = document.getElementById("countdown-circle");
  tapTimeDiv = document.getElementById("tap-time-div");
  timerText = document.getElementById("timer-text");
  startBtn = document.getElementById("timer-start");
  pauseBtn = document.getElementById("timer-pause");
  resumeBtn = document.getElementById("timer-resume");
  cancelBtn = document.getElementById("timer-cancel");
});

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

function setInitialTimerScroll(hourScroSize, minuScroSize, secScroSize) {
  const hourPicker = document.querySelector("#hour-picker");
  const minutePicker = document.querySelector("#minute-picker");
  const secondPicker = document.querySelector("#second-picker");

  hourPicker.scrollTop = hourScroSize * 40;
  minutePicker.scrollTop = minuScroSize * 40;
  secondPicker.scrollTop = secScroSize * 40;
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

    totalSelectedTime() >= 1000
      ? (startBtn.disabled = false)
      : (startBtn.disabled = true);

    // Trigger change event
    onChange(index);
  });
};

const tapChooseTimeFunc = (isStartBtnDisabled) => {
  if (isStartBtnDisabled) {
    setInitialTimerScroll(99.1, 14.1, 119.1);
    tapTimeDiv.style.cssText = `
        background-color: transparent;
        border: 1px solid #bbb2cc;
      `;
  } else {
    setInitialTimerScroll(99.1, 119.1, 119.1);
    tapTimeDiv.style.cssText = `
        background-color: #3e425d5a;
        border: none;
      `;
  }
};

// Update selected time
const totalSelectedTime = () => {
  return (
    (selectedHour.get() * 60 * 60 +
      selectedMinute.get() * 60 +
      selectedSecond.get()) *
    1000
  );
};

const getSelectedTimeOnSeconds = () => totalSelectedTime() / 1000;

// Circle logic
export const updateCountdownCircle = (totalSeconds) => {
  const now = Date.now();

  elapsedTime.set(Math.min((now - startTime.get()) / 1000, totalSeconds));

  if (isPaused.get() || isCanceled.get()) return;

  // Circle offset meainin how much circle should hide
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

// Remaining time calculation
const remainingTimeCalculation = (totalSelectedTime, elapsedTime) => {
  const remainingTime = Math.ceil(totalSelectedTime - elapsedTime);

  const remainingHours = Math.floor((remainingTime / 60 / 60) % 60);
  const remainingMinutes = Math.floor((remainingTime / 60) % 60);
  const remainingSeconds = remainingTime % 60;

  return { remainingHours, remainingMinutes, remainingSeconds };
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

const handleTimerEvents = (event) => {
  const id = event.target.id;

  if (id === "timer-start") {
    startTimer();

    resetTimerState();
    setAnimationId(getSelectedTimeOnSeconds());

    if (!isWindowLarge()) toggleStartSection(true);
  }

  if (id === "tap-time-div") {
    toggleTapTime();

    totalSelectedTime();
    tapChooseTimeFunc(isStarted.get());
    isStarted.get() ? (startBtn.disabled = false) : (startBtn.disabled = true);
  }

  if (id === "timer-pause") {
    pauseTimer();

    cancelAnimationFrame(animationId.get());
    togglePauseResumeBtns(true);
  }

  if (id === "timer-resume") {
    resumeTimer();

    setAnimationId(getSelectedTimeOnSeconds());
    togglePauseResumeBtns(false);
  }

  if (id === "timer-cancel") {
    cancelTimer();

    cancelAnimationFrame(animationId.get());
    resetUI();
  }
};

const resetUI = () => {
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

const resetTimerState = () => {
  isPaused.set(false);
  isCanceled.set(false);
  isStarted.set(true);

  pauseBtn.disabled = false;
  resumeBtn.disabled = false;
  cancelBtn.disabled = false;

  startBtn.disabled = true;
  tapTimeDiv.disabled = true;
  elapsedTime.set(0);
};

const togglePauseResumeBtns = (isPausedState) => {
  pauseBtn.style.display = isPausedState ? "none" : "inline";
  resumeBtn.style.display = isPausedState ? "inline" : "none";
};

const toggleStartSection = (isStarted) => {
  timerFirstSection.style.display = isStarted ? "none" : "inline";
  timerSecondSection.style.display = isStarted ? "inline" : "none";
};

const isWindowLarge = () => {
  const width = window.innerWidth;
  if (timerFirstSection && timerSecondSection) {
    if (width >= 1024) {
      timerFirstSection.style.display = "grid";
      timerSecondSection.style.display = "grid";
      return true;
    } else {
      isStartedTimer(isStarted.get());
      return false;
    }
  }
};

const isStartedTimer = (isStarted) => {
  if (isStarted) {
    timerFirstSection.style.display = "none";
    timerSecondSection.style.display = "grid";
  } else {
    timerFirstSection.style.display = "grid";
    timerSecondSection.style.display = "none";
  }
};

export default timerLogic;
