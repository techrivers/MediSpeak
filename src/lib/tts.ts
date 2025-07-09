
'use client';

export const speakText = (text: string, lang: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech before starting a new one
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(lang));
      
      if (voice) {
        utterance.voice = voice;
      } else {
        console.warn(`TTS: No specific voice found for language: ${lang}. Using browser default for this language.`);
      }
      
      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror:', event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      window.speechSynthesis.speak(utterance);
    } else {
      reject(new Error('Speech synthesis not supported by this browser.'));
    }
  });
};

// Ensure voices are loaded. Some browsers load them asynchronously.
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // Pre-load voices. The list might be empty on the first call to getVoices().
  // Listening to onvoiceschanged helps ensure they are loaded.
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      // console.log("TTS voices loaded:", window.speechSynthesis.getVoices().length);
    };
  }
}
