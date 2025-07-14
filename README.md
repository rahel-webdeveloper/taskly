# Taskly Pro

> A lightweight, front-end task-management PWA built with Vanilla JavaScript, NanoStores, Chart.js and AI Advisor powered task advising.

![📷Screenshot](./public/welcome%20page%20screenshot.png)

## 🌐 Live Demo

Check out the live demo here: **[Taskly](https://task-ly-ai.vercel.app/)**

---

## 📋 Table of Contents

- [Taskly Pro](#taskly-pro)
  - [🌐 Live Demo](#-live-demo)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔍 Description](#-description)
  - [✨ Features](#-features)
      - [This app is completely responsive from small to large devices](#this-app-is-completely-responsive-from-small-to-large-devices)
  - [🛠 Tech Stack](#-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
  - [🧠 Waht I Learned](#-waht-i-learned)
  - [🤌 What Was Intresting For Me:](#-what-was-intresting-for-me)
  - [project-structure 📂](#project-structure-)
    - [Future Enhancements💡](#future-enhancements)
    - [Author](#author)

---

## 🔍 Description

Taskly Pro is a Progressive Web App that helps you create, track, and analyze your tasks in real-time. It combines intuitive UI components, data-driven charts, and an AI-powered advisor (via Puter.js the AI Advisor API) to keep you productive and informed about your task load.

---

## ✨ Features

- Task Hub

  - Generate task description base on given title by AI
  - Create, edit, delete, and track tasks
  - Filter tasks by statuses
  - Sort by name and date
  - Special button for task assistant

- AI Advisor

  - Get personalized advice on how to prioritize or tackle your tasks
  - Powered by AI Advisor API through Puter.js
  - Achieve best advices base on your history messages feature
  - Save every new chat saparatly on local storage

- Dashboard

  - Categories Bar: breakdown of tasks by category
  - 7-Day Activity: line/bar chart of tasks completed over the last week
  - Progress Donut Chart: visual summary of On-Hold, In-Progress, and Done states
  - Time Reports: tracked vs. remaining time per task

- Timer
  - Smooth animations and an easy-to-use timer
  - Circular, interactive timer UI for custom intervals
  - Start/Pause/Reset controls

#### This app is completely responsive from small to large devices

---

## 🛠 Tech Stack

- HTML5 & SCSS
- Vanilla JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) for interactive charts
- [NanoStores](https://nanostores.dev/) for global state management
- [Navigo](https://github.com/krasimir/navigo) for client-side routing
- [Notyf](https://github.com/caroso1222/notyf) for toast notifications
- Puter.js + AI Advisor API for AI-driven task advising
- Service Worker & Web App Manifest for PWA support
- EmailJs for getting feedback and opinions

---

## 🚀 Getting Started

### Installation

1. Clone the repo

   ```bash
   git clone sorry it is privte for now, but if you are recruiter you can message me
   ```

### Usage

- **Task Creation:** Navigate to Task Hub and click "Create task or plus icon"
- **Task Management:** Drag tasks between status columns to update progress
- **Productivity Insights:** Visit the Dashboard to view your productivity metrics
- **Focus Sessions:** Use the Timer feature to maintain concentration on important tasks
- **AI Assistance:** Consult the AI Advisor when you need help organizing or prioritizing tasks

## 🧠 Waht I Learned

Building **Taskly** taught me to:

- **Creating and structuring an AI driven app from scratch📝**

---

- **Integrate AI** advice with AI Advisor API via Puter.js
- **Manage state** effectively with Nano Stores.
- **Route** seamlessly using Navigo.
- **Visualize data** via Chart.js (bar, doughnut, line, pie).
- **Polish UX** with Notyf toasts and a custom SVG timer.

## 🤌 What Was Intresting For Me:

For the first time managing an AI assistant base on your own thoughts through code

```js
export const systemMsg = {
  role: "system",
  content: `
  your name is Taskly! you are a task advisor!
  `,
};

export const getAdvice = async () => {
  const reply = await puter.ai.chat(systemMsg, {
    model: "claude-3-7-sonnet",
  });

  return reply;
};
```

## project-structure 📂

<details>
 Show structure
 <summary>
 ```bash
\---src
    |   main.js
    |   navbar.js
    |   routes.js
    |   reame.md
    |
    +---data
    |       localStorage.js
    |       tasks.js
    |
    +---listTasks
    |       ListTaskMain.js
    |       ListTasksLogic.js
    |       ListTasksRender.js
    |       store.js
    |
    +---pages
    |   +---ai_advice
    |   |       advisor.js
    |   |       AIAdviceLogic.js
    |   |       AIAdviceRender.js
    |   |       MainAIAdvice.js
    |   |       store.js
    |   |
    |   +---dashboard
    |   |       DashboardLogic.js
    |   |       DashboardRender.js
    |   |       MainDashboard.js
    |   |
    |   +---task_hub
    |   |       MainTaskHub.js
    |   |       store.js
    |   |       TaskHubLogic.js
    |   |       TaskHubRender.js
    |   |
    |   +---timer
    |   |       MainTimer.js
    |   |       store.js
    |   |       TimerLogic.js
    |   |       TimerRender.js
    |   |
    |   \---welcome
    |           MainWelcome.js
    |           WelcomeLogic.js
    |           WelcomeRender.js
    |
    +---sass
    |       main.scss
    |       _aiAdviceStyle.scss
    |       _dashboarStyle.scss
    |       _listTasksStyle.scss
    |       _mixins.scss
    |       _navbarStyle.scss
    |       _TasksStyle.scss
    |       _timerStyle.scss
    |       _variables.scss
    |       _welcomePageStyle.scss
    |
    \---services
            api-cleint.js
            getSuggestion.js
            helper.js
            toastNotifications.js
```
 </summary>
</details>

### Future Enhancements💡

- Authentacation and authorization features
- Mobile application with cross-platform synchronization
- Calender integration for deadline management
- Team collabration features
- Advanced reporting and analytics
- Custom themes and persolzation options

### Author

Made with 💜 by [**Khatibullah Rahel**](https://www.linkedin.com/in/khatibullah-rahel-a93a74281/)

**Follow us on social media**
[LinkdIn](https://www.linkedin.com/in/khatibullah-rahel-a93a74281/)
[Facebook](https://www.facebook.com/khatibullah.asaad.7)
[Telegram](https://t.me/rahel_023)

_Taskly - Organize, Focus, Achieve_
