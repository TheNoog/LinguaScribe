
import { z } from 'genkit';

export const GenerateStoryAndImageInputSchema = z.object({
  language: z.enum(['Tagalog', 'Spanish', 'French', 'Russian']).describe('The target language for the story.'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).describe('The language level of the story.'),
  topic: z.string().describe('The topic of the short story.'),
});
export type GenerateStoryAndImageInput = z.infer<typeof GenerateStoryAndImageInputSchema>;

export const GenerateStoryAndImageOutputSchema = z.object({
  story: z.string().describe('The generated story in the chosen language.'),
  translation: z.string().describe('The English translation of the story.'),
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateStoryAndImageOutput = z.infer<typeof GenerateStoryAndImageOutputSchema>;
