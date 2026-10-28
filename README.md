# StudyMate AI - Modern College Study Assistant

A responsive, modern, and accessible web application designed to help college students organize their coursework, understand lecture notes, practice multiple-choice quizzes, and master active-recall flashcards.

Built strictly using standard web technologies with **zero frameworks, zero build steps, and zero external runtime dependencies**. The application operates 100% locally out-of-the-box without requiring any API keys.

---

## 1. Technologies Used

- **HTML5**: Semantic document structure (`<aside>`, `<nav>`, `<header>`, `<main>`, `<section>`, `<article>`), accessibility attributes (`aria-*`, `role`), and responsive viewports.
- **CSS3**: Custom properties (CSS variables) for light/dark design systems, CSS Grid, Flexbox, responsive media queries, and smooth 3D CSS transforms (`perspective`, `rotateY`) for interactive flashcards.
- **Vanilla JavaScript (ES6+)**: Modular application architecture, DOM event delegation, local state management, text analysis heuristics, and error handling.
- **Browser localStorage**: Persistent storage for study tasks, revision flashcards, daily streaks, chat history, and theme preferences.
- **Embedded SVG Icons**: Crisp, vector icons embedded directly without relying on heavy third-party font libraries or external CDNs.
- **Git & GitHub**: Version control and repository hosting.

---

## 2. Key Features

### A. Dashboard & Real-Time Study Analytics
- **Live Metrics**: Displays total tasks, completed tasks, pending tasks, and overdue items calculated from actual saved records.
- **Dynamic Circular Progress Ring**: SVG-based animated completion ring reflecting actual progress percentages.
- **Subject-Wise Progress**: Automatic categorization of coursework by subject (Computer Science, Biology, Calculus, etc.) with proportional progress meters.
- **Daily Study Streak**: Tracks consecutive daily activity and visualizes study streaks.
- **Recent Activity Feed**: Real-time log of recent accomplishments (tasks finished, quizzes completed, flashcards reviewed).
- **Curated College Study Tips**: Interactive rotational guide covering the Pomodoro Technique, Feynman Technique, Active Recall, and Spaced Repetition.

### B. AI Study Chat
- **Offline Study Assistant**: Transparent rule-based heuristic advisor capable of answering syllabus planning questions, essay structures, revision tactics, and study routines.
- **Zero API Credential Requirement**: Clear banner indicating offline mode status; does not pretend simulated logic is a live generative model.
- **Prepared for Backend AI**: Modular function `dispatchChatRequest` ready to connect to a secure backend endpoint (e.g. `/api/chat`).
- **Chat Usability**: Markdown rendering (bold, code blocks, bullet points), auto-scroll, message timestamps, quick prompt suggestions, and keyboard shortcuts (`Enter` to send, `Shift+Enter` for newline).

### C. Notes Summarizer
- **Transparent Extractive Summarization**: Rule-based algorithm that tokenizes notes, filters stopwords, computes term frequencies (TF), and scores sentence salience based on position, length, and title overlap.
- **Structured Output**: Generates an Executive Overview, Key Concept Bullets with emphasized lead terms, and a High-Salience Keyword cloud.
- **Study Metrics Ribbon**: Computes original word count, summary word count, percentage compression ratio, and estimated reading time saved.
- **Action Tools**: Single-click "Copy Summary" to clipboard and instant "Save to Flashcards" conversion.
- **Pre-loaded College Notes**: Built-in lecture notes on Operating Systems concurrency and deadlocks for rapid testing.

### D. Multiple-Choice Quiz Generator
- **Multi-Subject Question Bank**: Curated college-level questions across Computer Science, Biology & Genetics, Psychology & Cognitive Science, Calculus, and World History.
- **Custom Notes Mode**: Synthesizes cloze-style multiple-choice questions directly from user-provided lecture paragraphs.
- **Difficulty & Count Configuration**: Choose Easy, Medium, or Hard difficulty, and set 3, 5, or 10 questions.
- **Interactive Quiz Navigation**: Question-by-question card interface, progress bar, radio selections, and instant answer review.
- **Grading & Explanations**: Calculates score percentages and letter grades, color-codes correct vs. incorrect answers, and provides full educational explanations for every question.

