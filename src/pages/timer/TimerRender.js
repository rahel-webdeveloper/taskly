import sendFeedbackComponent from "../../components/SendFeedback";
import { handleTimerEvents } from "./store";
import TimerLogic, { TimerEls } from "./TimerLogic";

const TimerRender = () => {
  return `
   <div class="timer-container">  </div>
  ${sendFeedbackComponent()}`;
};

TimerRender.init = function () {
  const { timerContainerEl } = TimerEls();

  timerContainerEl?.removeEventListener("click", handleTimerEvents);
  timerContainerEl?.addEventListener("click", handleTimerEvents);
  TimerLogic();
};

export const timerPickerCompo = () => {
  return `
    <div class="timer-picker">
        <div class="picker-header">
            <div class="timer-title">
                <p>Hour</p>
                <p>Minutes</p>
                <p>Second</p>
            </div>
        </div>
        <div class="timer-picker-els">
            <div class="picker" id="hour-picker">
                <div class="picker-items"></div>
            </div>
            <span class="colon">:</span>
            <div class="picker" id="minute-picker">
                <div class="picker-items"></div>
            </div>
            <span class="colon">:</span>
            <div class="picker" id="second-picker">
                <div class="picker-items"></div>
            </div>
        </div>
        <div class="tap-div">
            <button type="button" class="tap-time-div" id="tap-time-div">
                <p id="tap-choose-time">00:15:00</p>
            </button>
        </div>
        <button type="button" class="timer-button" id="timer-start" disabled>
            <i class="ri-play-fill"></i> Start
        </button>
    </div>`;
};

export const timerCircleCompo = () => {
  return `
    <div class="timer-circle">
        <svg class="svg-circle-container" viewBox="0 0 100 100">
            <circle class="svg-circle" id="behind-circle" cx="50" cy="50" r="35" />
            <circle
                class="svg-circle"
                id="countdown-circle"
                cx="50"
                cy="50"
                r="35"
                stroke-linecap="round"
                stroke="green"
                stroke-dasharray="219.91"
                stroke-dashoffset="219"
            />
            <text
                class="timer-text"
                id="timer-text"
                x="50"
                y="-45"
                dominant-basline="middle"
            >
                0
            </text>
        </svg>

        <div class="timer-circle-btns">
            <button type="button" class="timer-button" id="timer-cancel">
                <i class="ri-close-line"></i>
                Cancel
            </button>
            <button type="button" class="timer-button" id="timer-pause" disabled>
                <i class="ri-pause-fill"></i>
                Pause
            </button>
            <button type="button" class="timer-button" id="timer-resume" disabled>
                <i class="ri-play-fill"></i>
                Resume
            </button>
        </div>
    </div>`;
};

export default TimerRender;
