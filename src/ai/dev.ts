import { config } from 'dotenv';
config({ path: './src/.env.local' });

import '@/ai/flows/lecture-data-retrieval.ts';
