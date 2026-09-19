import React, { useState, useEffect, useRef } from "react";
import { CONVERSATION_SCENARIOS, ConversationScenario } from "../services/scenariosData";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { gamificationService } from "../services/gamificationService";
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Eye,
  EyeOff,
  ChevronRight,
  Bot,
  User,
  CheckCircle2,
  Flame,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  pinyin?: string;
  translation?: string;
  translationBn?: string;
}

export const AiConversationPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario>(CONVERSATION_SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [completedTurns, setCompletedTurns] = useState(0);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  // Initialize conversation with scenario's initial message
  useEffect(() => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "ai",
        text: selectedScenario.initialMessage.chinese,
        pinyin: selectedScenario.initialMessage.pinyin,
        translation: selectedScenario.initialMessage.english,
        translationBn: selectedScenario.initialMessage.bengali,
      },
    ]);
    setCompletedTurns(0);
  }, [selectedScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingAi]);

  // Handle Speech Recognition with fallback
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Friendly fallback
      const promptText = selectedScenario.suggestedPrompts[0]?.chinese || "你好！我想点菜。";
      setInputText(promptText);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error", e);
      setIsRecording(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoadingAi) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoadingAi(true);

    // Format chat payload for backend Gemini API with roleplay context
    try {
      const chatPayload = messages.map((m) => ({
        role: m.sender === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      chatPayload.push({ role: "user", content: text });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatPayload,
          hskLevel: selectedScenario.hskLevel,
          mode: "roleplay",
          wordContext: {
            scenarioTitle: selectedScenario.title,
            aiRole: selectedScenario.aiRole,
            userRole: selectedScenario.role,
            systemPrompt: selectedScenario.systemPrompt,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      const aiReply = data.reply || "好的，我明白了！";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiReply,
        },
      ]);

      audioService.speakText(aiReply.replace(/[^\u4e00-\u9fa5，。？！]/g, ""));
      setCompletedTurns((prev) => prev + 1);

      // Award XP
      gamificationService.addXp(20, "Roleplay dialogue exchange");
      gamificationService.progressQuest("quest_conversation", 1);
      if (completedTurns + 1 >= 4) {
        try {
          confetti({ particleCount: 40, spread: 50 });
        } catch (_) {}
      }
    } catch (err) {
      console.warn("Falling back to pre-scripted scenario branch:", err);
      // Smart local fallback responses
      let fallbackText = "好的，我明白了！请问还有什么我可以为您效劳的吗？";
      let fallbackPinyin = "Hǎo de, wǒ míngbai le! Qǐngwèn hái yǒu shénme wǒ kěyǐ wèi nín xiàoláo de ma?";
      let fallbackTrans = "Understood! Is there anything else I can assist you with?";

      if (selectedScenario.id === "sc-restaurant") {
        if (text.includes("单") || text.includes("账")) {
          fallbackText = "好的，一共是一百二十八块。微信或支付宝扫码都可以！";
          fallbackPinyin = "Hǎo de, yígòng shì yì bǎi èrshíbā kuài. Wēixìn huò Zhīfùbǎo sǎomǎ dōu kěyǐ!";
          fallbackTrans = "The total is 128 RMB. WeChat or Alipay QR scan are both fine!";
        } else if (text.includes("辣")) {
          fallbackText = "没问题，我跟厨房师傅交代一下，做微辣或者不放辣椒！";
          fallbackPinyin = "Méi wèntí, wǒ gēn chúfáng shīfu jiāodài yíxià, zuò wēilà huòzhě bù fàng làjiāo!";
          fallbackTrans = "No problem! I'll tell the chef to make it mildly spicy or without chili.";
        } else {
          fallbackText = "我们店的特色是宫保鸡丁和牛肉水饺，非常地道！您要来一份尝尝吗？";
          fallbackPinyin = "Wǒmen diàn de tèsè shì Gōngbǎo Jīdīng hé niúròu shuǐjiǎo, fēicháng dìdao!";
          fallbackTrans = "Our specialty is Kung Pao Chicken and beef dumplings. Would you like a portion?";
        }
      } else if (selectedScenario.id === "sc-taxi") {
        fallbackText = "好嘞！系好安全带，大概十五分钟就能到，今天路上车不算多。";
        fallbackPinyin = "Hǎo lei! Jì hǎo ānquándài, dàgài shíwǔ fēnzhōng jiù néng dào.";
        fallbackTrans = "Alright! Fasten your seatbelt, we'll be there in about 15 minutes. Traffic is light today.";
      } else if (selectedScenario.id === "sc-shopping") {
        fallbackText = "哎呀帅哥/美女真有眼光！这样吧，给你打个八折，八十块一件，怎么样？";
        fallbackPinyin = "Āiyā zhēn yǒu yǎnguāng! Zhèyàng ba, gěi nǐ dǎ gè bāzhé, bāshí kuài yí jiàn, zěnmeyàng?";
        fallbackTrans = "You have great taste! How about a 20% discount: 80 RMB apiece, deal?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: fallbackText,
          pinyin: fallbackPinyin,
          translation: fallbackTrans,
        },
      ]);
      audioService.speakText(fallbackText);
      setCompletedTurns((prev) => prev + 1);
      gamificationService.addXp(20);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSpeak = (text: string) => {
    audioService.speakText(text.replace(/[^\u4e00-\u9fa5]/g, ""));
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "ai",
        text: selectedScenario.initialMessage.chinese,
        pinyin: selectedScenario.initialMessage.pinyin,
        translation: selectedScenario.initialMessage.english,
        translationBn: selectedScenario.initialMessage.bengali,
      },
    ]);
    setCompletedTurns(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <MessageSquare size={14} />
              <span>IMMERSIVE AI ROLEPLAY SCENARIOS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "বাস্তবধর্মী এআই কথোপকথন ও রোলপ্লে" : "Interactive Scenario Roleplay"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600">
              {isBn
                ? "রেস্তোরাঁ, ট্যাক্সি, বিমানবন্দর, হোটেল ও চাকরির ইন্টারভিউয়ের মতো বাস্তব জীবনের পরিস্থিতিতে চাইনিজ কথোপকথন অনুশীলন করুন।"
                : "Roleplay realistic day-to-day scenarios. Practice voice input, instant pinyin hints, and dynamic dialogue exchanges."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPinyin(!showPinyin)}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {showPinyin ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPinyin ? (isBn ? "পিনয়িন লুকান" : "Hide Pinyin") : (isBn ? "পিনয়িন দেখুন" : "Show Pinyin")}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowVocabulary(!showVocabulary)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen size={14} />
              <span>{isBn ? "প্রয়োজনীয় শব্দমালা" : "Key Vocab"}</span>
            </button>
          </div>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-100">
          {CONVERSATION_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedScenario(sc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedScenario.id === sc.id
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <span>{isBn ? sc.bengaliTitle : sc.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedScenario.id === sc.id ? "bg-rose-700 text-white" : "bg-neutral-200 text-neutral-600"
              }`}>
                HSK {sc.hskLevel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Roleplay Context Meta */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-500">{isBn ? "আপনার ভূমিকা:" : "Your Role:"}</span>
            <span className="font-bold text-neutral-900 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
              {selectedScenario.role}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-500">{isBn ? "এআই ভূমিকা:" : "AI Partner:"}</span>
            <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
              {selectedScenario.aiRole}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-neutral-600">
            <Flame size={14} className="text-amber-500" />
            <span>Turns: <strong>{completedTurns}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleResetConversation}
            className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>{isBn ? "রিসেট" : "Reset"}</span>
          </button>
        </div>
      </div>

      {/* Key Vocabulary Drawer (if toggled) */}
      {showVocabulary && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
            <BookOpen size={14} />
            <span>{isBn ? "এই পরিস্থিতির গুরুত্বপূর্ণ শব্দার্থ ও অভিব্যক্তি:" : "Essential Scenario Vocabulary:"}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {selectedScenario.keyVocabulary.map((v) => (
              <div key={v.hanzi} className="p-2 bg-white rounded-xl border border-amber-200/80 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-hanzi text-sm text-neutral-900">{v.hanzi}</span>
                  <button
                    type="button"
                    onClick={() => audioService.speakText(v.hanzi)}
                    className="text-neutral-400 hover:text-neutral-800 cursor-pointer"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
                <div className="text-[11px] font-mono text-red-600">{v.pinyin}</div>
                <div className="text-[11px] text-neutral-600 truncate">{isBn ? v.bengali : v.english}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Dialogue Chat Window */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-xs flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    isUser ? "bg-neutral-900" : "bg-rose-600"
                  }`}
                >
                  {isUser ? <User size={15} /> : <Bot size={15} />}
                </div>

                <div
                  className={`p-4 rounded-2xl space-y-1 ${
                    isUser
                      ? "bg-neutral-900 text-white rounded-tr-none"
                      : "bg-neutral-100/90 text-neutral-900 rounded-tl-none border border-neutral-200/60"
                  }`}
                >
                  {/* Chinese Text */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-hanzi text-base md:text-lg font-bold tracking-wide leading-relaxed">
                      {m.text}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSpeak(m.text)}
                      className={`p-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                        isUser ? "hover:bg-neutral-800 text-neutral-300" : "hover:bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>

                  {/* Pinyin (if enabled) */}
                  {showPinyin && m.pinyin && (
                    <p
                      className={`text-xs font-mono ${
                        isUser ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      {m.pinyin}
                    </p>
                  )}

                  {/* Translation */}
                  {(m.translation || m.translationBn) && (
                    <p
                      className={`text-xs pt-1 border-t ${
                        isUser
                          ? "border-neutral-800 text-neutral-400"
                          : "border-neutral-200 text-neutral-500"
                      }`}
                    >
                      {isBn ? m.translationBn || m.translation : m.translation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {isLoadingAi && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center text-xs text-neutral-500 italic">
              <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0">
                <Bot size={15} />
              </div>
              <div className="p-3 bg-neutral-100 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-200" />
                <span className="ml-1 text-neutral-600">{selectedScenario.aiRole} typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Response Chips */}
        <div className="p-3 border-t border-neutral-100 bg-neutral-50/70 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-neutral-500 shrink-0 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" />
            <span>{isBn ? "প্রস্তাবিত উত্তর:" : "Quick Suggestions:"}</span>
          </span>
          {selectedScenario.suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.chinese)}
              className="px-3 py-1 bg-white border border-neutral-200/80 rounded-xl text-xs font-semibold text-neutral-800 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title={`${p.pinyin} - ${isBn ? p.bengali : p.english}`}
            >
              <span>{p.chinese}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isRecording
                  ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                  : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isBn
                  ? `চাইনিজ বা পিনয়িনে লিখুন (${selectedScenario.role})...`
                  : `Type in Chinese or Pinyin as ${selectedScenario.role}...`
              }
              className="flex-1 px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoadingAi}
              className="p-2.5 rounded-2xl bg-neutral-900 text-white hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
