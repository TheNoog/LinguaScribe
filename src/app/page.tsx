
// src/app/page.tsx
"use client";

import { useState } from "react";
import StoryForm from "@/components/app/lingua-scribe/story-form";
import StoryDisplay from "@/components/app/lingua-scribe/story-display";
import { generateStoryAction } from "./actions";
import type { GenerateStoryAndImageInput, GenerateStoryAndImageOutput } from "@/lib/schemas/lingua-scribe-schemas"; // Updated import path
import { useToast } from "@/hooks/use-toast";
import { Mic2, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function LinguaScribePage() {
  const [storyResult, setStoryResult] = useState<GenerateStoryAndImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>("Tagalog"); // Default or first language
  const { toast } = useToast();

  const handleGenerateStory = async (data: GenerateStoryAndImageInput) => {
    setIsLoading(true);
    setStoryResult(null); 
    setCurrentLanguage(data.language);
    const result = await generateStoryAction(data);
    setIsLoading(false);

    if ("error" in result) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setStoryResult(result);
      toast({
        title: "Success!",
        description: "Your story and image have been generated.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col items-center py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-primary flex items-center justify-center gap-3">
          <Mic2 className="h-12 w-12" />
          LinguaScribe
        </h1>
        <p className="mt-3 text-lg text-foreground/80 max-w-2xl">
          Unlock new languages with AI-generated stories and captivating visuals.
          Choose your language, level, and topic, and let the adventure begin!
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <StoryForm onGenerate={handleGenerateStory} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 w-full p-6 bg-card rounded-lg shadow-xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-foreground">Generating your masterpiece...</p>
              <div className="grid md:grid-cols-2 gap-6 w-full mt-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-8 w-3/4 mt-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && storyResult && (
          <StoryDisplay storyResult={storyResult} language={currentLanguage} />
        )}

        {!isLoading && !storyResult && (
           <div className="mt-8 w-full p-10 bg-card rounded-lg shadow-xl text-center">
            <Image 
              src="https://placehold.co/300x200.png" 
              alt="Placeholder for story area" 
              width={300} 
              height={200} 
              className="mx-auto rounded-md mb-6"
              data-ai-hint="books language learning"
            />
            <h2 className="text-2xl font-semibold text-primary mb-2">Ready to Explore?</h2>
            <p className="text-foreground/70">
              Fill out the form above to generate your first multilingual story and image.
            </p>
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LinguaScribe. Powered by AI.</p>
      </footer>
    </div>
  );
}
