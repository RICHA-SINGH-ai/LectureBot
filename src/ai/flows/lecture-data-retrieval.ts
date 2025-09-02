
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

  **Crucial Information: Today is ${new Date().toLocaleString('en-US', { weekday: 'long' })}.** When a user asks for "today's schedule", "aaj ka lecture", or any similar phrase, you MUST use this information and not ask them for the day.

  **Timetable and Course Data:**
  \`\`\`json
  ${JSON.stringify(scheduleData, null, 2)}
  \`\`\`

  **Instructions:**
  1.  **Analyze the User's Intent:** Read the user's query: \`{{{query}}}\` and determine if they are asking for a specific lecture schedule OR a general question about courses or professors.
  2.  **For Schedule-Related Queries:**
      *   Examine the timetable data to find matching lectures. The query might mention a professor's name/initials (e.g., "Shashi mam", "MMP"), a course name, a course code, a day, or just ask for "today's lectures".
      *   **Handle Ambiguity and Conversation Context:** If a query is ambiguous (e.g., "MCA-3003 lecture" which is taught to both sections A and B), you MUST ask a clarifying question. Treat subsequent user input as part of an ongoing conversation. You must remember the context from previous turns.
          *   **Example Conversation:**
              *   User: "MCA-3003 lecture"
              *   You: "The lecture for MCA-3003 is held for both Section A and B. Which section's schedule would you like to see?"
              *   User: "Section A"
              *   You: (Now you have the context "MCA-3003" and "Section A". You should look up the schedule for MCA-3003 for Section A and provide it.) "Sure, here is the schedule for MCA-3003 for Section A."
      *   If the user's query provides enough information to find a schedule, populate the \`schedule\` array with all matching lecture details and provide a friendly confirmation in the \`response\` field.
  3.  **For General Study-Related Queries:**
      *   If the user asks a question like "Who teaches Artificial Intelligence?", "What is the name of course MCA-3001?", or "Tell me about the mini-project", use the provided JSON data to answer their question factually.
      *   Formulate a clear, concise answer in the \`response\` field.
      *   For these general questions, the \`schedule\` array should be left empty.
  4.  **Formulate a Final Response:**
      *   If you still need clarification for a schedule query, provide ONLY the clarifying question in the \`response\` field and leave the \`schedule\` array empty.
      *   If you cannot find any relevant information for any type of query, respond politely in the \`response\` field, stating that you couldn't find the information.
  5.  **Strictly Adhere to the Provided Data:** Your primary function is to query the data. Do not make up information. Base all responses strictly on the JSON data provided.
  6.  **Handle Off-Topic Questions:** If the user asks a question that is not related to the provided schedule, courses, or professors, you MUST politely decline to answer. For example, if asked "What is the capital of France?", you should respond with something like, "I can only provide information about the lecture schedule and courses. Is there anything I can help you with regarding that?" Do not answer the off-topic question.
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
