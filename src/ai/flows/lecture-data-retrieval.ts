
'use server';
/**
 * @fileOverview An AI agent that can query a student's lecture schedule based on the real timetable.
 *
 * - getLectureData - A function that handles the lecture schedule retrieval process.
 * - LectureQueryInput - The input type for the getLectureData function.
 * - LectureQueryOutput - The return type for the getLectureData function.
 */

// Yeh file Genkit AI aur schedule data ka istemal karke student ke lecture-related sawalon ka jawab deti hai.

import { scheduleData } from '@/lib/schedule-data';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Yeh define karta hai ki user se input mein kya-kya aayega.
const LectureQueryInputSchema = z.object({
  query: z.string().describe('The user query in English or Hindi about their lecture schedule. This could be a new question or a response to a clarifying question from the assistant.'),
  language: z.enum(['en', 'hi']).default('en').describe('The language for the response.'),
  currentDay: z.string().describe("The current day of the week as determined by the client's browser to avoid timezone issues."),
});
export type LectureQueryInput = z.infer<typeof LectureQueryInputSchema>;

// Yeh lecture ka structure define karta hai. Har lecture mein yeh details hongi.
const LectureSchema = z.object({
  title: z.string().describe('The title of the lecture.'),
  section: z.string().describe('The section for the lecture (A or B).'),
  roomNo: z.string().describe('The room number for the lecture.'),
  professor: z.string().describe("The name of the professor giving the lecture."),
  time: z.string().describe("The time of the lecture (e.g., '10:00 AM - 11:30 AM')."),
  day: z.string().describe("The day of the week for the lecture."),
});

// Yeh define karta hai ki AI se output mein kya-kya aayega.
const LectureQueryOutputSchema = z.object({
  response: z.string().describe('A conversational response to the user. It could be the answer, a clarifying question if the query is ambiguous (e.g., asking for section A or B), or a statement that the requested information could not be found.'),
  schedule: z.array(LectureSchema).optional().describe('A list of lectures matching the query. This should only be populated if the query was specific enough to yield a schedule result.'),
});
export type LectureQueryOutput = z.infer<typeof LectureQueryOutputSchema>;

// Yeh main function hai jise frontend call karega.
export async function getLectureData(input: LectureQueryInput): Promise<LectureQueryOutput> {
  return lectureDataFlow(input);
}

// Yahan hum AI (Gemini) ke liye prompt (instructions) define kar rahe hain.
const lectureDataPrompt = ai.definePrompt({
  name: 'lectureDataPrompt',
  input: { schema: LectureQueryInputSchema },
  output: { schema: LectureQueryOutputSchema },
  prompt: `You are a helpful college assistant chatbot. Your primary role is to answer student queries about their lecture schedule, courses, and professors based on the provided JSON dataset. You must maintain conversation history to handle follow-up questions.
  
  **IMPORTANT: You MUST respond in the language specified by the 'language' field: {{{language}}}. 'en' for English, 'hi' for Hindi.**

  **Crucial Information: Today is {{{currentDay}}}.** When a user asks for "today's schedule", "aaj ka lecture", or any similar phrase, you MUST use this information and not ask them for the day.

  **Timetable and Course Data:**
  \`\`\`json
  ${JSON.stringify(scheduleData, null, 2)}
  \`\`\`

  **Instructions:**
  1.  **Analyze the User's Intent:** Read the user's query: \`{{{query}}}\` and determine if they are asking for a specific lecture schedule OR a general question about courses or professors.
  2.  **For Schedule-Related Queries:**
      *   Examine the timetable data to find matching lectures. The query might mention a professor, course name/code, day, or just ask for "today's lectures".
      *   **Handle Ambiguity and Context with HIGH PRIORITY:**
          *   **Check for Section First:** Before asking for clarification, ALWAYS check if the user's query ALREADY contains "section A" or "section B". If it does, you MUST NOT ask for the section again. Use the provided section to filter the schedule.
          *   **Broad Queries with Section:** If a query is broad but provides a section (e.g., "today's schedule for section B"), provide the FULL schedule for that section for the specified day (or today if no day is mentioned). Do not ask for a subject.
          *   **Ambiguous Subject:** If a subject is ambiguous (e.g., "MCA-3003 lecture," which applies to both sections) AND the user has NOT specified a section, ONLY then should you ask a clarifying question.
          *   **Example Conversation (Correct):**
              *   User: "What's the schedule for section B today?"
              *   You: (You see "section B". You find all lectures for today for section B and provide them.) "Of course, here is the schedule for Section B for today."
          *   **Example Conversation (Follow-up):**
              *   User: "MCA-3003 lecture"
              *   You: "The lecture for MCA-3003 is for both Section A and B. Which section's schedule would you like?"
              *   User: "section A"
              *   You: (Now you have the context. You look up MCA-3003 for Section A.) "Here is the schedule for MCA-3003 for Section A."
      *   If the user's query is specific enough, populate the \`schedule\` array with all matching lectures and provide a friendly confirmation in the \`response\` field.
  3.  **For General Study-Related Queries:**
      *   If the user asks a question like "Who teaches Artificial Intelligence?", use the provided JSON data to answer.
      *   Formulate a clear answer in the \`response\` field and leave the \`schedule\` array empty.
  4.  **Formulate a Final Response:**
      *   If you still need clarification (and only if necessary), provide ONLY the clarifying question in the \`response\` field and leave the \`schedule\` array empty.
      *   If you cannot find any relevant information, respond politely that you couldn't find the information.
  5.  **Strictly Adhere to the Provided Data:** Base all responses strictly on the JSON data provided. Do not make up information.
  6.  **Handle Off-Topic Questions:** If the user asks something not related to the schedule, politely decline to answer.
  `,
});


// Yeh Genkit flow define karta hai, jo prompt ko run karega.
const lectureDataFlow = ai.defineFlow(
  {
    name: 'lectureDataFlow',
    inputSchema: LectureQueryInputSchema,
    outputSchema: LectureQueryOutputSchema,
  },
  async (input) => {
    // Hum yahan Gemini 2.5 Flash model ka istemal kar rahe hain, kyunki yeh instructions aache se follow karta hai.
    const { output } = await lectureDataPrompt(input, { model: 'googleai/gemini-2.5-flash' });
    return output!;
  }
);
