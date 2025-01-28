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

export function startTimer() {
  console.log("nanostores works!");

  isStarted.set(true);
  isPaused.set(false);
  startTime.set(Date.now());
}

export function toggleTapTime() {
  isStarted.set(!isStarted.get());

  isStarted.get() ? selectedMinute.set(15) : selectedMinute.set(0);
}

export function pauseTimer() {
  isPaused.set(true);
}

export function resumeTimer() {
  isPaused.set(false);
  startTime.set(Date.now() - elapsedTime.get() * 1000);
}

export function cancelTimer() {
  isStarted.set(false);
  isCanceled.set(true);
}

// export default { isStarted};
