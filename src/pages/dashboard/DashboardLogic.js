import { Chart } from "chart.js/auto";
import { listTask } from "../../App";

const DashboardLogic = () => {
  const tasks = listTask.get();

  initCategoryBars(tasks);
  initSevenDaysLine(tasks);
  initStateChart(tasks);
  initTrackedTimeBars(tasks);
};

const initCategoryBars = (tasks) => {
  const categoryCountEl = document.getElementById("ctegory-count");

  const categoryObjects = tasks.reduce((previous, current) => {
    const category = current.category;
    previous[category] = (previous[category] || 0) + 1;
    return previous;
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
      aspectRatio: 1.93,

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
          barThickness: 10,
          tension: 0.22,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 4,

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
          suggestedMin: 0,
          suggestedMax: 7,
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
  const donePercetageEl = document.getElementById("done-task_percetage");

  const doneLength = tasks.filter((task) => task.state === "done").length;
  const inProgressLength = tasks.filter(
    (task) => task.state === "in-progress"
  ).length;
  const onHoldLength = tasks.filter((task) => task.state === "on-hold").length;

  donePercetageEl.textContent =
    Math.floor((doneLength / tasks.length) * 100) + "%";

  new Chart(document.getElementById("state_doughnut").getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Done", "In Progress", "On Hold"],
      datasets: [
        {
          data: [doneLength, inProgressLength, onHoldLength],
          backgroundColor: [
            "rgb(144, 220, 214)",
            "rgb(237, 192, 123)",
            "rgb(145, 125, 182)",
          ],
          borderWidth: 0,
          borderRadius: 2.5,
          spacing: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: 43,

      scales: {
        y: {
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
  const categoryCountEl = document.getElementById("ctegory-count");

  const categoryObjects = tasks.reduce((previous, current) => {
    const category = current.category;
    previous[category] = (previous[category] || 0) + 1;
    return previous;
  }, {});

  const categoryArray = Object.entries(categoryObjects).map(
    ([category, count]) => ({ category, count })
  );

  const totalTime = 34;
  const trackedTime = 24;
  const remainingTime = 10;

  new Chart(document.getElementById("tracked-time_bar"), {
    type: "bar",
    data: {
      labels: ["Time details"],
      datasets: [
        {
          data: [trackedTime],
          backgroundColor: "rgb(228, 184, 117)",
          hoverBackgroundColor: "rgb(241, 187, 100)",
          borderRadius: 10,
          barThickness: 10,
          label: "tracked time",
        },

        {
          data: [remainingTime],
          backgroundColor: "rgb(145, 125, 182, .5)",
          borderRadius: 7,
          barThickness: 10,
          label: "remaining time",
          borderWidth: 0.3,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 6,
      indexAxis: "y",

      scales: {
        y: {
          stacked: true,
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
          stacked: true,
          ticks: {
            display: false,
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

export default DashboardLogic;