### E. Study Planner & Task Management
- **Task Management**: Create, edit, toggle completion, and delete coursework tasks.
- **Deadline Monitoring**: Automatically flags tasks as Overdue, Due Today, or Upcoming based on client dates.
- **Multi-Filter & Sort Controls**: Filter by status (*All*, *Pending*, *Completed*, *Overdue*) or by Course/Subject; sort by earliest/latest due date, priority, or title.
- **Live Sync**: Every task change immediately updates the Dashboard analytics and subject breakdown.

### F. Revision Flashcards (Active Recall)
- **3D Card Flip**: Realistic CSS 3D perspective flip on click, `Spacebar`, or `Enter`.
- **Active Recall Mastery**: Mark cards as "Needs Revision" or "Mastered" to track learning retention.
- **Deck Controls**: Previous, Next, Left/Right arrow key shortcuts, and Fisher-Yates deck shuffle.
- **Dual View Modes**: Interactive Card Deck mode and full tabular overview.
- **Starter Deck**: Preloaded with high-yield college definitions across STEM and humanities.

### G. Light and Dark Theme System
- Complete theme toggle with smooth transitions.
- Fully synchronized CSS variables across all components, borders, and modals.
- Respects system `prefers-color-scheme` on first launch and persists user selection in `localStorage`.
- Meets WCAG AA contrast standards in both modes.

### H. Data Management & Portability
- **JSON Export**: Download a full backup file containing all tasks, flashcards, streaks, and preferences.
- **JSON Import**: Upload and restore previous study sessions with data validation.
- **Reset Option**: Safely clear all records back to pristine defaults.

---

## 3. Project Structure

```
AI project/
├── index.html        # Main semantic markup, accessible dialogs, and SVG icons
├── style.css         # Design system tokens, light/dark themes, and responsive layouts
├── script.js         # Core application logic, offline algorithms, and storage handlers
├── README.md         # Comprehensive documentation, setup guide, and architectural notes
└── .gitignore        # Ignores OS metadata, IDE configs, logs, and potential secret files
```

### File Breakdown:
1. `index.html`: Contains the structural skeleton of the dashboard, navigation bar, modal dialogs, and feature sections. Accessible ARIA attributes (`role="tab"`, `aria-modal`, `aria-live`) ensure screen reader compatibility.
2. `style.css`: Implements responsive styles using modern CSS variables. Utilizes CSS Grid for analytics cards and 3D transforms for card flipping. Includes media queries tailored for mobile (<768px), tablet (768px-1024px), and desktop screens.
3. `script.js`: Encapsulates all application state within an IIFE to avoid global namespace pollution. Handles localStorage read/write with `try/catch` safety fallbacks, rule-based text processing, quiz scoring, and DOM event listeners.
4. `README.md`: Explains architecture, local execution, offline boundaries, and security instructions.
5. `.gitignore`: Prevents accidental commits of OS temp files, editor caches, or environment files (`.env`).

---

## 4. Setup and Run Instructions

The application requires no compilers, build pipelines, or npm installations.

### Option A: Direct Browser Launch
1. Locate the project folder in your file explorer.
2. Double-click `index.html` or drag it into any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari).

### Option B: Running with VS Code Live Server (Recommended)
1. Open the project directory in **Visual Studio Code**:
   ```bash
   code .
   ```
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3. Right-click on `index.html` in the file explorer and select **"Open with Live Server"**.
4. The website will automatically launch at `http://127.0.0.1:5500/index.html`.

---

## 5. Offline Capabilities vs. Real AI Integration

### What Works Fully Offline (No Backend Required):
- **All Core Features**: Study Planner, Flashcards, Analytics Dashboard, and Theme Toggle run entirely in the browser using client-side JavaScript.
- **Offline Notes Summarization**: Uses an extractive sentence salience algorithm based on term frequency, sentence position, and keyword density.
- **Offline Quiz Generation**: Uses curated academic question banks and rule-based cloze sentence extractors.
- **Local Study Assistant**: Contains structured heuristic rules to answer questions regarding study routines, the Feynman Technique, Pomodoro intervals, and active recall.

