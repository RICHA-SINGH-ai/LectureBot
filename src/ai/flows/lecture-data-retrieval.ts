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
  className: z.string().describe('The class name (e.g., MCA, MCA001).'),
  name: z.string().describe('The name of the student.'),
});
export type LectureDataInput = z.infer<typeof LectureDataInputSchema>;

const LectureSchema = z.object({
  title: z.string().describe('The title of the lecture.'),
  floor: z.string().describe('The floor where the lecture is held.'),
  roomNo: z.string().describe('The room number for the lecture.'),
  professor: z.string().describe("The name of the professor giving the lecture."),
  time: z.string().describe("The time of the lecture (e.g., '10:00 AM - 11:30 AM')."),
  status: z.string().describe("The status of the lecture (e.g., 'On Time', 'Delayed', 'Starts in 5 mins')."),
});

const LectureDataOutputSchema = z.object({
  studentName: z.string().describe("The student's name for whom the schedule is."),
  className: z.string().describe('The class name for the schedule.'),
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

  Based on the student's name and class name, fetch their current lecture schedule. For the purpose of this demo, generate a realistic but fictional schedule if one does not exist. The schedule should contain 2-3 lectures.

  Student Name: {{{name}}}
  Class Name: {{{className}}}

  Return the schedule as a structured JSON object. Include the student's name, class name, and a list of their lectures with title, floor, roomNo, professor, time, and a status (e.g., 'On Time', 'Delayed', 'Starts in 5 mins').`,
});

const lectureDataFlow = ai.defineFlow(
  {
    name: 'lectureDataFlow',
    inputSchema: LectureDataInputSchema,
    outputSchema: LectureDataOutputSchema,
  },
  async input => {
    const {output} = await lectureDataPrompt(input);
    return output!;
  }
);
