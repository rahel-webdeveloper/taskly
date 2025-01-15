const timerLogic = () => {
  let selectedHour = 0;
  let selectedMinute = 0;
  let selectedSecond = 0;

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
    const tapTimeDiv = document.getElementById("tap-time-div");
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
      const startBtn = document.getElementById("timer-start");
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

      if (selectedTime() >= 1000) {
        startBtn.disabled = false;
      } else {
        startBtn.disabled = true;
      }

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

  const timerContainer = document.querySelector(".timer-container");
  const timerFirstSection = document.querySelector(".timer-first-section");
  const timerSecondSection = document.querySelector(".timer-second-section");
  const countdownCircle = document.getElementById("countdown-circle");
  const timerText = document.getElementById("timer-text");
  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  const resumeBtn = document.getElementById("timer-resume");
  const cancelBtn = document.getElementById("timer-cancel");

  const redius = 35;
  const circumference = 2 * Math.PI * redius;

  let startTime = Date.now();
  let elapsedTime = 0;
  let isStated = false;
  let isPaused = false;
  let isCanceled = false;
  let animationId = null; // to store the requestAnimationFrame ID

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
    timerText.textContent = remainingTime;

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

    if (id === "timer-start") startTimer();

    if (id === "tap-time-div") toggleTapTime();

    if (id === "timer-pause") pauseTimer();

    if (id === "timer-resume") timerResume();

    if (id === "timer-cancel") cancelTimer();
  }

  function startTimer() {
    const totalSeconds = getSelectedTimeInSeconds();
    startTime = Date.now();

    resetTimerState();
    // if (countdownCircle && timerText)
    animationId = requestAnimationFrame(() =>
      updateCountdownCircle(totalSeconds)
    );

    toggleStartSection(true);
    pauseBtn.disabled = false;
    resumeBtn.disabled = false;
    cancelBtn.disabled = false;
  }

  function toggleTapTime() {
    isStated = !isStated;
    selectedTime();
    tapChooseTimeFunc(isStated);
    isStated ? (selectedMinute = 10) : (selectedMinute = 0);
    isStated ? (startBtn.disabled = false) : (startBtn.disabled = true);
  }

  function pauseTimer() {
    isPaused = true;
    cancelAnimationFrame(animationId);
    togglePauseResumeBtns(true);
  }

  function timerResume() {
    isPaused = false;
    startTime = Date.now() - elapsedTime * 1000;
    animationId = requestAnimationFrame(() =>
      updateCountdownCircle(getSelectedTimeInSeconds())
    );
    togglePauseResumeBtns(false);
  }

  function cancelTimer() {
    isCanceled = true;
    cancelAnimationFrame(animationId);
    resetUI();
  }

  function resetUI() {
    countdownCircle.style.strokeDashoffset = circumference;
    countdownCircle.style.stroke = "#bbb2cc";
    timerText.textContent = 0;
    cancelBtn.disabled = true;
    resumeBtn.disabled = true;
    pauseBtn.disabled = true;
    togglePauseResumeBtns(false);
    toggleStartSection(false);
  }

  function resetTimerState() {
    isPaused = false;
    isCanceled = false;
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
  window.addEventListener("resize", function () {
    const width = window.innerWidth;
    console.log(typeof width);

    if (parseInt(width) === 1024) {
      console.log("delete");

      delete window.toggleStartSection;
    }
  });
};

export default timerLogic;
