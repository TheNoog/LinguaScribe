
// src/app/actions.ts
"use server";

import { generateStoryAndImage } from "@/ai/flows/generate-story-and-image";
import type { GenerateStoryAndImageInput, GenerateStoryAndImageOutput } from "@/lib/schemas/lingua-scribe-schemas";

export async function generateStoryAction(
  data: GenerateStoryAndImageInput
): Promise<GenerateStoryAndImageOutput | { error: string }> {
  try {
    const result = await generateStoryAndImage(data);
    return result;
  } catch (error) {
    console.error("Error generating story:", error);
    return { error: "Failed to generate story. Please try again." };
  }
}
