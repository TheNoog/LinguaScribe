
// src/components/app/lingua-scribe/story-form.tsx
"use client";

import type { FC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, Globe, BarChart3, BookOpenText, PlusCircle } from "lucide-react";
import { GenerateStoryAndImageInputSchema, type GenerateStoryAndImageInput } from "@/lib/schemas/lingua-scribe-schemas";

const LANGUAGES = GenerateStoryAndImageInputSchema.shape.language.options;
const LEVELS = GenerateStoryAndImageInputSchema.shape.level.options;
const TOPICS = ["Daily Life", "Travel Adventures", "Food and Cooking", "Hobbies and Interests", "Fantasy World", "Custom Topic"];

const formSchema = z.object({
  language: GenerateStoryAndImageInputSchema.shape.language,
  level: GenerateStoryAndImageInputSchema.shape.level,
  topicPreset: z.enum(TOPICS as [string, ...string[]]),
  customTopic: z.string().optional(),
}).refine(data => {
  if (data.topicPreset === "Custom Topic") {
    return data.customTopic && data.customTopic.trim() !== "";
  }
  return true;
}, {
  message: "Please enter your custom topic.",
  path: ["customTopic"],
});

type FormValues = z.infer<typeof formSchema>;

interface StoryFormProps {
  onGenerate: (data: GenerateStoryAndImageInput) => Promise<void>;
  isLoading: boolean;
}

const StoryForm: FC<StoryFormProps> = ({ onGenerate, isLoading }) => {
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: LANGUAGES[0],
      level: LEVELS[0],
      topicPreset: TOPICS[0],
      customTopic: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const topic = values.topicPreset === "Custom Topic" ? values.customTopic! : values.topicPreset;
    onGenerate({
      language: values.language,
      level: values.level,
      topic: topic,
    });
  };

  const handleTopicPresetChange = (value: string) => {
    form.setValue("topicPreset", value as FormValues["topicPreset"]);
    setShowCustomTopicInput(value === "Custom Topic");
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Story</CardTitle>
        <CardDescription>Select your preferences and let LinguaScribe craft a unique story with an image for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Language Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVELS.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="topicPreset"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2"><BookOpenText className="h-5 w-5 text-primary" /> Story Topic</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={handleTopicPresetChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:flex-wrap md:space-y-0 md:space-x-4"
                    >
                      {TOPICS.map(topic => (
                        <FormItem key={topic} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={topic} />
                          </FormControl>
                          <FormLabel className="font-normal">{topic}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showCustomTopicInput && (
              <FormField
                control={form.control}
                name="customTopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><PlusCircle className="h-5 w-5 text-primary" /> Custom Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., A brave knight and a friendly dragon" {...field} />
                    </FormControl>
                    <FormDescription>Enter a few words to describe your custom story topic.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto text-lg py-6 px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Story
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StoryForm;
