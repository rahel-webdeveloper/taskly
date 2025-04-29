# Taskly Pro

> A lightweight, front-end task-management PWA built with Vanilla JavaScript, NanoStores, Chart.js and Claude AI-powered task advising.

---

## 📋 Table of Contents

1. [Description](#description)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Usage](#usage)
5. [Screenshots](#screenshots)
6. [Project Structure](#project-structure)
7. [Future Enhancements](#future-enhancements)
8. [License](#license)
9. [Author](#author)

---

## 🔍 Description

Taskly Pro is a Progressive Web App that helps you create, track, and analyze your tasks in real-time. It combines intuitive UI components, data-driven charts, and an AI-powered advisor (via Claude API) to keep you productive and informed about your task load.

---

## ✨ Features

- Task Hub

  - Create, edit, delete, and track tasks
  - Filter tasks by category, priority, or status

- AI Advisor

  - Get personalized advice on how to prioritize or tackle your tasks
  - Powered by Claude API through outer.js

- Dashboard

  - Categories Bar: breakdown of tasks by category
  - 7-Day Activity: line/bar chart of tasks completed over the last week
  - Progress Donut Chart: visual summary of On-Hold, In-Progress, and Done states
  - Time Reports: tracked vs. remaining time per task

- Timer
  - Circular, interactive timer UI for Pomodoro or custom intervals
  - Start/Pause/Reset controls

---

## 🛠 Tech Stack

- HTML5 & CSS3
- Vanilla JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) for interactive charts
- [NanoStores](https://nanostores.dev/) for global state management
- [Navigo](https://github.com/krasimir/navigo) for client-side routing
- [Notyf](https://github.com/caroso1222/notyf) for toast notifications
- outer.js + Claude API for AI-driven task advising
- Service Worker & Web App Manifest for PWA support

---

## 🚀 Getting Started

### Installation

1. Clone the repo  
   `bash
   git clone https://github.com/yourusername/taskmaster-pro.git
   cd taskmaster-pro
