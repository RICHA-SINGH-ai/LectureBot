'use server';

import { getLectureData, LectureDataInput } from '@/ai/flows/lecture-data-retrieval';
import { z } from 'zod';

const LectureDataInputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  id: z.string().describe('The ID of the student.'),
});

export async function getLectureScheduleAction(input: LectureDataInput) {
  try {
    const validatedInput = LectureDataInputSchema.parse(input);
    const result = await getLectureData(validatedInput);
    if (!result.schedule) {
       return { success: false, error: 'The schedule is currently empty.' };
    }
    return { success: true, schedule: result.schedule };
  } catch (error) {
    console.error('Error fetching lecture data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to retrieve lecture schedule: ${errorMessage}` };
  }
}
