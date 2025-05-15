// src/components/app/lingua-scribe/audio-player.tsx
"use client";

import type { FC } from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Play, Pause, Gauge, VolumeX, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  text: string;
  language: string; // e.g., "Spanish", "French"
}

const languageToCodeMap: Record<string, string> = {
  Tagalog: "tl-PH",
  Spanish: "es-ES",
  French: "fr-FR",
  Russian: "ru-RU",
};

const AudioPlayer: FC<AudioPlayerProps> = ({ text, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSpeechSupported(false);
      toast({
        title: "Audio Playback Not Supported",
        description: "Your browser does not support speech synthesis.",
        variant: "destructive",
      });
      return;
    }

    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    const targetLangCode = languageToCodeMap[language];

    const setVoice = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return; // Voices not loaded yet

      const voiceForLang = voices.find(voice => voice.lang.startsWith(targetLangCode)) || voices.find(voice => voice.lang.startsWith(targetLangCode.split('-')[0]));
      
      if (voiceForLang) {
        u.voice = voiceForLang;
        setSelectedVoice(voiceForLang);
      } else {
         toast({
          title: "Voice Not Found",
          description: `No voice available for ${language}. Using default.`,
          variant: "default",
        });
      }
    };

    // Voices might load asynchronously
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
    
    u.lang = targetLangCode || 'en-US'; // Fallback lang
    u.onend = () => setIsPlaying(false);
    u.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsPlaying(false);
      toast({
        title: "Audio Playback Error",
        description: `Could not play audio for ${language}. ${event.error}`,
        variant: "destructive",
      });
    };
    setUtterance(u);

    return () => {
      synth.cancel();
      synth.onvoiceschanged = null;
    };
  }, [text, language, toast]);

  useEffect(() => {
    if (utterance) {
      utterance.rate = playbackSpeed;
    }
  }, [playbackSpeed, utterance]);

  const handlePlayPause = useCallback(() => {
    if (!isSpeechSupported || !utterance) return;
    const synth = window.speechSynthesis;
    if (isPlaying) {
      synth.pause(); // Or cancel() depending on desired behavior
      setIsPlaying(false);
    } else {
      // Ensure voice is set if it was missed initially
      if (!utterance.voice && selectedVoice) {
        utterance.voice = selectedVoice;
      }
      if (synth.paused) {
        synth.resume();
      } else {
        synth.speak(utterance);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, utterance, isSpeechSupported, selectedVoice]);

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(parseFloat(speed));
  };

  if (!isSpeechSupported) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <VolumeX className="h-5 w-5" />
        <span>Audio playback not supported by your browser.</span>
      </div>
    );
  }
  
  if (!utterance) {
     return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <VolumeX className="h-5 w-5" />
        <span>Audio unavailable for this story.</span>
      </div>
    );
  }


  return (
    <div className="flex items-center space-x-4 mt-2">
      <Button onClick={handlePlayPause} variant="outline" size="icon" aria-label={isPlaying ? "Pause audio" : "Play audio"}>
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      <div className="flex items-center space-x-2">
        <Gauge className="h-5 w-5 text-muted-foreground" />
        <Label htmlFor="speed-select" className="sr-only">Playback Speed</Label>
        <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
          <SelectTrigger id="speed-select" className="w-[80px]">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.25">0.25x</SelectItem>
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="0.75">0.75x</SelectItem>
            <SelectItem value="1.0">1.0x</SelectItem>
          </SelectContent>
        </Select>
      </div>
       { selectedVoice && (
         <div className="text-xs text-muted-foreground hidden md:block">
            Using voice: {selectedVoice.name} ({selectedVoice.lang})
         </div>
        )}
    </div>
  );
};

export default AudioPlayer;
