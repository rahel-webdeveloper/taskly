# Taskly Pro

> A lightweight, Full Stack task-management PWA built with Vanilla JavaScript, NanoStores, Chart.js and AI Advisor powered task advising.

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

- Authentacation and Authorization

  - Creating account via Sign Up page
  - Sign In to your account via Sign In page
  - Removing accoute with validation of password

- Task Hub

  - Generate task description base on given title by AI
  - Create, edit, delete, and track tasks
  - Filter tasks by status
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
  - Progress Donut Chart: visual summary of On-Hold, In-Progress, and Done statuss
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
- [NanoStores](https://nanostores.dev/) for global status management
- [Navigo](https://github.com/krasimir/navigo) for client-side routing
- [Notyf](https://github.com/caroso1222/notyf) for toast notifications
- Puter.js + AI Advisor API for AI-driven task advising
- Service Worker & Web App Manifest for PWA support
- EmailJs for getting feedback and opinions
- Notyf for giving beutifull UI notification

---

## 🚀 Getting Started

### Installation

- **Clone the repo and install the defendencies**

  ```bash
  git clone https://github.com/rahel-webdeveloper/taskly.git
  cd taskly
  npm install
  ```

### Usage

```bash
npm run dev
```

- **Task Creation:** Navigate to Task Hub and click "Create task or plus icon"
- **Task Management:** Drag tasks between status columns to update progress
- **Productivity Insights:** Visit the Dashboard to view your productivity metrics and today's report
- **Focus Sessions:** Use the Timer feature to maintain concentration on important tasks
- **AI Assistance:** Consult the AI Advisor when you need help organizing or prioritizing tasks

## 🧠 Waht I Learned

Building **Taskly** taught me to:

- **Creating and structuring an AI driven app from scratch📝**
- **Integrate AI** advice with AI Advisor API via Puter.js
- **Manage status** effectively with Nano Stores.
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

```

taskly/
├── public/                 # Images, Minifest.json, and other assets
├── src/                    # Main source code for the app
│   ├── assets/             # Images, fonts, and other assets
│   ├── components/         # Reusable React/Vue/JS components
│   ├── sass/               # SCSS stylesheets and variables
│   ├── data/               # UI data and local storage
│   ├── services/           # API Client and auth services
│   ├── tasks/              # Tasks all logic and UI
│   ├── routes.js           # SPR (single page route) controller
│   ├── pages/              # Main page views/screens
│          ├── welcome/            # Welcome page and getting user feedback
│          ├── auth/               # auth logic and components (Sign In, Sign Up, Remove Account)
│          ├── taskHub/            # First page of APP where create new task and see today's report
│          ├── dashsboard/         # data charts and show user productivity
│          ├── aiAdvice/           # AI Advice page you can chat and get advices
│          ├── timer/              # Timer logic and components (picker, focus)

├── .env                    # Environment variables (API keys, config)
├── App.js                  # Root app component
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
├── vercel.json             # vercel config
```

### Future Enhancements💡

- Mobile application with cross-platform synchronization
- Calender integration for deadline management
- Team collabration features
- Advanced reporting and analytics
- Custom themes and persolzation options

### Author

Made with 💜 by [**Khatibullah Rahel**](https://www.linkedin.com/in/khatibullah-rahel-a93a74281/)

---

> [!IMPORTANT] > **Love Taskly? Throw us a ⭐ — it makes our day!😊**

---

**Follow us on social media**
[LinkdIn](https://www.linkedin.com/in/khatibullah-rahel-a93a74281/)
[Facebook](https://www.facebook.com/khatibullah.asaad.7)
[Telegram](https://t.me/rahel_023)

_Taskly - Organize, Focus, Achieve_
