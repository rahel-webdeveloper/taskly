import {
  isWindowLarge,
  resetUI,
  tapChooseTimeFunc,
  TimerEls,
  togglePauseResumeBtns,
  toggleStartSection,
  updateCountdownCircle,
} from "./TimerLogic";
import { atom } from "nanostores";

// Timer state
export const selectedHour = atom(0);
export const selectedMinute = atom(0);
export const selectedSecond = atom(0);

export const isStarted = atom(false);
export const isPaused = atom(false);
export const isCanceled = atom(false);

export const startTime = atom(null);
export const elapsedTime = atom(null);
export const animationId = atom(null);

export const startTimer = () => {
  isStarted.set(true);
  isPaused.set(false);
  startTime.set(Date.now());
};

export const toggleTapTime = () => {
  isStarted.set(!isStarted.get());

  isStarted.get() ? selectedMinute.set(15) : selectedMinute.set(0);
};

export const pauseTimer = () => {
  isPaused.set(true);
};

export const resumeTimer = () => {
  isPaused.set(false);
  startTime.set(Date.now() - elapsedTime.get() * 1000);
};

export const cancelTimer = () => {
  isStarted.set(false);
  isCanceled.set(true);
};

export const setAnimationId = (totalSelectedSeconds) => {
  animationId.set(
    requestAnimationFrame(() => updateCountdownCircle(totalSelectedSeconds))
  );
};

export const timerStartState = () => {
  const { pauseBtn, resumeBtn, cancelBtn, tapTimeDiv, startBtn } = TimerEls();

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

export function setInitialTimerScroll(hourScroSize, minuScroSize, secScroSize) {
  const hourPicker = document.querySelector("#hour-picker");
  const minutePicker = document.querySelector("#minute-picker");
  const secondPicker = document.querySelector("#second-picker");

  hourPicker.scrollTop = hourScroSize * 40;
  minutePicker.scrollTop = minuScroSize * 40;
  secondPicker.scrollTop = secScroSize * 40;
}

export const remainingTimeCalculation = (totalSelectedTime, elapsedTime) => {
  const remainingTime = Math.ceil(totalSelectedTime - elapsedTime);

  const remainingHours = Math.floor((remainingTime / 60 / 60) % 60);
  const remainingMinutes = Math.floor((remainingTime / 60) % 60);
  const remainingSeconds = remainingTime % 60;

  return { remainingHours, remainingMinutes, remainingSeconds };
};

// Update selected time
export const totalSelectedTime = () => {
  return (
    (selectedHour.get() * 60 * 60 +
      selectedMinute.get() * 60 +
      selectedSecond.get()) *
    1000
  );
};

export const getSelectedTimeOnSeconds = () => totalSelectedTime() / 1000;

export const handleTimerEvents = (event) => {
  const { startBtn } = TimerEls();
  const id = event.target.id;

  if (id === "timer-start") {
    startTimer();

    timerStartState();
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
