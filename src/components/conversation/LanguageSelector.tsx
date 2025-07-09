"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Language {
  value: string;
  label: string;
}

const supportedLanguages: Language[] = [
  { value: "bn", label: "Bangla (Bengali)" },
  { value: "ur", label: "Urdu" },
  { value: "so", label: "Somali" },
  { value: "ar", label: "Arabic" },
  { value: "pl", label: "Polish" },
  // Add more languages as needed
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  label?: string;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  label = "Patient's Language",
}: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="language-select" className="text-sm font-medium">{label}</Label>
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger id="language-select" className="w-full sm:w-[200px] bg-card">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Supported Languages</SelectLabel>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
