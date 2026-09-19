import { StrokeData } from "../types/hsk";

export interface HanziStrokeProvider {
  getCharacterData(character: string): Promise<StrokeData | null>;
  isCharacterSupported(character: string): Promise<boolean>;
}

export class HanziWriterStrokeProvider implements HanziStrokeProvider {
  private cache = new Map<string, StrokeData>();

  public async getCharacterData(character: string): Promise<StrokeData | null> {
    if (!character || character.length === 0) return null;
    const char = character[0];

    if (this.cache.has(char)) {
      return this.cache.get(char)!;
    }

    try {
      // Fetch stroke data from the standard official Hanzi Writer open-source repository CDN
      const encodedChar = encodeURIComponent(char);
      const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodedChar}.json`;
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data: StrokeData = await response.json();
      data.character = char;
      this.cache.set(char, data);
      return data;
    } catch (err) {
      console.warn(`Could not load stroke data for character '${char}':`, err);
      return null;
    }
  }

  public async isCharacterSupported(character: string): Promise<boolean> {
    const data = await this.getCharacterData(character);
    return data !== null;
  }
}

export const strokeProvider = new HanziWriterStrokeProvider();
