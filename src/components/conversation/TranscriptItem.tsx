
"use client";

import React, { useState } from 'react';
import { Bot, User, Edit2, Save, XCircle, Languages, ShieldCheck, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; 
import { Badge } from '@/components/ui/badge';
import { speakText } from '@/lib/tts';

export interface TranscriptMessage {
  id: string;
  source: 'doctor' | 'patient' | 'system'; 
  originalText: string;
  originalLanguage?: string; 
  anonymizedText?: string;
  translatedText?: string;
  targetLanguage?: string; 
  timestamp: Date;
  isEditable?: boolean; 
  translationAccuracy?: number;
}

interface TranscriptItemProps {
  message: TranscriptMessage;
  onEdit?: (messageId: string, newText: string) => void;
}

export function TranscriptItem({ message, onEdit }: TranscriptItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.originalText);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(message.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(message.originalText);
    setIsEditing(false);
  };

  const handleListen = () => {
    if (message.translatedText && message.targetLanguage) {
      speakText(message.translatedText, message.targetLanguage)
        .catch(err => {
          console.error('Error playing translation from TranscriptItem:', err.message);
          // For now, logging to console. A toast could be an option if `useToast` was available here.
        });
    } else if (message.source === 'system' && message.originalText.startsWith("Doctor's message translated to") && message.targetLanguage) {
        // This handles system messages that are direct translations
        const textToSpeak = message.originalText.substring(message.originalText.indexOf(':') + 2);
        speakText(textToSpeak, message.targetLanguage)
        .catch(err => {
            console.error('Error playing system message translation from TranscriptItem:', err.message);
        });
    } else if (message.source === 'system' && message.originalText.startsWith("Patient's message translated to English") && message.targetLanguage === 'en') {
        const textToSpeak = message.originalText.substring(message.originalText.indexOf(':') + 2);
        speakText(textToSpeak, 'en')
        .catch(err => {
            console.error('Error playing system message translation to English from TranscriptItem:', err.message);
        });
    }


  };


  const Icon = message.source === 'doctor' ? User : message.source === 'patient' ? User : Bot;
  const iconColor = message.source === 'doctor' ? 'text-primary' : message.source === 'patient' ? 'text-accent' : 'text-muted-foreground';
  const cardBorder = message.source === 'doctor' ? 'border-primary/30' : message.source === 'patient' ? 'border-accent/30' : 'border-muted/30';
  
  const getLanguageName = (code?: string) => {
    if (!code) return '';
    const map: { [key: string]: string } = {
      'en': 'English', 'bn': 'Bangla', 'ur': 'Urdu', 'so': 'Somali', 'ar': 'Arabic', 'pl': 'Polish'
    };
    return map[code.toLowerCase()] || code.toUpperCase();
  }

  // Determine if this message has playable translated content
  const hasPlayableTranslation = !!(message.translatedText && message.targetLanguage) || 
                                 (message.source === 'system' && message.originalText.includes("translated to") && message.targetLanguage);


  return (
    <Card className={`mb-4 shadow-md ${cardBorder} ${message.source === 'doctor' ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}`}>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-6 w-6 ${iconColor}`} />
            <CardTitle className="text-base font-semibold">
              {message.source === 'doctor' ? 'Doctor' : message.source === 'patient' ? 'Patient' : 'System'}
            </CardTitle>
            {message.originalLanguage && (
              <Badge variant="outline" className="text-xs">{getLanguageName(message.originalLanguage)}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasPlayableTranslation && (
                 <Button onClick={handleListen} size="icon" variant="ghost" className={`h-6 w-6 p-0 ${message.source === 'system' ? 'text-green-700 hover:text-green-800' : 'text-muted-foreground hover:text-foreground'}`}>
                    <PlayCircle className="h-4 w-4" />
                    <span className="sr-only">Listen to translation</span>
                 </Button>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm"><Save className="mr-1 h-4 w-4" /> Save</Button>
              <Button onClick={handleCancel} size="sm" variant="outline"><XCircle className="mr-1 h-4 w-4" /> Cancel</Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.originalText}</p>
        )}

        {message.anonymizedText && message.anonymizedText !== message.originalText && (
           <div className="p-2 border-l-2 border-yellow-500 bg-yellow-500/10 rounded">
            <p className="text-xs text-yellow-700 flex items-center gap-1"><ShieldCheck className="h-3 w-3"/> Anonymized: <span className="italic">{message.anonymizedText}</span></p>
          </div>
        )}
        
        {/* Display for messages that store translatedText directly (populated by dashboard page for auto-play) */}
        {message.translatedText && message.source === 'system' && (
          <div className="p-2 border-l-2 border-green-500 bg-green-500/10 rounded">
            {/* The originalText for system messages already contains the full description */}
            {/* The button is handled in CardHeader now if hasPlayableTranslation */}
            {message.translationAccuracy !== undefined && (
                 <Badge variant="secondary" className="mt-1 text-xs">Accuracy: {(message.translationAccuracy * 100).toFixed(0)}%</Badge>
            )}
          </div>
        )}
      </CardContent>
      {message.isEditable && !isEditing && onEdit && (
        <CardFooter className="p-3 justify-end">
          <Button onClick={handleEdit} size="sm" variant="ghost">
            <Edit2 className="mr-1 h-4 w-4" /> Edit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
