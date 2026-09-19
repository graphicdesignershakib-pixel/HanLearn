import { vocabularyService } from "./vocabularyService";

export interface PronunciationService {
  isAvailable(): boolean;
  playWord(id: string): Promise<void>;
  playText(text: string, options?: { rate?: number }): Promise<void>;
  speakWord(id: string): Promise<void>;
  speakText(text: string, options?: { rate?: number }): Promise<void>;
  speakSentence(id: string): Promise<void>;
  playSyllable(id: string, index: number): Promise<void>;
  playSentence(id: string): Promise<void>;
  setRate(rate: number): void;
  getRate(): number;
  stop(): void;
  onStateChange(listener: (isPlaying: boolean, currentId?: string) => void): () => void;
}

export class WebSpeechPronunciationService implements PronunciationService {
  private rate: number = 1.0;
  private isSpeaking: boolean = false;
  private listeners: Set<(isPlaying: boolean, currentId?: string) => void> = new Set();
  private currentPlayingId?: string;

  constructor() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Warm up voices
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  public isAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  public setRate(rate: number): void {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  public getRate(): number {
    return this.rate;
  }

  public stop(): void {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.setPlaying(false);
  }

  public onStateChange(listener: (isPlaying: boolean, currentId?: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setPlaying(playing: boolean, id?: string) {
    this.isSpeaking = playing;
    this.currentPlayingId = playing ? id : undefined;
    this.listeners.forEach((l) => l(playing, this.currentPlayingId));
  }

  public async playText(text: string, options?: { rate?: number }): Promise<void> {
    if (!this.isAvailable()) {
      console.warn("SpeechSynthesis is not supported in this environment.");
      return;
    }

    return new Promise((resolve) => {
      this.stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = options?.rate ?? this.rate;

      // Try selecting a Mandarin voice if available
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(
        (v) => v.lang === "zh-CN" || v.lang.startsWith("zh") || v.name.includes("Chinese")
      );
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      utterance.onstart = () => {
        this.setPlaying(true, text);
      };

      utterance.onend = () => {
        this.setPlaying(false);
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        this.setPlaying(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public async speakText(text: string, options?: { rate?: number }): Promise<void> {
    return this.playText(text, options);
  }

  public async speakWord(id: string): Promise<void> {
    return this.playWord(id);
  }

  public async speakSentence(sentenceId: string): Promise<void> {
    return this.playSentence(sentenceId);
  }

  public async playWord(id: string): Promise<void> {
    const word = vocabularyService.getWordById(id);
    if (!word) return;
    this.setPlaying(true, id);
    await this.playText(word.hanzi);
    this.setPlaying(false);
  }

  public async playSyllable(id: string, index: number): Promise<void> {
    const word = vocabularyService.getWordById(id);
    if (!word || !word.syllables[index]) return;

    // Pronounce the character corresponding to this syllable or the syllable
    const char = word.hanzi[index] || word.syllables[index].display;
    this.setPlaying(true, `${id}-syl-${index}`);
    await this.playText(char);
    this.setPlaying(false);
  }

  public async playSentence(sentenceId: string): Promise<void> {
    const sentence = vocabularyService.getSentence(sentenceId);
    if (!sentence) return;
    this.setPlaying(true, sentenceId);
    await this.playText(sentence.chinese);
    this.setPlaying(false);
  }
}

export const audioService = new WebSpeechPronunciationService();
