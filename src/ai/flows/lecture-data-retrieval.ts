'use server';
/**
 * @fileOverview An AI agent that can query a student's lecture schedule based on the real timetable.
 *
 * - getLectureData - A function that handles the lecture schedule retrieval process.
 * - LectureQueryInput - The input type for the getLectureData function.
 * - LectureQueryOutput - The return type for the getLectureData function.
 */

import { scheduleData } from '@/lib/schedule-data';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LectureQueryInputSchema = z.object({
  query: z.string().describe('The user query in English or Hindi about their lecture schedule. This could be a new question or a response to a clarifying question from the assistant.'),
});
export type LectureQueryInput = z.infer<typeof LectureQueryInputSchema>;

const LectureSchema = z.object({
  title: z.string().describe('The title of the lecture.'),
  section: z.string().describe('The section for the lecture (A or B).'),
  roomNo: z.string().describe('The room number for the lecture.'),
  professor: z.string().describe("The name of the professor giving the lecture."),
  time: z.string().describe("The time of the lecture (e.g., '10:00 AM - 11:30 AM')."),
  day: z.string().describe("The day of the week for the lecture."),
});

const LectureQueryOutputSchema = z.object({
  response: z.string().describe('A conversational response to the user. It could be the answer, a clarifying question if the query is ambiguous (e.g., asking for section A or B), or a statement that the requested information could not be found.'),
  schedule: z.array(LectureSchema).optional().describe('A list of lectures matching the query. This should only be populated if the query was specific enough to yield a result.'),
});
export type LectureQueryOutput = z.infer<typeof LectureQueryOutputSchema>;

export async function getLectureData(input: LectureQueryInput): Promise<LectureQueryOutput> {
  return lectureDataFlow(input);
}

const lectureDataPrompt = ai.definePrompt({
  name: 'lectureDataPrompt',
  input: { schema: LectureQueryInputSchema },
  output: { schema: LectureQueryOutputSchema },
  prompt: `You are a helpful college assistant chatbot. Your task is to answer student queries about their lecture schedule based on a provided JSON dataset. You must handle queries in both English and Hindi.

  **Crucial Information: Today is ${new Date().toLocaleString('en-US', { weekday: 'long' })}.** When a user asks for "today's schedule", "aaj ka lecture", or any similar phrase, you MUST use this information and not ask them for the day.

  **Timetable Data:**
  \`\`\`json
  ${JSON.stringify(scheduleData, null, 2)}
  \`\`\`

  **Instructions:**
  1.  Analyze the user's query: \`{{{query}}}\`. **This query might be a direct question (e.g., "what are my lectures today?") or a response to YOUR previous clarifying question (e.g., "Section A"). You must treat it as part of an ongoing conversation.**
  2.  Examine the timetable data to find matching lectures. The query might mention a professor's name/initials (e.g., "Shashi mam", "MMP"), a course name, a course code, a day, or just ask for "today's lectures".
  3.  **Handle Ambiguity and Conversation Context:** If a query is ambiguous (e.g., "MCA-3003 lecture" which is taught to both sections A and B), you MUST ask a clarifying question.
      *   **Example Conversation:**
          *   User: "MCA-3003 lecture"
          *   You: "The lecture for MCA-3003 is held for both Section A and B. Which section's schedule would you like to see?"
          *   User: "Section A"
          *   You: (Now you have the context "MCA-3003" and "Section A". You should look up the schedule for MCA-3003 for Section A and provide it.) "Sure, here is the schedule for MCA-3003 for Section A."
  4.  **Formulate a Response:**
      *   If the user's query provides enough information (either initially or as a follow-up) to find a specific schedule, populate the \`schedule\` array with all matching lecture details and provide a friendly confirmation in the \`response\` field. For example: "Sure, here is the schedule for Section A for MCA-3003."
      *   If you still need clarification, provide ONLY the clarifying question in the \`response\` field and leave the \`schedule\` array empty.
      *   If you cannot find any relevant lectures, respond politely in the \`response\` field, stating that you couldn't find the information. For example: "I couldn't find any lectures matching your request."
  5.  Your primary function is to query the data. Do not make up information. Base all schedule responses strictly on the JSON data provided.
  `,
});


const lectureDataFlow = ai.defineFlow(
  {
    name: 'lectureDataFlow',
    inputSchema: LectureQueryInputSchema,
    outputSchema: LectureQueryOutputSchema,
  },
  async (input) => {
    // Forcing Gemini 2.5 Flash as it seems to follow instructions better for this task.
    const { output } = await lectureDataPrompt(input, { model: 'googleai/gemini-2.5-flash' });
    return output!;
  }
);
