
# LectureBot: AI-Powered Lecture Assistant

## 1. Project Overview

**LectureBot** is a modern, AI-powered web application designed to help college students quickly access their lecture schedules and course information through a conversational chat interface.

This project was built to solve a common student problem: finding specific lecture details quickly without having to manually scan a complicated timetable. By simply asking a question in natural language (English or Hindi), students can get instant, accurate answers.

### Key Features:

*   **Conversational AI Chat:** Ask questions about your schedule in plain English or Hindi.
*   **Bilingual Support:** Seamlessly switch between English and Hindi for both the UI and AI responses.
*   **Intelligent Schedule Queries:** The AI can understand queries about specific days, professors, course codes, or even just "today's schedule."
*   **Upcoming Lecture Reminder:** A smart notification bar automatically appears if you have a lecture coming up soon, showing a countdown and details.
*   **Responsive & Modern UI:** A clean, professional interface built with modern tools that works perfectly on both desktop and mobile devices.
*   **Unique Visual Identity:** Features a custom animated gradient border to make the project stand out.

---

## 2. Technology Stack

This project is built on a modern, robust, and scalable technology stack.

*   **Frontend Framework:** **Next.js (with React)** - For building a fast, server-rendered application.
*   **AI & Backend Logic:** **Genkit (by Google)** - Powers the conversational AI, interpreting user queries and generating intelligent responses based on schedule data.
*   **Styling:** **Tailwind CSS** - A utility-first CSS framework for rapid and custom UI development.
*   **UI Components:** **ShadCN UI** - A collection of beautifully designed, accessible, and reusable components.
*   **Language:** **TypeScript** - For type safety and improved code quality.

---

## 3. Project Architecture & File Structure

The project is organized into logical folders, making it easy to understand and maintain.

```
/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page: The entry point and main UI layout.
│   │   └── actions.ts        # Server Action: Connects the frontend to the AI backend.
│   │
│   ├── ai/
│   │   ├── flows/
│   │   │   └── lecture-data-retrieval.ts # Genkit Flow: Contains the core AI logic and prompt.
│   │   └── genkit.ts         # Genkit Configuration: Initializes the AI model.
│   │
│   ├── components/
│   │   ├── chat-interface.tsx    # The main chat window component.
│   │   ├── notification-reminder.tsx # The smart reminder bar for the next lecture.
│   │   └── schedule-display.tsx  # The component that renders the schedule cards.
│   │
│   └── lib/
│       └── schedule-data.ts    # The hardcoded timetable and course data for the AI.
│
└── PROJECT_DOCUMENTATION.md      # This file.
```

### How It Works:

1.  **User asks a question** in the `ChatInterface` component (`chat-interface.tsx`).
2.  The interface calls the **Server Action** (`actions.ts`) with the user's query.
3.  The Server Action invokes the **Genkit AI Flow** (`lecture-data-retrieval.ts`).
4.  The AI Flow uses a **detailed prompt** and the data from `schedule-data.ts` to understand the query and find the correct information.
5.  The AI generates a response (text and/or schedule data), which is sent back through the action to the UI.
6.  The `ChatInterface` displays the AI's answer to the user.

---

## 4. Key Features Explained

### a. The Conversational AI (Genkit Flow)

The brain of the application is the Genkit flow in `lecture-data-retrieval.ts`.

*   **Prompt Engineering:** The AI is given a carefully crafted set of instructions (a "prompt") that tells it how to behave. It knows it's a college assistant, it knows the current day, and it knows to use the provided JSON data as its single source of truth.
*   **Data-Driven:** The AI doesn't hallucinate or make up information. It bases all its answers strictly on the `scheduleData` object, ensuring accuracy.
*   **Context-Aware:** The AI is designed to handle ambiguity. If a user asks for "MCA-3003 lecture," the AI knows this class is for both sections A and B and will ask for clarification, remembering the context for the next response.

### b. Upcoming Lecture Reminder

The `NotificationReminder` component provides a proactive, helpful user experience.

*   **On Page Load:** It checks the current day and time.
*   **Data Filtering:** It filters the entire schedule from `schedule-data.ts` to find only today's lectures.
*   **Finds Next Lecture:** It sorts today's lectures by time and finds the very next one that hasn't started yet.
*   **Live Countdown:** If an upcoming lecture is found, it calculates the remaining time and updates the countdown every minute.
*   **Interactive Details:** Tapping the reminder opens a dialog with full details for that lecture, so the user doesn't have to ask the bot.

---

## 5. How to Run the Project

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set Up Environment Variables:**
    *   Create a file named `.env.local` in the root directory.
    *   Add your Gemini API key: `GEMINI_API_KEY=your_api_key_here`
3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Potential Future Improvements

This project has a strong foundation that can be expanded upon with new features:

*   **User Authentication:** Allow students to log in to see a personalized schedule.
*   **Database Integration:** Replace the hardcoded schedule data with a dynamic database (like Firebase Firestore) to allow for real-time updates.
*   **Push Notifications:** Send browser or mobile push notifications 10 minutes before a lecture starts.
*   **Professor/Course Directory:** Add a separate page where students can browse all available courses and professor details.

