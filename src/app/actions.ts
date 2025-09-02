
'use server';

// Yeh file ek "server action" hai. Yeh server par chalti hai aur client-side (browser) se call ki ja sakti hai.
// Iska kaam AI flow ko call karna aur result client ko wapas bhejna hai.

import { getLectureData, LectureQueryInput } from '@/ai/flows/lecture-data-retrieval';

// Yeh function client-side se call hoga jab user message bhejega.
export async function getLectureScheduleAction(input: LectureQueryInput) {
  try {
    // Hum yahan AI flow (getLectureData) ko user ke input ke saath call kar rahe hain.
    const result = await getLectureData(input);
    // Agar successful raha, toh result wapas bhejenge.
    return { success: true, response: result };
  } catch (error) {
    // Agar koi error aata hai, toh use console mein log karenge aur client ko error message bhejenge.
    console.error('Error fetching lecture data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to retrieve lecture schedule: ${errorMessage}` };
  }
}
