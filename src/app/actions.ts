'use server';

import { getLectureData, LectureQueryInput } from '@/ai/flows/lecture-data-retrieval';

export async function getLectureScheduleAction(input: LectureQueryInput) {
  try {
    const result = await getLectureData(input);
    return { success: true, response: result };
  } catch (error) {
    console.error('Error fetching lecture data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to retrieve lecture schedule: ${errorMessage}` };
  }
}
