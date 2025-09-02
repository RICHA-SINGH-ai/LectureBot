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

const LectureDataOutputSchema = z.object({
  schedule: z.string().describe('A formatted schedule of current lectures.'),
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

  Based on the student's name and ID, fetch their current lecture schedule.

  Student Name: {{{name}}}
  Student ID: {{{id}}}

  Format the schedule to be easily readable in a chat interface, including the lecture title, location, and professor.
  Make it concise and easy to understand.`,
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
