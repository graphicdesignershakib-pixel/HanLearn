export type ChatMode = "general" | "grammar" | "roleplay" | "quiz";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface SendMessageOptions {
  hskLevel?: string;
  mode?: ChatMode;
  wordContext?: {
    hanzi: string;
    pinyinDisplay?: string;
    hskLevel?: string;
    definitions?: { text: string }[];
  };
}

const STORAGE_KEY = "hanlearn_ai_chat_history";

export const STARTER_PROMPTS: Record<ChatMode, string[]> = {
  general: [
    "What is the difference between 觉得 (juéde) and 以为 (yǐwéi)?",
    "Explain the grammar and word order of 把 (bǎ) sentences with examples.",
    "When should I use 不 (bù) versus 没 (méi)?",
    "Give me 5 essential idioms (成语) for HSK 4 with their stories.",
  ],
  grammar: [
    "Correct my sentence: 我昨天去商店买了一个本。",
    "Is this right? 他每天早上游泳一个小时。",
    "Can I say '他比我很高'? Explain the degree difference.",
    "Check my sentence: 我把那本书没看完。",
  ],
  roleplay: [
    "Let's roleplay ordering coffee or bubble tea at a cafe in Beijing (HSK 2-3).",
    "Roleplay: I am checking in at a hotel in Shanghai (HSK 3).",
    "Roleplay: Taking a taxi to the train station and asking for the receipt (HSK 2).",
    "Roleplay: Asking a stranger for directions to the Forbidden City (HSK 1-2).",
  ],
  quiz: [
    "Quiz me on HSK 1 and HSK 2 measure words (量词).",
    "Give me a tone discrimination quiz with confusing tone pairs.",
    "Test my knowledge of HSK 3 conjunctions (虽然...但是, 因为...所以).",
    "Give me a fill-in-the-blank vocabulary quiz for HSK 2.",
  ],
};

class AiChatService {
  private messages: ChatMessage[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.messages = JSON.parse(saved);
      } else {
        // Initial welcoming message from HanBot
        this.messages = [
          {
            id: "welcome-1",
            role: "assistant",
            content:
              "你好！(Nǐ hǎo!) I am **HanBot (汉小伴)**, your personal AI Chinese language tutor.\n\nI can help you with:\n- **Grammar & Sentence Clinic**: Paste any Chinese sentence and I'll check word order and particles.\n- **Vocabulary Deep-Dives**: Synonyms, confusing word pairs, and collocations.\n- **Interactive Roleplay**: Practice real conversations at cafes, train stations, or markets.\n- **HSK Quizzes & Tone Checks**: Test your progress at any level.\n\nHow can I help your Chinese learning today?",
            timestamp: Date.now(),
          },
        ];
        this.saveToStorage();
      }
    } catch {
      this.messages = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
    } catch {
      // Ignore quota errors
    }
  }

  public getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((cb) => cb());
  }

  public clearHistory() {
    this.messages = [
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation cleared! 你好！Ask me any question about Chinese grammar, vocabulary, or pronunciation practice.",
        timestamp: Date.now(),
      },
    ];
    this.notify();
  }

  public async sendMessage(
    text: string,
    options: SendMessageOptions = {}
  ): Promise<ChatMessage> {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    this.messages.push(userMsg);
    this.notify();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: this.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          hskLevel: options.hskLevel,
          mode: options.mode || "general",
          wordContext: options.wordContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "assistant",
        content: data.reply || "太棒了！(Great!) How else can I assist your study?",
        timestamp: Date.now(),
      };

      this.messages.push(assistantMsg);
      this.notify();
      return assistantMsg;
    } catch (err: any) {
      console.warn("AI Chat API encountered an error, providing graceful fallback:", err);

      // Graceful fallback response when API key or connection is pending
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "assistant",
        content:
          `你好！(Nǐ hǎo!) I received your question: "${text}"\n\n` +
          `*Note: The Gemini AI server reported: ${err.message || "Connection pending"}*. ` +
          `Make sure the \`GEMINI_API_KEY\` is configured in the **Settings > Secrets** panel in AI Studio.\n\n` +
          `**Helpful Tip:** While configuring your key, you can continue exploring all 11,000 official HSK 3.0 vocabulary cards, tone trainer, and stroke-order writing lab!`,
        timestamp: Date.now(),
      };

      this.messages.push(fallbackMsg);
      this.notify();
      return fallbackMsg;
    }
  }

  // Speak Chinese text aloud using Web Speech API with Mandarin voice
  public speakChinese(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    // Extract Chinese characters and basic punctuation to speak
    const chineseChars = text.match(/[\u4e00-\u9fa5\w\s，。！？、]+/g)?.join(" ") || text;

    const utterance = new SpeechSynthesisUtterance(chineseChars);
    utterance.lang = "zh-CN";
    utterance.rate = 0.85; // Slightly slower for language learners

    // Find best Chinese voice if available
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(
      (v) => v.lang.startsWith("zh") || v.lang.includes("Chinese") || v.name.includes("Mandarin")
    );
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const aiChatService = new AiChatService();
