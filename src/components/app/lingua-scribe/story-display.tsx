
// src/components/app/lingua-scribe/story-display.tsx
"use client";

import type { FC } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AudioPlayer from "./audio-player";
import { BookText, Languages } from "lucide-react";
import type { GenerateStoryAndImageOutput } from "@/lib/schemas/lingua-scribe-schemas"; // Updated import path

interface StoryDisplayProps {
  storyResult: GenerateStoryAndImageOutput;
  language: string; // The selected language name e.g. "Spanish"
}

const StoryDisplay: FC<StoryDisplayProps> = ({ storyResult, language }) => {
  const { story, translation, imageUrl } = storyResult;

  return (
    <Card className="mt-8 w-full shadow-xl">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md">
            <Image
              src={imageUrl || "https://placehold.co/600x400.png"}
              alt="Generated story illustration"
              layout="fill"
              objectFit="cover"
              data-ai-hint="story illustration"
              unoptimized={imageUrl?.startsWith('data:image')} // Required for base64 images
            />
          </div>
          <div className="space-y-6">
            <div>
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookText className="h-6 w-6 text-primary" />
                  Story ({language})
                </CardTitle>
              </CardHeader>
              <p className="text-foreground/90 leading-relaxed">{story}</p>
              <AudioPlayer text={story} language={language} />
            </div>
            <Separator />
            <div>
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Languages className="h-6 w-6 text-accent" />
                  English Translation
                </CardTitle>
              </CardHeader>
              <p className="text-foreground/90 leading-relaxed">{translation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryDisplay;
