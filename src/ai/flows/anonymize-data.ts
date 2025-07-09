'use server';

/**
 * @fileOverview Implements a data anonymization process to remove names and dates of birth from text.
 *
 * - anonymizeData - Function to anonymize input text.
 * - AnonymizeDataInput - Input type for the anonymizeData function.
 * - AnonymizeDataOutput - Output type for the anonymizeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnonymizeDataInputSchema = z.object({
  text: z.string().describe('The text to anonymize.'),
});
export type AnonymizeDataInput = z.infer<typeof AnonymizeDataInputSchema>;

const AnonymizeDataOutputSchema = z.object({
  anonymizedText: z.string().describe('The anonymized text.'),
});
export type AnonymizeDataOutput = z.infer<typeof AnonymizeDataOutputSchema>;

export async function anonymizeData(input: AnonymizeDataInput): Promise<AnonymizeDataOutput> {
  return anonymizeDataFlow(input);
}

const anonymizeDataPrompt = ai.definePrompt({
  name: 'anonymizeDataPrompt',
  input: {schema: AnonymizeDataInputSchema},
  output: {schema: AnonymizeDataOutputSchema},
  prompt: `You are an expert in data anonymization. Your task is to remove any personally identifiable information (PII) from the given text, specifically names and dates of birth. Replace names with [NAME_REDACTED] and dates of birth with [DOB_REDACTED].

Text to anonymize: {{{text}}}`,
});

const anonymizeDataFlow = ai.defineFlow(
  {
    name: 'anonymizeDataFlow',
    inputSchema: AnonymizeDataInputSchema,
    outputSchema: AnonymizeDataOutputSchema,
  },
  async input => {
    const {output} = await anonymizeDataPrompt(input);
    return output!;
  }
);
