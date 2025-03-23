import { Chart } from "chart.js/auto";
import { listTasks } from "../../listTasks/store";
import { todayReport } from "../../listTasks/ListTasksLogic";

const DashboardLogic = () => {
  const tasks = listTasks.get();

  initCategoryBars(tasks);
  initSevenDaysLine(tasks);
  initStateChart(tasks);
  initTrackedTimeBars(tasks);
  todayReport(listTasks.get());
  // console.log("second success");
};

const initCategoryBars = (tasks) => {
  const categoryCountEl = document.getElementById("ctegory-count");

  const categoryObjects = tasks.reduce((accumlator, current) => {
    const category = current.category;
    accumlator[category] = (accumlator[category] || 0) + 1;
    return accumlator;
  }, {});

  const categoryArray = Object.entries(categoryObjects).map(
    ([category, count]) => ({ category, count })
  );

  categoryCountEl.textContent = categoryArray.length;

  new Chart(document.getElementById("category_bar"), {
    type: "bar",
    data: {
      labels: categoryArray.map((task) => task.category.slice(0, 5)),
      datasets: [
        {
          data: Object.values(categoryObjects),
          backgroundColor: "rgb(228, 184, 117)",
          hoverBackgroundColor: "rgb(241, 187, 100)",
          borderRadius: 7,
          barThickness: 10,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 2.5,

      scales: {
        y: {
          ticks: {
            color: "rgb(158, 158, 158, 0.7)",
            display: false,

            font: {
              family: "DM Sans",
            },
          },
          grid: {
            display: false,
            drawTicks: false,
            tickLength: 3,
          },
          suggestedMin: 0,
          suggestedMax: 12,
          beginAtZero: true,
        },
        x: {
          ticks: {
            color: "rgba(158, 158, 158, 0.5)",
            font: {
              family: "DM Sans",
            },
          },
          grid: {
            display: false,
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: {
            family: "DM Sans",
            weight: 400,
          },
          bodyFont: {
            family: "DM Sans",
          },
          backgroundColor: "rgba(16, 16, 19, 0.59)",
          displayColors: false,
        },
      },
    },
  });
};

const initSevenDaysLine = (tasks) => {
  const seventDays = document.getElementById("seven-days-count");

  const today = new Date();
  const taskCounts = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date();

    date.setDate(today.getDate() - i);

    taskCounts[date.toString().slice(0, 10)] = 0;
  }

  tasks.forEach((task) => {
    const taskDate = new Date(task.updatedAt).toString().slice(0, 10);

    if (taskCounts.hasOwnProperty(taskDate)) {
      taskCounts[taskDate]++;
    }
  });

  const taskCountsArray = Object.entries(taskCounts)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  seventDays.textContent = taskCountsArray.reduce(
    (accumlator, currentValue) => accumlator + currentValue.count,
    0
  );

  new Chart(document.getElementById("days_line"), {
    type: "line",
    data: {
      labels: taskCountsArray.map((task) => task.date.slice(0, 3)),
      datasets: [
        {
          data: taskCountsArray.map((task) => task.count),
          backgroundColor: "rgb(134, 181, 178)",
          borderColor: "rgb(134, 181, 178)",
          pointStyle: "circle",
          tension: 0.2,
          pointRadius: 2,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 7,

      scales: {
        y: {
          ticks: {
            color: "rgb(158, 158, 158, 0.5)",
            font: {
              family: "DM Sans",
            },
            display: false,
          },
          grid: {
            display: false,
          },

          beginAtZero: true,
        },
        x: {
          ticks: {
            color: "rgba(158, 158, 158, 0.7)",
            font: {
              family: "DM Sans",
            },
          },
          grid: {
            // display: false,
            // drawOnChartArea: false,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: {
            family: "DM Sans",
            weight: 400,
          },
          bodyFont: {
            family: "DM Sans",
          },
          backgroundColor: "rgba(16, 16, 19, 0.59)",
          displayColors: false,
        },
      },
    },
  });
};

const initStateChart = (tasks) => {
  const stateSpans = document.querySelectorAll(".state-span span");
  const donePercetageEl = document.getElementById("done-task_percetage");

  const doneLength = tasks.filter((task) => task.state === "done").length;
  const inProgressLength = tasks.filter(
    (task) => task.state === "in-progress"
  ).length;
  const onHoldLength = tasks.filter((task) => task.state === "on-hold").length;

  stateSpans[0].textContent = "On hold / " + onHoldLength;
  stateSpans[1].textContent = "In progress / " + inProgressLength;
  stateSpans[2].textContent = "Done / " + doneLength;

  donePercetageEl.innerHTML = `${
    tasks.length !== 0 ? Math.floor((doneLength / tasks.length) * 100) : 0
  }% ${"<p>Done!</p>"}`;

  new Chart(document.getElementById("state_doughnut").getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["On hold", "In Progress", "Done"],
      datasets: [
        {
          data: [onHoldLength, inProgressLength, doneLength],
          backgroundColor: [
            "rgb(145, 125, 182)",
            "rgb(237, 192, 123)",
            "rgb(106, 179, 203)",
          ],
          borderWidth: 0,
          borderRadius: 2.5,
          spacing: 1.5,
        },
      ],
    },
    options: {
      // aspectRatio: 1,
      responsive: true,
      cutout: 43,

      scales: {
        y: {
          display: false,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
            drawTicks: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          titleFont: {
            family: "DM Sans",
            weight: 400,
          },
          backgroundColor: "rgba(16, 16, 19, 0.7)",
          displayColors: false,
        },
      },
    },
  });
};

const initTrackedTimeBars = (tasks) => {
  const trackedTimeEl = document.getElementById("tracked-time");
  const remaingTimeEl = document.getElementById("remaining-time");

  const trackTimeObjects = tasks.reduce((accumlator, current) => {
    const category = current.state;
    accumlator[category] =
      (accumlator[category] || 0) + current.durationMinutes;
    return accumlator;
  }, {});

  const trackedTime = trackTimeObjects["done"] || 0;

  const remainingTime =
    (trackTimeObjects["in-progress"] || 0) + (trackTimeObjects["on-hold"] || 0);

  const trackedTimeOnHour = Math.floor(trackedTime / 60);
  const remainingTimeOnHour = Math.floor(remainingTime / 60);

  trackedTimeEl.textContent = `${trackedTimeOnHour && trackedTime ? "" : 0} ${
    trackedTimeOnHour ? trackedTimeOnHour + "h" : ""
  } ${trackedTimeOnHour && trackedTime % 60 ? "&" : ""} ${
    trackedTime % 60 ? (trackedTime % 60) + "m" : ""
  }`;

  remaingTimeEl.textContent = `${
    remainingTimeOnHour && remainingTime ? "" : 0
  } ${remainingTimeOnHour ? remainingTimeOnHour + "h" : ""} ${
    remainingTimeOnHour && remainingTime % 60 ? "&" : ""
  } ${remainingTime % 60 ? (remainingTime % 60) + "m" : ""}`;

  new Chart(document.getElementById("tracked-time_bar"), {
    type: "bar",
    data: {
      labels: ["Time details"],
      datasets: [
        {
          label: "tracked time",
          data: [trackedTime],
          backgroundColor: "rgb(106, 179, 203)",
          barThickness: 9,
          borderRadius: {
            bottomLeft: 20,
            bottomRight: 20,
            topLeft: 10,
            topRight: 10,
          },
          borderSkipped: false,
        },
        {
          data: [remainingTime],
          backgroundColor: "rgb(255, 224, 131)",
          hoverBackgroundColor: "rgb(234, 198, 91)",
          barThickness: 9,
          borderRadius: {
            bottomLeft: 20,
            bottomRight: 20,
            topLeft: 10,
            topRight: 10,
          },
          borderSkipped: false,
          label: "remaining time",
          borderColor: "#ffffff",
          base: 0,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 7,

      indexAxis: "y",

      scales: {
        y: {
          stacked: true,
          display: false,

          ticks: {
            color: "rgb(158, 158, 158, 0.7)",
            display: false,

            font: {
              family: "DM Sans",
            },
          },
          grid: {
            display: false,
            drawTicks: false,
            tickLength: 0,
          },
        },
        x: {
          stacked: true,
          display: false,

          ticks: {
            display: false,
            color: "rgba(158, 158, 158, 0.5)",
            font: {
              family: "DM Sans",
            },
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: {
            family: "DM Sans",
            weight: 400,
          },
          bodyFont: {
            family: "DM Sans",
          },
          backgroundColor: "rgba(16, 16, 19, 0.59)",
          displayColors: false,
        },
      },
    },
  });
};

export default DashboardLogic;
