const timerLogic = () => {
  const timerContainer = document.querySelector(".timer-container");
  const timerFirstSection = document.querySelector(".timer-first-section");
  const timerSecondSection = document.querySelector(".timer-second-section");
  const countdownCircle = document.getElementById("countdown-circle");
  const tapTimeDiv = document.getElementById("tap-time-div");
  const timerText = document.getElementById("timer-text");
  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  const resumeBtn = document.getElementById("timer-resume");
  const cancelBtn = document.getElementById("timer-cancel");

  const redius = 35;
  const circumference = 2 * Math.PI * redius;

  let selectedHour = 0;
  let selectedMinute = 0;
  let selectedSecond = 0;

  let startTime = Date.now();
  let elapsedTime = 0;
  let isStarted = false;
  let isPaused = false;
  let isCanceled = false;
  let animationId = null; // to store the requestAnimationFrame ID

  function populateInfinitePicker(pickerId, range) {
    const pickerItems = document.querySelector(`#${pickerId} .picker-items`);
    if (!pickerItems) return;

    // Create cloned items for infinite scrolling
    const items = [];
    for (let i = 0; i < range; i++) {
      items.push(i.toString().padStart(2, "0"));
    }
    const allItems = [...items, ...items, ...items];
    allItems.forEach((value) => {
      const item = document.createElement("div");
      item.classList.add("picker-item");
      item.textContent = value;
      pickerItems.appendChild(item);
    });

    setInitialTime(99.1, 119.1, 119.1);
  }

  function setInitialTime(hourScroSize, minuScroSize, secScroSize) {
    const hourPicker = document.querySelector("#hour-picker");
    const minutePicker = document.querySelector("#minute-picker");
    const secondPicker = document.querySelector("#second-picker");

    hourPicker.scrollTop = hourScroSize * 40;
    minutePicker.scrollTop = minuScroSize * 40;
    secondPicker.scrollTop = secScroSize * 40;
  }

  function tapChooseTimeFunc(isStarted) {
    if (isStarted) {
      setInitialTime(99.1, 14.1, 119.1);
      tapTimeDiv.style.cssText = `
        background-color: transparent;
        border: 1px solid #bbb2cc;
      `;
    } else {
      setInitialTime(99.1, 119.1, 119.1);
      tapTimeDiv.style.cssText = `
        background-color: #3e425d5a;
        border: none;
      `;
    }
  }

  // Add infinite scroll adjustment
  function addInfiniteScroll(pickerId, range, onChange) {
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
      items.forEach((item, i) => {
        item.classList.toggle("selected", i % range === index);
      });

      selectedTime() >= 1000
        ? (startBtn.disabled = false)
        : (startBtn.disabled = true);

      // Trigger change event
      onChange(index);
    });
  }

  // Initialize Infinite Picker
  populateInfinitePicker("hour-picker", 100);
  populateInfinitePicker("minute-picker", 60);
  populateInfinitePicker("second-picker", 60);

  addInfiniteScroll("hour-picker", 100, (hour) => {
    selectedHour = hour;
    selectedTime();
  });
  addInfiniteScroll("minute-picker", 60, (minute) => {
    selectedMinute = minute;
    selectedTime();
  });
  addInfiniteScroll("second-picker", 60, (second) => {
    selectedSecond = second;
    selectedTime();
  });

  // Update selected time
  const selectedTime = () => {
    return (
      (selectedHour * 60 * 60 + selectedMinute * 60 + selectedSecond) * 1000
    );
  };

  function getSelectedTimeInSeconds() {
    const totalMinutes = selectedTime() / 1000 / 60;
    return totalMinutes * 60;
  }

  // Circle logic
  const updateCountdownCircle = (totalSeconds) => {
    const now = Date.now();
    elapsedTime = Math.min((now - startTime) / 1000, totalSeconds);

    if (isPaused || isCanceled) return;

    const offset = (elapsedTime / totalSeconds) * circumference;
    countdownCircle.style.strokeDashoffset = offset;

    const remainingTime = Math.ceil(totalSeconds - elapsedTime);
    timerText.textContent = `${Math.floor(
      remainingTime / 60 / 60
    )}:${Math.floor(remainingTime / 60)}:${remainingTime}`;

    if (remainingTime < 6) countdownCircle.style.stroke = "#fa6e6e";

    if (elapsedTime < totalSeconds)
      animationId = requestAnimationFrame(() => {
        updateCountdownCircle(totalSeconds);
      });
    else {
      resetUI();
    }
  };

  // Timer events
  if (timerContainer)
    timerContainer.addEventListener("click", handleTimerEvents);

  function handleTimerEvents(event) {
    const id = event.target.id;

    if (id === "timer-start") timerOPeration.startTimer();

    if (id === "tap-time-div") timerOPeration.toggleTapTime();

    if (id === "timer-pause") timerOPeration.pauseTimer();

    if (id === "timer-resume") timerOPeration.timerResume();

    if (id === "timer-cancel") timerOPeration.cancelTimer();
  }

  class TimerOperation {
    startTimer() {
      const totalSeconds = getSelectedTimeInSeconds();
      startTime = Date.now();

      resetTimerState();
      // if (countdownCircle && timerText)
      animationId = requestAnimationFrame(() =>
        updateCountdownCircle(totalSeconds)
      );

      if (!isWindowLarge()) {
        toggleStartSection(true);
      }
    }

    toggleTapTime() {
      isStarted = !isStarted;
      selectedTime();
      tapChooseTimeFunc(isStarted);
      isStarted ? (selectedMinute = 10) : (selectedMinute = 0);
      isStarted ? (startBtn.disabled = false) : (startBtn.disabled = true);
    }

    pauseTimer() {
      isPaused = true;
      cancelAnimationFrame(animationId);
      togglePauseResumeBtns(true);
    }

    timerResume() {
      isPaused = false;
      startTime = Date.now() - elapsedTime * 1000;
      animationId = requestAnimationFrame(() =>
        updateCountdownCircle(getSelectedTimeInSeconds())
      );
      togglePauseResumeBtns(false);
    }

    cancelTimer() {
      isStarted = false;
      isCanceled = true;
      cancelAnimationFrame(animationId);
      resetUI();
    }
  }

  const timerOPeration = new TimerOperation();

  function resetUI() {
    countdownCircle.style.strokeDashoffset = circumference;
    countdownCircle.style.stroke = "#bbb2cc";
    timerText.textContent = 0;
    cancelBtn.disabled = true;
    resumeBtn.disabled = true;
    pauseBtn.disabled = true;
    startBtn.disabled = false;
    tapTimeDiv.disabled = false;
    togglePauseResumeBtns(false);
    if (!isWindowLarge()) {
      toggleStartSection(false);
    }
  }

  function resetTimerState() {
    isPaused = false;
    isCanceled = false;
    isStarted = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = false;
    cancelBtn.disabled = false;
    startBtn.disabled = true;
    tapTimeDiv.disabled = true;
    elapsedTime = 0;
  }

  function togglePauseResumeBtns(isPausedState) {
    pauseBtn.style.display = isPausedState ? "none" : "inline";
    resumeBtn.style.display = isPausedState ? "inline" : "none";
  }

  function toggleStartSection(isStarted) {
    timerFirstSection.style.display = isStarted ? "none" : "inline";
    timerSecondSection.style.display = isStarted ? "inline" : "none";
  }

  // remove the toggle start timer function
  window.addEventListener("resize", isWindowLarge);

  function isWindowLarge() {
    const width = window.innerWidth;
    if (width >= 1024) {
      timerFirstSection.style.display = "grid";
      timerSecondSection.style.display = "grid";
      return true;
    } else if (timerFirstSection && timerSecondSection)
      isStartedTimer(isStarted);
    return false;
  }

  function isStartedTimer(isStarted) {
    if (isStarted) {
      timerFirstSection.style.display = "none";
      timerSecondSection.style.display = "grid";
    } else {
      timerFirstSection.style.display = "grid";
      timerSecondSection.style.display = "none";
    }
  }
};

export default timerLogic;
