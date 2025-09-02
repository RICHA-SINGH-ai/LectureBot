# LectureBot: AI se chalne wala Lecture Assistant

## 1. Project ka Parichay (Project Overview)

**LectureBot** ek modern, AI-powered web application hai jo college students ko unke lecture schedule aur course ki jaankari aasani se ek chat interface ke zariye deta hai.

Yeh project isliye banaya gaya hai taaki students ko complicated timetable mein lecture details dhoondhne mein time na lage. Ab, bas ek aasan sa sawaal English ya Hindi mein poochne par, students ko turant aur sahi jawab mil jaata hai.

### Mukhya Features (Key Features):

*   **AI Chat:** Apne schedule ke baare mein sawaal English ya Hindi mein poochein.
*   **Bilingual Support:** App ka UI aur AI ke jawab, dono English aur Hindi mein kaam karte hain.
*   **Intelligent Queries:** AI aapke din, professor, ya course code se jude sawaalon ko samajh sakta hai.
*   **Upcoming Lecture Reminder:** Agar aapka koi lecture jald hi shuru hone wala hai, to ek smart notification bar countdown ke saath dikhta hai.
*   **Modern UI:** Ek saaf-suthra aur professional interface jo desktop aur mobile, dono par aache se kaam karta hai.
*   **Unique Design:** App mein ek custom animated gradient border hai jo isse ek alag look deta hai.

---

## 2. Technology Stack

Yeh project ek modern aur mazboot technology stack par bana hai.

*   **Frontend Framework:** **Next.js (React ke saath)** - Fast aur server-rendered application banane ke liye.
*   **AI aur Backend Logic:** **Genkit (Google dwara)** - Conversational AI ke liye, jo user ke sawaalon ko samajhkar schedule data se jawab deta hai.
*   **Styling:** **Tailwind CSS** - Custom UI ko tezi se banane ke liye ek utility-first CSS framework.
*   **UI Components:** **ShadCN UI** - Sundar, accessible, aur reusable UI components ka collection.
*   **Language:** **TypeScript** - Code ko type-safe aur behtar banane ke liye.

---

## 3. Project ka Structure (Architecture & File Structure)

Project ko samajhne mein aasan folders mein organize kiya gaya hai.

```
/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main Page: Yeh app ka entry point aur main UI hai.
│   │   └── actions.ts        # Server Action: Frontend ko AI backend se jodta hai.
│   │
│   ├── ai/
│   │   ├── flows/
│   │   │   └── lecture-data-retrieval.ts # Genkit Flow: AI ka main logic aur instructions (prompt) yahan hai.
│   │   └── genkit.ts         # Genkit Configuration: AI model ko initialize karta hai.
│   │
│   ├── components/
│   │   ├── chat-interface.tsx    # Main chat window ka component.
│   │   ├── notification-reminder.tsx # Agle lecture ke liye smart reminder bar.
│   │   └── schedule-display.tsx  # Schedule cards ko render karne wala component.
│   │
│   └── lib/
│       └── schedule-data.ts    # AI ke liye hardcoded timetable aur course data.
│
└── PROJECT_DOCUMENTATION.md      # Yeh file.
```

### Yeh Kaam Kaise Karta Hai (How It Works):

1.  **User sawaal poochta hai** `ChatInterface` component (`chat-interface.tsx`) mein.
2.  Interface **Server Action** (`actions.ts`) ko user ka sawaal bhejta hai.
3.  Server Action **Genkit AI Flow** (`lecture-data-retrieval.ts`) ko call karta hai.
4.  AI Flow apne **detailed instructions (prompt)** aur `schedule-data.ts` se mile data ka istemal karke sawaal ko samajhta hai aur sahi jaankari dhoondhta hai.
5.  AI ek jawab (text aur/ya schedule data) generate karta hai, jo action ke through UI ko wapas bhej diya jaata hai.
6.  `ChatInterface` user ko AI ka jawab dikhata hai.

---

## 4. Main Features ki Jaankari

### a. Conversational AI (Genkit Flow)

Application ka dimaag Genkit flow hai jo `lecture-data-retrieval.ts` mein hai.

*   **Prompt Engineering:** AI ko saavdhani se likhe gaye instructions (ek "prompt") diye gaye hain. Usse pata hai ki woh ek college assistant hai, aaj kaunsa din hai, aur usse sirf diye gaye JSON data se hi jawab dena hai.
*   **Data-Driven:** AI apne mann se koi jaankari nahi banata. Uske saare jawab `scheduleData` object par adhaarit hote hain, jisse accuracy bani rehti hai.
*   **Context-Aware:** Agar koi sawaal adhoora hai (jaise "MCA-3003 ka lecture"), to AI samajh jaata hai ki yeh dono sections ke liye hai aur aapse section ke baare mein poochega, aur aapke agle jawab ke liye is context ko yaad rakhega.

### b. Upcoming Lecture Reminder

`NotificationReminder` component ek proactive aur madadgaar feature hai.

*   **Page Load Hone Par:** Yeh component current din aur time check karta hai.
*   **Data Filtering:** Yeh poore schedule mein se sirf aaj ke lectures ko filter karta hai.
*   **Agla Lecture Dhoondhna:** Yeh aaj ke lectures ko time ke hisaab se sort karke agla lecture dhoondhta hai jo abhi tak shuru nahi hua hai.
*   **Live Countdown:** Agar koi aane wala lecture milta hai, to yeh bacha hua time calculate karke har minute countdown ko update karta hai.
*   **Interactive Details:** Reminder par tap karne se ek dialog khulta hai jismein us lecture ki poori details hoti hain.

---

## 5. Project Kaise Chalayein (How to Run)

1.  **Dependencies Install Karein:**
    ```bash
    npm install
    ```
2.  **Environment Variables Set Karein:**
    *   Root directory mein `.env.local` naam ki ek file banayein.
    *   Apna Gemini API key daalein: `GEMINI_API_KEY=your_api_key_here`
3.  **Development Server Chalu Karein:**
    ```bash
    npm run dev
    ```
4.  Apne browser mein [http://localhost:3000](http://localhost:3000) kholein.

---

## 6. Future Mein Kya Sudhar Ho Sakte Hain

Is project ko aur bhi behtar banaya ja sakta hai:

*   **User Authentication:** Students login karke apna personal schedule dekh paayein.
*   **Database Integration:** Hardcoded schedule data ko ek real-time database (jaise Firebase Firestore) se replace karna.
*   **Push Notifications:** Lecture shuru hone se 10 minute pehle browser ya mobile par notification bhejna.
*   **Course Directory:** Ek alag page jahan students sabhi courses aur professors ki details dekh sakein.
