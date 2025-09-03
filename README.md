# LectureBot: An AI-Powered Lecture Assistant

This is a modern, AI-powered web application built with Next.js and Genkit. It provides college students with an intuitive chat interface to ask questions about their lecture schedule in either English or Hindi.

## Key Features

*   **Bilingual AI Chat:** Ask questions about your schedule in English or Hindi.
*   **Intelligent Queries:** The AI understands queries related to days, professors, or course codes.
*   **Upcoming Lecture Reminder:** A smart notification bar shows a live countdown to the next lecture.
*   **Modern UI:** A clean and professional interface built with ShadCN UI and Tailwind CSS.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set Environment Variables:**
    *   Create a `.env.local` file in the root directory.
    *   Add your Gemini API key: `GEMINI_API_KEY=your_api_key_here`
3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.


## Project Structure

The project is organized into logical directories to separate concerns.

```
/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main Page: The app's entry point and primary UI.
│   │   └── actions.ts        # Server Action: Connects the frontend client to the AI backend logic.
│   │
│   ├── ai/
│   │   ├── flows/
│   │   │   └── lecture-data-retrieval.ts # Genkit Flow: The "brain" of the AI, containing the prompt and logic.
│   │   └── genkit.ts         # Genkit Configuration: Initializes the Google AI model.
│   │
│   ├── components/
│   │   ├── ui/               # Standard ShadCN UI components (Button, Card, etc.).
│   │   ├── chat-interface.tsx    # The main chat window component, handling messages and user input.
│   │   ├── notification-reminder.tsx # The smart reminder bar for the next upcoming lecture.
│   │   └── schedule-display.tsx  # The component responsible for rendering schedule cards in the chat.
│   │
│   └── lib/
│       └── schedule-data.ts    # Contains the hardcoded timetable and course data used by the AI.
│
├── public/                 # Static assets.
├── .env                    # Environment variables (not committed to git).
├── next.config.ts          # Configuration for the Next.js framework.
├── package.json            # Project dependencies and scripts.
├── tailwind.config.ts      # Configuration for Tailwind CSS.
└── README.md               # This file.
```
