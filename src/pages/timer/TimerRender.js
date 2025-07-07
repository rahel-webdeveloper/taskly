import getSuggestionsComponent from "../../components/GetSuggesstion";
import TimerLogic, { handleTimerEvents, isWindowLarge } from "./TimerLogic";

const TimerRender = () => {
  return `
<div class="timer-container">

    <div class="timer-first-section">
        <div class="timer-header">
            <div class="timer-title">
             <p>Hour</p>
             <p>Minutes</p>
             <p>Second</p>
            </div>
        </div>
        <div class="timer-picker">
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
        <i class="ri-play-fill"></i> Start</button>
    </div>

    <div class="timer-second-section">
        <svg class="svg-circle-container" viewBox="0 0 100 100">
            <circle class="svg-circle" id="behind-circle" cx="50" cy="50" r="35" />
            <circle class="svg-circle" id="countdown-circle" cx="50" cy="50" r="35" stroke-linecap="round"
                stroke="green" stroke-dasharray="219.91" stroke-dashoffset="219" />
            <text class="timer-text" id="timer-text" x="50" y="-45" dominant-basline="middle">0</text>
        </svg>

        <div class="timer-buttons">
            <button type="button" class="timer-button" id="timer-cancel" disabled><i class="ri-close-line"></i>
                Cancel</button>
            <button type="button" class="timer-button" id="timer-pause" disabled><i class="ri-pause-fill"></i>
                Pause</button>
            <button type="button" class="timer-button" id="timer-resume" disabled><i class="ri-play-fill"></i>
                Resume</button>
        </div>
    </div>
    
</div>

${getSuggestionsComponent()}

    `;
};

TimerRender.init = function () {
  document
    .querySelector(".timer-container")
    .addEventListener("click", handleTimerEvents);

  // For large screen UI
  window.addEventListener("resize", isWindowLarge);

  TimerLogic();
};

export default TimerRender;
