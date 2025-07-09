
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Mic, Settings, FileText, AlertTriangle, RotateCcw, Trash2, SquareTerminal, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageSelector } from '@/components/conversation/LanguageSelector';
import { TranscriptItem, type TranscriptMessage } from '@/components/conversation/TranscriptItem';
import { useToast } from "@/hooks/use-toast";
import { useConsultationTimer } from '@/hooks/useConsultationTimer';
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { speakText } from '@/lib/tts';

import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { anonymizeData } from '@/ai/flows/anonymize-data';
import { translateText } from '@/ai/flows/real-time-translation';


export default function ConversationPage() {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [patientResponseInput, setPatientResponseInput] = useState('');
  const [patientLanguage, setPatientLanguage] = useState('bn'); 
  const [isAnonymizationEnabled, setIsAnonymizationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isListeningPatient, setIsListeningPatient] = useState(false);
  const [isListeningDoctor, setIsListeningDoctor] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const { toast } = useToast();
  const { startTimer, stopTimer, resetTimer: resetConsultationTimer, isRunning: isTimerRunning, elapsedTimeInSeconds, formattedTime } = useConsultationTimer();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [transcript]);

  useEffect(() => {
    if (typeof navigator.permissions?.query === 'function') {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((status) => {
        setMicrophonePermission(status.state);
        status.onchange = () => {
          setMicrophonePermission(status.state);
        };
      }).catch(err => {
        console.error("Error querying microphone permission:", err);
        setMicrophonePermission('prompt'); 
      });
    } else {
      setMicrophonePermission('prompt');
      toast({
        title: "Permissions API not supported",
        description: "Microphone access will be requested when you start recording.",
        variant: "default"
      });
    }
  }, [toast]);
  
  const addMessageToTranscript = (message: Omit<TranscriptMessage, 'id' | 'timestamp'>) => {
    setTranscript(prev => [...prev, { ...message, id: Date.now().toString(), timestamp: new Date() }]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    if (!isTimerRunning) {
      const wasNewConsultation = elapsedTimeInSeconds === 0;
      startTimer();
      toast({
        title: wasNewConsultation ? "Consultation Started" : "Consultation Resumed",
        description: "Timer is now running."
      });
    }

    setIsLoading(true);
    const doctorMessageContent = userInput;
    setUserInput('');

    addMessageToTranscript({
      source: 'doctor',
      originalText: doctorMessageContent,
      originalLanguage: 'en',
      isEditable: true,
    });

    try {
      let textToTranslate = doctorMessageContent;
      if (isAnonymizationEnabled) {
        const anonymizationResult = await anonymizeData({ text: doctorMessageContent });
        textToTranslate = anonymizationResult.anonymizedText;
        addMessageToTranscript({
          source: 'system',
          originalText: `Anonymized doctor's input: ${textToTranslate}`,
          originalLanguage: 'en',
        });
      }

      const translationResult = await translateText({
        text: textToTranslate,
        sourceLanguage: 'en', 
        targetLanguage: patientLanguage,
      });
      
      addMessageToTranscript({
        source: 'system',
        originalText: `Doctor's message translated to ${getLanguageName(patientLanguage)}: ${translationResult.translatedText}`, 
        translatedText: translationResult.translatedText, 
        targetLanguage: patientLanguage,
        translationAccuracy: translationResult.translationAccuracyScore,
      });

      if (translationResult.translatedText && patientLanguage) {
        speakText(translationResult.translatedText, patientLanguage)
          .catch(err => {
            console.error("Error auto-playing doctor's translation:", err.message);
          });
      }

    } catch (error) {
      console.error("Error processing message:", error);
      toast({ title: "Error", description: "Failed to process message.", variant: "destructive" });
      addMessageToTranscript({
        source: 'system',
        originalText: "Error: Could not translate message.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePatientResponse = async (patientText: string) => {
    if (!patientText.trim()) return;

    if (!isTimerRunning) {
      const wasNewConsultation = elapsedTimeInSeconds === 0;
      startTimer();
      toast({
        title: wasNewConsultation ? "Consultation Started" : "Consultation Resumed",
        description: "Timer is now running."
      });
    }

    setIsLoading(true);

    addMessageToTranscript({
        source: 'patient',
        originalText: patientText,
        originalLanguage: patientLanguage, 
        isEditable: true,
    });
    
    try {
        let textToTranslate = patientText;

        if (isAnonymizationEnabled) {
            const anonymizationResult = await anonymizeData({ text: patientText });
            textToTranslate = anonymizationResult.anonymizedText;
            addMessageToTranscript({
                source: 'system',
                originalText: `Anonymized patient's input (from ${getLanguageName(patientLanguage)}): ${textToTranslate}`,
                originalLanguage: patientLanguage,
            });
        }

        const translationResult = await translateText({
          text: textToTranslate,
          sourceLanguage: patientLanguage, 
          targetLanguage: 'en', 
        });

        addMessageToTranscript({
            source: 'system',
            originalText: `Patient's message translated to English: ${translationResult.translatedText}`,
            translatedText: translationResult.translatedText, 
            targetLanguage: 'en',
            translationAccuracy: translationResult.translationAccuracyScore,
        });

        if (translationResult.translatedText) {
          speakText(translationResult.translatedText, 'en')
            .catch(err => {
              console.error("Error auto-playing patient's translation:", err.message);
            });
        }

    } catch (error) {
        console.error("Error processing patient response:", error);
        toast({ title: "Error", description: "Failed to process patient response.", variant: "destructive" });
        addMessageToTranscript({
          source: 'system',
          originalText: "Error: Could not translate patient response.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditTranscript = (messageId: string, newText: string) => {
    setTranscript(prev => prev.map(msg => msg.id === messageId ? { ...msg, originalText: newText, anonymizedText: undefined, translatedText: undefined } : msg));
    toast({ title: "Transcript Edited", description: "Note: Editing clears previous anonymization and translation for this message. Please re-process if needed." });
  };

  const startSpeechRecognition = useCallback(async (
    languageCode: string, 
    onResultCallback: (text: string) => void,
    setIsListeningCallback: (isListening: boolean) => void
    ) => {
    if (microphonePermission === 'denied') {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use speech recognition. You may need to refresh the page after granting permission.",
        variant: "destructive",
        duration: 10000,
      });
      return;
    }

    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      toast({ title: "Speech Recognition Not Supported", description: "Your browser does not support speech recognition.", variant: "destructive" });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = languageCode; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListeningCallback(true);
    recognition.onend = () => setIsListeningCallback(false);
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListeningCallback(false);
      let title = "Speech Recognition Error";
      let description = "An unexpected error occurred during speech recognition.";
      let duration = 5000;

      switch (event.error) {
        case 'no-speech':
          title = "No Speech Detected";
          description = "No speech was detected. Please ensure your microphone is working and try speaking again.";
          break;
        case 'audio-capture':
          title = "Microphone Issue";
          description = "Could not capture audio. Please check your microphone connection and system permissions.";
          setMicrophonePermission('denied'); 
          break;
        case 'not-allowed':
        case 'service-not-allowed':
          title = "Microphone Access Denied";
          description = "Please allow microphone access in your browser settings to use speech recognition. You may need to refresh the page after granting permission.";
          duration = 10000;
          setMicrophonePermission('denied');
          break;
        case 'network':
          title = "Network Error";
          description = "A network error occurred. Please check your internet connection and try again.";
          break;
        case 'language-not-supported':
          title = "Language Not Supported";
          description = `The selected language (${getLanguageName(languageCode)}) may not be fully supported for speech recognition by your browser.`;
          break;
        case 'aborted':
          return; 
        default:
          console.error("Unhandled speech recognition error:", event.error, event.message); 
          description = event.message || `An unknown error occurred (${event.error}). Please try again.`;
      }

      toast({
        title: title,
        description: description,
        variant: "destructive",
        duration: duration,
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[event.results.length - 1][0].transcript;
      onResultCallback(speechResult);
    };

    recognition.start();
  }, [toast, microphonePermission]);

  const handleSummarize = () => {
    const conversationText = transcript.map(m => `${m.source}: ${m.originalText}`).join('\n');
    if (!conversationText) {
        toast({ title: "Cannot Summarize", description: "No conversation to summarize.", variant: "destructive" });
        return;
    }
    toast({ title: "Summarization (Not Implemented)", description: "Conversation summary feature is pending AI integration." });
  };
  
  const handleEndConsultationAndClear = () => {
    const currentDuration = elapsedTimeInSeconds; 
    resetConsultationTimer(); 
    
    const durationForToast = localStorage.getItem('lastConsultationDuration') || formatTime(currentDuration);

    toast({ title: "Consultation Ended", description: `Duration: ${durationForToast}. Transcript cleared.` });
    setTranscript([]);
    setUserInput('');
    setPatientResponseInput('');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); 
    }
  };
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getLanguageName = (code?: string) => {
    if (!code) return '';
    const map: { [key: string]: string } = {
      'en': 'English', 'bn': 'Bangla', 'ur': 'Urdu', 'so': 'Somali', 'ar': 'Arabic', 'pl': 'Polish'
    };
    return map[code.toLowerCase()] || code.toUpperCase();
  }


  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
      <Card className="shadow-md">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <LanguageSelector selectedLanguage={patientLanguage} onLanguageChange={setPatientLanguage} />
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymization-toggle"
              checked={isAnonymizationEnabled}
              onCheckedChange={setIsAnonymizationEnabled}
            />
            <Label htmlFor="anonymization-toggle" className="text-sm font-medium">Data Anonymization</Label>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleSummarize} variant="outline" disabled={isLoading || transcript.length === 0}>
              <FileText className="mr-2 h-4 w-4" /> Summarize
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading || (!isTimerRunning && elapsedTimeInSeconds === 0)}>
                  <Trash2 className="mr-2 h-4 w-4" /> End Consultation
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Consultation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear the current transcript and stop the timer. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEndConsultationAndClear}>Confirm End</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
        <Card className="shadow-md flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center gap-2"><SquareTerminal /> Doctor's Input (English)</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4 p-4">
            <Textarea
              placeholder="Type medical questions or recommendations here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={6}
              className="flex-grow resize-none text-base"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="flex-grow">
                <Send className="mr-2 h-4 w-4" /> Translate & Send
              </Button>
              <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            disabled={isLoading || isListeningDoctor || microphonePermission === 'denied'} 
                            onClick={() => startSpeechRecognition('en', setUserInput, setIsListeningDoctor)}
                        >
                            <Mic className={`h-4 w-4 ${isListeningDoctor ? 'text-red-500 animate-pulse' : ''} ${microphonePermission === 'denied' ? 'text-destructive' : ''}`} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{microphonePermission === 'denied' ? 'Microphone access denied.' : isListeningDoctor ? 'Listening...' : 'Record Doctor Input (Speech-to-Text)'}</p></TooltipContent>
                 </Tooltip>
              </TooltipProvider>
            </div>
            <Label className="text-xs text-muted-foreground mt-2">
              Patient response can be entered below after receiving it (verbally or written).
            </Label>
            <Textarea
              placeholder="Enter patient's response here (if received verbally/written)..."
              value={patientResponseInput}
              onChange={(e) => setPatientResponseInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (patientResponseInput.trim()) {
                     handlePatientResponse(patientResponseInput);
                     setPatientResponseInput(''); 
                  }
                }
              }}
              rows={4}
              className="resize-none text-base"
              disabled={isLoading}
            />
            <div className="flex gap-2">
                <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                           onClick={() => {
                             if (patientResponseInput.trim()) {
                               handlePatientResponse(patientResponseInput);
                               setPatientResponseInput('');
                             } else {
                               toast({title: "Empty Input", description: "Please enter patient's response before processing.", variant: "default"});
                             }
                           }}
                           variant="secondary" 
                           disabled={isLoading || !patientResponseInput.trim()}
                       >
                         Process Patient Response
                       </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Process the text entered in the patient response box.</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => startSpeechRecognition(patientLanguage, setPatientResponseInput, setIsListeningPatient)} 
                          disabled={isLoading || isListeningPatient || microphonePermission === 'denied'} 
                          variant="outline" 
                          size="icon" 
                        >
                          <Mic className={`h-4 w-4 ${isListeningPatient ? 'text-red-500 animate-pulse' : ''} ${microphonePermission === 'denied' ? 'text-destructive' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>{microphonePermission === 'denied' ? 'Microphone access denied. Check browser settings.' : isListeningPatient ? 'Listening...' : 'Record Patient Response (Speech-to-Text)'}</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Conversation Transcript</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
              {transcript.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mb-4" />
                  <p className="text-lg">No messages yet.</p>
                  <p>Start the consultation by sending a message or processing a patient response. This will also start the timer.</p>
                </div>
              )}
              {transcript.map((msg) => (
                <TranscriptItem key={msg.id} message={msg} onEdit={handleEditTranscript} />
              ))}
              <div ref={transcriptEndRef} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

