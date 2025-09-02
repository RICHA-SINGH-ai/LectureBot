'use server';
/**
 * @fileOverview Fetches and formats lecture data based on student details.
 *
 * - getLectureData - Retrieves and formats lecture information for a student.
 * - LectureDataInput - The input type for getLectureData, containing student details.
 * - LectureDataOutput - The output type, providing a formatted lecture schedule.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LectureDataInputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  id: z.string().describe('The ID of the student.'),
});
export type LectureDataInput = z.infer<typeof LectureDataInputSchema>;

const LectureSchema = z.object({
  title: z.string().describe('The title of the lecture.'),
  location: z.string().describe('The location of the lecture (e.g., room number or building).'),
  professor: z.string().describe("The name of the professor giving the lecture."),
  time: z.string().describe("The time of the lecture (e.g., '10:00 AM - 11:30 AM')."),
});

const LectureDataOutputSchema = z.object({
  studentName: z.string().describe("The student's name for whom the schedule is."),
  schedule: z.array(LectureSchema).describe('A list of current lectures for the student.'),
});
export type LectureDataOutput = z.infer<typeof LectureDataOutputSchema>;

export async function getLectureData(input: LectureDataInput): Promise<LectureDataOutput> {
  return lectureDataFlow(input);
}

const lectureDataPrompt = ai.definePrompt({
  name: 'lectureDataPrompt',
  input: {schema: LectureDataInputSchema},
  output: {schema: LectureDataOutputSchema},
  prompt: `You are a helpful assistant that retrieves lecture schedules for students.

  Based on the student's name and ID, fetch their current lecture schedule. For the purpose of this demo, generate a realistic but fictional schedule if one does not exist. The schedule should contain 2-3 lectures.

  Student Name: {{{name}}}
  Student ID: {{{id}}}

  Return the schedule as a structured JSON object. Include the student's name and a list of their lectures with title, location, professor, and time.`,
});

const lectureDataFlow = ai.defineFlow(
  {
    name: 'lectureDataFlow',
    inputSchema: LectureDataInputSchema,
    outputSchema: LectureDataOutputSchema,
  },
  async input => {
    // For demonstration, we'll generate a sample schedule.
    // In a real application, you would fetch this from a database.
    const {output} = await lectureDataPrompt(input);
    return output!;
  }
);
