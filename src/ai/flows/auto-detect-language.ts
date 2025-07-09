'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically detecting the language of a given text.
 *
 * It exports:
 * - `autoDetectLanguage`: An async function that takes text as input and returns the detected language.
 * - `AutoDetectLanguageInput`: The input type for the `autoDetectLanguage` function.
 * - `AutoDetectLanguageOutput`: The output type for the `autoDetectLanguage` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoDetectLanguageInputSchema = z.object({
  text: z.string().describe('The text to detect the language of.'),
});
export type AutoDetectLanguageInput = z.infer<typeof AutoDetectLanguageInputSchema>;

const AutoDetectLanguageOutputSchema = z.object({
  languageCode: z.string().describe('The ISO 639-1 code of the detected language.'),
  languageName: z.string().describe('The name of the detected language.'),
});
export type AutoDetectLanguageOutput = z.infer<typeof AutoDetectLanguageOutputSchema>;

export async function autoDetectLanguage(input: AutoDetectLanguageInput): Promise<AutoDetectLanguageOutput> {
  return autoDetectLanguageFlow(input);
}

const detectLanguagePrompt = ai.definePrompt({
  name: 'detectLanguagePrompt',
  input: {schema: AutoDetectLanguageInputSchema},
  output: {schema: AutoDetectLanguageOutputSchema},
  prompt: `Determine the language of the following text and respond with the language code and language name.

Text: {{{text}}}

Respond in the following format:
{
  "languageCode": "<language code>",
    "languageName": "<language name>"
}
`,
});

const autoDetectLanguageFlow = ai.defineFlow(
  {
    name: 'autoDetectLanguageFlow',
    inputSchema: AutoDetectLanguageInputSchema,
    outputSchema: AutoDetectLanguageOutputSchema,
  },
  async input => {
    const {output} = await detectLanguagePrompt(input);
    return output!;
  }
);
