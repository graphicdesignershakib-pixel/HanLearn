import React, { useState, useEffect, useRef } from "react";
import {
  aiChatService,
  ChatMessage,
} from "../../services/aiChatService";
import { navigate, useRouter } from "../../services/routerService";
import {
  Bot,
  X,
  Send,
  Volume2,
  Maximize2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const FloatingAiTutor: React.FC = () => {
  const { user } = useAuth();
  const { currentPath } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    aiChatService.getMessages()
  );
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // If already on /chat or /tutor, or if user is not authenticated, don't show the floating widget
  const isOnChatPage = currentPath === "/chat" || currentPath === "/tutor";

  useEffect(() => {
    const unsubscribe = aiChatService.subscribe(() => {
      setMessages(aiChatService.getMessages());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  if (isOnChatPage || !user) {
    return null;
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText("");
    setIsLoading(true);

    try {
      await aiChatService.sendMessage(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    aiChatService.speakChinese(text);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer font-medium text-sm"
          title="Open HanBot AI Chinese Tutor"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-hanzi font-bold text-xs">
            汉
          </div>
          <span>Ask AI Tutor</span>
          <Sparkles size={14} className="text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white border border-neutral-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-hanzi font-bold text-xs shadow-xs">
                汉
              </div>
              <div>
                <span className="font-bold text-sm block leading-tight">HanBot AI Tutor</span>
                <span className="text-[10px] text-neutral-400">Chinese HSK 3.0 Specialist</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/chat");
                }}
                title="Open Fullscreen Tutor"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-neutral-50 px-3 py-1.5 border-b border-neutral-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-thin">
            <button
              onClick={() => {
                setInputText("Check my sentence: ");
                inputRef.current?.focus();
              }}
              className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 whitespace-nowrap hover:bg-neutral-100 cursor-pointer"
            >
              ✍️ Check Sentence
            </button>
            <button
              onClick={() => {
                setInputText("Explain grammar of ");
                inputRef.current?.focus();
              }}
              className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 whitespace-nowrap hover:bg-neutral-100 cursor-pointer"
            >
              📖 Grammar Rule
            </button>
            <button
              onClick={() => {
                setInputText("Give me 3 example sentences for ");
                inputRef.current?.focus();
              }}
              className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 whitespace-nowrap hover:bg-neutral-100 cursor-pointer"
            >
              💡 Examples
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-neutral-50/50">
            {messages.slice(-15).map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isUser
                        ? "bg-neutral-900 text-white rounded-tr-xs"
                        : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-xs shadow-2xs whitespace-pre-wrap"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.content)}
                      className="mt-1 flex items-center gap-1 text-[10px] text-neutral-500 hover:text-red-600 px-1 cursor-pointer"
                    >
                      <Volume2 size={11} />
                      <span>Speak</span>
                    </button>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-neutral-200 text-[11px] text-neutral-500 max-w-[80%]">
                <Sparkles size={12} className="text-red-600 animate-spin" />
                <span>HanBot is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-white border-t border-neutral-200 flex items-center gap-1.5"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask HanBot (e.g. 怎么用这个词?)..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs bg-neutral-100/70 border border-neutral-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-200 text-white rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
