import React, { useState, useEffect, useRef } from "react";
import {
  aiChatService,
  ChatMessage,
  ChatMode,
  STARTER_PROMPTS,
} from "../services/aiChatService";
import { ALL_HSK_LEVELS } from "../services/vocabularyService";
import { HskLevel } from "../types/hsk";
import {
  Bot,
  Send,
  Trash2,
  Volume2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  Languages,
} from "lucide-react";

interface AiTutorPageProps {
  initialPrompt?: string;
  initialMode?: ChatMode;
  initialWordContext?: any;
}

export const AiTutorPage: React.FC<AiTutorPageProps> = ({
  initialPrompt,
  initialMode = "general",
  initialWordContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    aiChatService.getMessages()
  );
  const [inputText, setInputText] = useState(initialPrompt || "");
  const [selectedMode, setSelectedMode] = useState<ChatMode>(initialMode);
  const [selectedHskLevel, setSelectedHskLevel] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const unsubscribe = aiChatService.subscribe(() => {
      setMessages(aiChatService.getMessages());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText("");
    setIsLoading(true);

    try {
      await aiChatService.sendMessage(text, {
        hskLevel: selectedHskLevel,
        mode: selectedMode,
        wordContext: initialWordContext,
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSpeak = (id: string, text: string) => {
    setSpeakingId(id);
    aiChatService.speakChinese(text);
    setTimeout(() => setSpeakingId(null), 3000);
  };

  const modeDetails: Record<
    ChatMode,
    { label: string; chinese: string; icon: React.FC<any>; desc: string }
  > = {
    general: {
      label: "General Tutor",
      chinese: "AI导师",
      icon: Bot,
      desc: "Ask any question about Chinese words, culture, and expressions",
    },
    grammar: {
      label: "Grammar Doctor",
      chinese: "语法纠错",
      icon: BookOpen,
      desc: "Paste sentences for syntax check, word-order analysis & rules",
    },
    roleplay: {
      label: "Roleplay Scenarios",
      chinese: "情境对话",
      icon: MessageSquare,
      desc: "Simulate real-life dialogues (cafe, hotel, taxi, airport)",
    },
    quiz: {
      label: "HSK Practice Quiz",
      chinese: "随堂测验",
      icon: HelpCircle,
      desc: "Interactive vocabulary, measure word, and tone challenges",
    },
  };

  const starterPrompts = STARTER_PROMPTS[selectedMode];

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)] min-h-[550px] space-y-3">
      {/* Top Controls Bar */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
                  HanBot · AI Chinese Tutor
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  HSK 3.0 Specialist
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Powered by Gemini AI · Speaks Mandarin Chinese with tone explanations
              </p>
            </div>
          </div>

          {/* Level Selector & Clear Action */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl text-xs">
              <span className="text-[11px] font-semibold text-neutral-600 px-2 flex items-center gap-1">
                <Languages size={13} />
                Level:
              </span>
              <select
                value={selectedHskLevel}
                onChange={(e) => setSelectedHskLevel(e.target.value)}
                className="bg-white text-xs font-semibold py-1 px-2 rounded-lg border border-neutral-200 text-neutral-800 focus:outline-none"
              >
                <option value="all">Adaptive (All)</option>
                {ALL_HSK_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    HSK {lvl}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear chat history?")) {
                  aiChatService.clearHistory();
                }
              }}
              title="Clear conversation"
              className="p-2 rounded-xl text-neutral-500 hover:text-red-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 border-t border-neutral-100 text-xs">
          {(Object.keys(modeDetails) as ChatMode[]).map((mode) => {
            const detail = modeDetails[mode];
            const Icon = detail.icon;
            const isSelected = selectedMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-red-50 text-red-800 border-red-300 font-semibold shadow-2xs"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                }`}
              >
                <Icon size={16} className={isSelected ? "text-red-600 shrink-0" : "text-neutral-400 shrink-0"} />
                <div className="truncate">
                  <span className="block truncate font-medium">{detail.label}</span>
                  <span className="text-[10px] opacity-75 font-hanzi">{detail.chinese}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white border border-neutral-200/90 rounded-2xl shadow-2xs space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                  汉
                </div>
              )}

              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-neutral-900 text-white rounded-tr-xs"
                      : "bg-neutral-50 border border-neutral-200/90 text-neutral-800 rounded-tl-xs shadow-2xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                </div>

                {/* Message Utilities (Listen, Copy) for Assistant */}
                {!isUser && (
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 pl-1">
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className="flex items-center gap-1 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Volume2 size={13} className={speakingId === msg.id ? "text-red-600 animate-pulse" : ""} />
                      <span>{speakingId === msg.id ? "Playing..." : "Listen (朗读)"}</span>
                    </button>

                    <span>·</span>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
              汉
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-neutral-600 text-xs flex items-center gap-2 shadow-2xs">
              <Sparkles size={14} className="text-red-600 animate-spin" />
              <span>HanBot is thinking in Chinese & drafting explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-thin">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {starterPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl text-xs bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-neutral-200 text-neutral-700 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-2.5 shadow-xs shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a question or practice in Chinese (Mode: ${modeDetails[selectedMode].label}). Press Enter to send...`}
            disabled={isLoading}
            className="flex-1 p-2.5 text-sm bg-neutral-50/70 border border-neutral-200 rounded-xl resize-none focus:bg-white focus:border-red-500 focus:outline-none transition-colors"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-200 text-white rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-xs"
            title="Send Message (Enter)"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
