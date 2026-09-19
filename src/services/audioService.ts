import { vocabularyService } from "./vocabularyService";

export interface AudioSettings {
  rate: number; // 0.5, 0.75, 1.0, 1.25, 1.5
  repeatCount: number; // 1, 2, 3, or -1 (infinite loop)
}

export interface PronunciationService {
  isAvailable(): boolean;
  playWord(id: string): Promise<void>;
  playText(text: string, options?: { rate?: number; repeat?: number }): Promise<void>;
  speakWord(id: string): Promise<void>;
  speakText(text: string, options?: { rate?: number; repeat?: number }): Promise<void>;
  speakSentence(id: string): Promise<void>;
  playSyllable(id: string, index: number): Promise<void>;
  playSentence(id: string): Promise<void>;
  setRate(rate: number): void;
  getRate(): number;
  setRepeatCount(count: number): void;
  getRepeatCount(): number;
  getSettings(): AudioSettings;
  stop(): void;
  onStateChange(listener: (isPlaying: boolean, currentId?: string) => void): () => void;
  onSettingsChange(listener: (settings: AudioSettings) => void): () => void;
}

const STORAGE_KEY_AUDIO_SETTINGS = "hanlearn_audio_settings_v1";

export class WebSpeechPronunciationService implements PronunciationService {
  private rate: number = 1.0;
  private repeatCount: number = 1;
  private isSpeaking: boolean = false;
  private isCancelled: boolean = false;
  private listeners: Set<(isPlaying: boolean, currentId?: string) => void> = new Set();
  private settingsListeners: Set<(settings: AudioSettings) => void> = new Set();
  private currentPlayingId?: string;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_AUDIO_SETTINGS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.rate && typeof parsed.rate === "number") this.rate = parsed.rate;
          if (parsed.repeatCount && typeof parsed.repeatCount === "number") this.repeatCount = parsed.repeatCount;
        }
      } catch (e) {
        console.warn("Failed to load audio settings", e);
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          // Voices loaded
        };
      }
    }
  }

  public isAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  public setRate(rate: number): void {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
    this.persistSettings();
  }

  public getRate(): number {
    return this.rate;
  }

  public setRepeatCount(count: number): void {
    this.repeatCount = count;
    this.persistSettings();
  }

  public getRepeatCount(): number {
    return this.repeatCount;
  }

  public getSettings(): AudioSettings {
    return {
      rate: this.rate,
      repeatCount: this.repeatCount,
    };
  }

  private persistSettings() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          STORAGE_KEY_AUDIO_SETTINGS,
          JSON.stringify({ rate: this.rate, repeatCount: this.repeatCount })
        );
      } catch {}
    }
    const settings = this.getSettings();
    this.settingsListeners.forEach((l) => l(settings));
  }

  public onSettingsChange(listener: (settings: AudioSettings) => void): () => void {
    this.settingsListeners.add(listener);
    return () => this.settingsListeners.delete(listener);
  }

  public stop(): void {
    this.isCancelled = true;
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

  private speakOnce(text: string, rate: number): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = rate;

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
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public async playText(text: string, options?: { rate?: number; repeat?: number }): Promise<void> {
    if (!this.isAvailable()) {
      console.warn("SpeechSynthesis is not supported in this environment.");
      return;
    }

    this.stop();
    this.isCancelled = false;

    const rate = options?.rate ?? this.rate;
    const repeat = options?.repeat ?? this.repeatCount;

    this.setPlaying(true, text);

    if (repeat === -1) {
      // Continuous loop until stop() is invoked
      while (!this.isCancelled) {
        await this.speakOnce(text, rate);
        if (this.isCancelled) break;
        await new Promise((r) => setTimeout(r, 400));
      }
    } else {
      const times = Math.max(1, repeat);
      for (let i = 0; i < times; i++) {
        if (this.isCancelled) break;
        await this.speakOnce(text, rate);
        if (i < times - 1 && !this.isCancelled) {
          await new Promise((r) => setTimeout(r, 350));
        }
      }
    }

    this.setPlaying(false);
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
