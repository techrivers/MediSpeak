
'use server';

/**
 * @fileOverview Implements real-time, bidirectional translation.
 *
 * - translateText - A function that translates text between a source language and a target language.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The ISO 639-1 code of the text to translate, or "auto" to auto-detect.'),
  targetLanguage: z.string().describe('The ISO 639-1 code of the language to translate the text into.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
  detectedLanguage: z.string().describe('The ISO 639-1 code of the detected source language if "auto" was specified for sourceLanguage, otherwise it may reflect the provided source language or a more specific dialect.'),
  translationAccuracyScore: z.number().describe('A score indicating the translation accuracy (0-1).'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `You are a translation expert. Translate the given text from the source language to the specified target language.
If the source language is "auto", detect the language first.

Text: {{{text}}}
Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}

Output the translated text, the detected source language (if 'auto' was used, otherwise this may be the provided source language), and a translation accuracy score between 0 and 1.

Follow this JSON schema: { "translatedText": "translated text", "detectedLanguage": "detected language code", "translationAccuracyScore": 0.95 }`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await translatePrompt(input);
    return output!;
  }
);
