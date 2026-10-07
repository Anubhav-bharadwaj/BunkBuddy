<div align="center">

# 🎓 BunkBuddy

### Your smart, AI-powered attendance tracker and bunk planner

Track attendance, match your college portal percentage exactly, simulate skipping classes, and get AI-backed recovery strategies. All running privately in your browser.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Storage](https://img.shields.io/badge/storage-browser%20localStorage-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20API-8E75B2)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

[Features](#-features) • [How It Works](#-how-it-works) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Roadmap](#-roadmap)

</div>

---

## 📖 Overview

Most attendance trackers only tell you what already happened. **BunkBuddy** also tells you what *will* happen.

You set up your subjects and weekly timetable once. From then on, BunkBuddy automates the daily check-ins, mirrors your college portal's exact percentage (including its rounding quirks and library bonus), forecasts the effect of skipping classes, and asks an AI advisor for the smartest way to stay above your college's threshold.

> **Privacy first:** all your data lives in your browser's storage. There is no account, no backend, and no server database.

---

## ✨ Features

| Module | What it does |
|---|---|
| 🗓️ **Subjects & Timetable** | Define your subjects and build a weekly schedule that drives every other feature. |
| 📊 **Daily Dashboard** | Shows today's classes from your timetable. Check them off and your true portal percentage updates instantly. |
| 🎯 **Portal-Accurate Math** | Uses double-rounding logic and adds the library bonus so the number matches your college portal. |
| 🔮 **Bunk Simulator** | Previews what happens to your percentage if you skip tomorrow's classes. |
| 📈 **Velocity Chart** | Interactive chart that models your attendance trajectory over the next 20 classes. |
| 🤖 **AI Recovery Strategist** | Sends your state to the Gemini API and gets the cheapest days to skip, or a warning when you're heading toward the danger zone. |
| 🔒 **Offline & Private** | Everything is stored locally in your browser. |

---

## 🧠 How It Works

BunkBuddy is a connected loop. Each layer feeds the next.

```
┌────────────────────┐
│ 1. Subjects &      │  Defines what you study and when
│    Timetable       │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ 2. Dashboard       │  Daily check-ins → exact portal %
│   (Daily Engine)   │  (double-rounding + library bonus)
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ 3. Simulator       │  "What if I skip tomorrow?"
│   (Forecasting)    │  + 20-class velocity chart
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ 4. AI Recovery     │  Gemini analyses your full state
│   (Strategist)     │  and recommends the cheapest skips
└────────────────────┘
```

### 1️⃣ The Foundation: Subjects & Timetable
Everything starts by defining your classes and when they occur. Your weekly timetable gives BunkBuddy a reliable daily schedule to automate the rest.

### 2️⃣ The Daily Engine: Dashboard
Each day the dashboard reads your timetable for **Today's Classes** and lets you mark them. As you log them, it applies the **double-rounding logic** and adds your **library bonus**, so your percentage always matches the college portal.

### 3️⃣ The Forecasting Matrix: Simulator
Instead of only tracking the past, the Simulator looks at tomorrow's timetable classes and calculates exactly what happens to your percentage if you skip them. The interactive **Velocity Chart** then models your trajectory over the next 20 classes.

### 4️⃣ The Strategist: AI Recovery
When you need a mastermind, BunkBuddy pings the **Gemini API** with your timetable structure, current percentage, and your college's target threshold. The AI then acts as a personal advisor by:
- Finding the **cheapest days to skip**, such as low-value lectures that barely dent your aggregate.
- Warning you when you're **mathematically walking into a danger zone**.

---

## 🛠️ Tech Stack

<!-- Update this table to match the repo exactly -->

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Radix UI |
| **State** | Zustand (with persist middleware) |
| **Charts** | Recharts |
| **AI** | `@google/genai` (Client-side) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A [Gemini API key](https://aistudio.google.com/app/apikey) (only needed for the AI Recovery feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/Anubhav-bharadwaj/BunkBuddy.git

# Move into the project
cd BunkBuddy
```

### Run locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then visit `http://localhost:5173`.

### Configure the AI feature

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open BunkBuddy and navigate to the **Settings** tab.
3. Paste your API key in the **Gemini API Integration** section and hit Save.

>  **Security note:** because BunkBuddy runs fully client-side, never commit your API key to the repo. Keep it in browser storage or a git-ignored config file.

---

## 📱 Usage

1. **Add subjects** with their names and target classes.
2. **Build your weekly timetable** by assigning subjects to specific days and time slots.
3. **Configure Settings** like your target attendance threshold (e.g. 75%) and library bonus.
4. **Check in daily** from the Dashboard to mark classes as Attended or Missed.
5. **Simulate** skipping upcoming classes on the Simulator tab and study the Velocity Chart.
6. **Ask the AI** for a recovery or bunk strategy on the AI Recovery tab when you need a mastermind.

---


## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

**Built by [Anubhav Bharadwaj](https://github.com/Anubhav-bharadwaj)**

⭐ Bunk smart, stay safe, and never let your attendance drop!

</div>