### Limitations of Offline Mode:
- The local assistant relies on rule-based keyword matching; it does not generate freeform creative text like a large language model (LLM).
- Summaries are extractive (selecting the best sentences) rather than abstractive (paraphrasing).

---

## 6. Secure AI Backend Integration Guide

To prevent leaking private API credentials (such as Google Gemini, OpenAI, or Anthropic API keys), **never place API keys in frontend JavaScript or HTML**. 

### Recommended Architecture:
```
[ Browser (StudyMate Frontend) ]
              │
              │  POST /api/chat
              ▼
[ Backend Proxy Server (Node.js / Express or Python / FastAPI) ]
   - Keeps GEMINI_API_KEY / OPENAI_API_KEY in .env
   - Validates student inputs & rate limits requests
              │
              │  Secure HTTPS Request with Bearer Token
              ▼
[ Gemini / OpenAI / Ollama API ]
```

### Steps to Connect a Real Backend:
1. Create a lightweight server using Node.js or Python.
2. Example minimal Node.js/Express server (`server.js`):
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const app = express();
   app.use(cors());
   app.use(express.json());

   // Health check endpoint
   app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

   // Chat endpoint
   app.post('/api/chat', async (req, res) => {
     const { message } = req.body;
     // Call Gemini or OpenAI using process.env.API_KEY
     // const response = await aiClient.generateText(message);
     res.json({ reply: 'AI response from secure backend proxy' });
   });

   app.listen(3000, () => console.log('Proxy running on port 3000'));
   ```
3. Open **Settings & Data** in StudyMate AI.
4. Set the **Backend API Base URL** to `http://localhost:3000/api`.
5. Click **"Test Backend Connection"**. Once verified, StudyMate AI will automatically route chat questions through your backend proxy.

---

## 7. Storage and Security Notes

- **localStorage Scope**: Data is stored per browser profile and origin. Clearing browser cache or switching devices will not automatically sync data unless you use the built-in **Export Data (JSON)** feature.
- **Corrupted Data Resilience**: `script.js` wraps all `JSON.parse` operations in defensive `try/catch` blocks, restoring defaults if storage is corrupted or disabled.
- **Input Sanitization**: All user inputs rendered to the DOM are escaped using `escapeHtml()` to mitigate Cross-Site Scripting (XSS).

---

## 8. Verification & Testing Checklist

The following test suite was verified during development:

| Test Case | Expected Behavior | Status |
| :--- | :--- | :--- |
| **Navigation & Routing** | Clicking sidebar links or quick actions switches active view without page reload. URL hashes update correctly. | PASS |
| **Task Creation & Validation** | Rejects titles < 3 chars; saves valid task to `localStorage`; updates stats immediately. | PASS |
| **Task Completion & Delete** | Checkbox strikes through task and shifts progress ring; deletion prompts confirmation dialog. | PASS |
| **Overdue Task Calculation** | Compares due date against current date; increments overdue counter and flags badge in red. | PASS |
| **Theme Switching** | Switches light/dark mode; saves to `localStorage`; persists upon browser reload. | PASS |
| **Notes Summarization** | Rejects input < 15 words; scores sentences; outputs overview, bullets, keywords, and time saved. | PASS |
| **Copy & Flashcard Conversion** | Copies summary to clipboard with toast notification; opens flashcard modal pre-filled with notes. | PASS |
| **Quiz Practice & Scoring** | Displays MCQs; allows answer selection; grades answers accurately and presents explanations. | PASS |
| **Flashcard 3D Flip** | Flips 180 degrees on card click or spacebar; updates mastery bar when status changes. | PASS |
| **Shuffle & Filter Deck** | Fisher-Yates shuffle reorders cards; subject filters isolate relevant course cards. | PASS |
| **Backend Connection Test** | Gracefully displays offline notice when no server is active; falls back to local heuristic advisor. | PASS |
| **Backup Export & Import** | Generates valid JSON file; importing JSON restores tasks and flashcards seamlessly. | PASS |
| **Responsive Layout** | Mobile hamburger toggles sidebar with overlay; cards stack vertically on screens <768px. | PASS |

---

## 9. License

This project is licensed under the MIT License - open for educational and collegiate use.
