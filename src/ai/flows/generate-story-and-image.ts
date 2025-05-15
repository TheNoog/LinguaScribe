
'use server';

/**
 * @fileOverview Generates a short story in a chosen language and an image to accompany it.
 *
 * - generateStoryAndImage - A function that generates a short story and an image.
 * - GenerateStoryAndImageInput - The input type for the generateStoryAndImage function.
 * - GenerateStoryAndImageOutput - The return type for the generateStoryAndImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  GenerateStoryAndImageInputSchema,
  GenerateStoryAndImageOutputSchema,
} from '@/lib/schemas/lingua-scribe-schemas';

export type { GenerateStoryAndImageInput, GenerateStoryAndImageOutput } from '@/lib/schemas/lingua-scribe-schemas';


export async function generateStoryAndImage(input: import('@/lib/schemas/lingua-scribe-schemas').GenerateStoryAndImageInput): Promise<import('@/lib/schemas/lingua-scribe-schemas').GenerateStoryAndImageOutput> {
  return generateStoryAndImageFlow(input);
}

const storyPrompt = ai.definePrompt({
  name: 'storyPrompt',
  input: {schema: GenerateStoryAndImageInputSchema},
  // Output schema for storyPrompt only includes story and translation, as imageUrl is generated separately.
  output: {schema: z.object({story: z.string(), translation: z.string()})},
  prompt: `You are a language teacher creating content for language learners.

  Create a short story (one paragraph) in {{language}} at level {{level}} about the following topic: {{topic}}.
  Also provide an English translation of the story.
  The output should have the story and translation fields.`,
});

const generateStoryAndImageFlow = ai.defineFlow(
  {
    name: 'generateStoryAndImageFlow',
    inputSchema: GenerateStoryAndImageInputSchema,
    outputSchema: GenerateStoryAndImageOutputSchema,
  },
  async input => {
    const {output: storyOutput} = await storyPrompt(input);
    const imagePrompt = `Generate an image that depicts the following story: ${storyOutput?.story}`
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      story: storyOutput!.story,
      translation: storyOutput!.translation,
      imageUrl: media.url,
    };
  }
);
