import { updateCountdownCircle } from "./TimerLogic";
import { persistentAtom } from "@nanostores/persistent";
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
  console.log("nanostores works!");

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

// set local storage
// const userListStorage = persistentAtom("userList", [{ id: 1, user: "rahel" }], {
//   encode: JSON.stringify,
//   decode: JSON.parse,
// });

// const currentUser = userListStorage.get();

// if (!currentUser.find((task) => task.id === 2)) {
//   userListStorage.set([
//     ...currentUser,
//     { id: userListStorage.get().length + 1, user: "Khatib" },
//   ]);
// }

// console.log(userListStorage.get());

// export default { isStarted};
