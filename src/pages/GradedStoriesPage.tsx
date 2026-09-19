import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Globe,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { GRADED_STORIES, GradedStory, StoryToken } from "../data/storiesData";
import { audioService } from "../services/audioService";
import { gamificationService } from "../services/gamificationService";
import { bengaliService } from "../services/bengaliService";
import { HSKBadge } from "../components/common/HSKBadge";

export const GradedStoriesPage: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<GradedStory>(GRADED_STORIES[0]);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showBengali, setShowBengali] = useState(false);
  const [activeToken, setActiveToken] = useState<StoryToken | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const handleSelectStory = (story: GradedStory) => {
    setSelectedStory(story);
    setActiveToken(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleTokenClick = (token: StoryToken) => {
    setActiveToken(token);
    audioService.speakText(token.hanzi);
  };

  const handlePlayFullAudio = () => {
    const fullText = selectedStory.paragraphs.map((p) => p.textZh).join(" ");
    audioService.speakText(fullText, { rate: 0.85 });
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    selectedStory.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount > 0) {
      gamificationService.addXp(60, "Completed story comprehension quiz");
      gamificationService.progressQuest("quest_story", 1);
      gamificationService.unlockBadge("story_reader");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <BookOpen size={18} />
            </span>
            <h1 className="text-xl font-bold text-neutral-900 font-serif">
              {isBn ? "লেভেল ভিত্তিক চাইনিজ ছোট গল্প" : "Graded Reading Stories"}
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            {isBn
              ? "বাস্তব জীবনভিত্তিক চাইনিজ গল্প। যেকোনো শব্দে ক্লিক করে পিনয়িন, ইংরেজি ও বাংলা অর্থ দেখুন।"
              : "Immersive Chinese stories. Click on any word to inspect Pinyin, English, and Bengali meanings."}
          </p>
        </div>

        {/* Story Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {GRADED_STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => handleSelectStory(story)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStory.id === story.id
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span className="mr-1">HSK {story.hskLevel}</span>
              <span>{story.titleZh}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Reading Canvas */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Story Title & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HSKBadge level={selectedStory.hskLevel} size="sm" />
              <span className="text-xs font-mono text-red-600 font-medium">
                {selectedStory.titlePinyin}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-hanzi font-bold text-neutral-900">
              {selectedStory.titleZh}
            </h2>
            <p className="text-sm text-neutral-600 font-medium">
              {selectedStory.titleEn}
            </p>
            <p className="text-xs text-neutral-400 font-bangla">
              {selectedStory.titleBn}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handlePlayFullAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Volume2 size={14} className="text-red-400" />
              <span>{isBn ? "গল্পটি শুনুন" : "Read Aloud"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showPinyin
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200"
              }`}
            >
              Pinyin: {showPinyin ? "ON" : "OFF"}
            </button>

            <button
              type="button"
              onClick={() => setShowEnglish(!showEnglish)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showEnglish
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200"
              }`}
            >
              English: {showEnglish ? "ON" : "OFF"}
            </button>

            <button
              type="button"
              onClick={() => setShowBengali(!showBengali)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showBengali
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200"
              }`}
            >
              বাংলা: {showBengali ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Story Paragraphs with Token Interaction */}
        <div className="space-y-6 text-neutral-800 leading-relaxed">
          {selectedStory.paragraphs.map((para, pIdx) => (
            <div
              key={pIdx}
              className="p-4 rounded-2xl bg-neutral-50/60 border border-neutral-100 hover:border-neutral-200 transition-colors space-y-2"
            >
              {/* Optional Pinyin */}
              {showPinyin && (
                <div className="text-xs font-mono text-red-600/90 font-medium tracking-wide">
                  {para.textPinyin}
                </div>
              )}

              {/* Chinese text with interactive clickable tokens */}
              <div className="text-xl sm:text-2xl font-hanzi leading-loose flex flex-wrap gap-x-2 gap-y-1">
                {para.tokens.map((token, tIdx) => (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => handleTokenClick(token)}
                    className="inline-block px-1 rounded hover:bg-red-100 hover:text-red-800 cursor-pointer transition-colors border-b border-dashed border-neutral-300 hover:border-red-400"
                    title={`Click to inspect ${token.hanzi}`}
                  >
                    {token.hanzi}
                  </button>
                ))}
              </div>

              {/* Optional English translation */}
              {showEnglish && (
                <div className="text-xs text-neutral-600 pt-1 font-medium">
                  {para.textEn}
                </div>
              )}

              {/* Optional Bengali translation */}
              {showBengali && (
                <div className="text-xs text-emerald-700 font-bangla pt-0.5">
                  {para.textBn}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Word Inspector Floating Card */}
        {activeToken && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between shadow-lg animate-in fade-in duration-150">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => audioService.speakText(activeToken.hanzi)}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <Volume2 size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-hanzi font-bold text-white">
                    {activeToken.hanzi}
                  </span>
                  <span className="text-sm font-mono text-red-400 font-semibold">
                    {activeToken.pinyin}
                  </span>
                </div>
                <div className="text-xs text-neutral-300">
                  <span>En: {activeToken.en}</span>
                  <span className="mx-2">•</span>
                  <span className="text-emerald-300 font-bangla">
                    বাংলা: {activeToken.bn}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveToken(null)}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-white/10"
            >
              Close
            </button>
          </div>
        )}

        {/* Comprehension Quiz Section */}
        <div className="pt-6 border-t border-neutral-200 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-red-600" />
              <h3 className="text-base font-bold text-neutral-900">
                {isBn ? "গল্প অনুধাবন কুইজ (Comprehension Check)" : "Comprehension Quiz (+60 XP)"}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {selectedStory.quiz.map((q, qIdx) => {
              const selectedOption = quizAnswers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3"
                >
                  <p className="text-sm font-semibold text-neutral-900">
                    {qIdx + 1}. {q.questionZh} ({q.questionEn})
                  </p>
                  {isBn && (
                    <p className="text-xs text-neutral-500 font-bangla">
                      {q.questionBn}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOption === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let btnStyle = "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100";

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold";
                        } else if (isChosen && !isCorrect) {
                          btnStyle = "bg-rose-50 border-rose-300 text-rose-800";
                        }
                      } else if (isChosen) {
                        btnStyle = "bg-red-50 border-red-300 text-red-800 font-semibold";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                        >
                          <div className="font-hanzi text-sm font-bold">
                            {opt.textZh}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {opt.textEn}
                          </div>
                          {isBn && (
                            <div className="text-[10px] text-neutral-400 font-bangla">
                              {opt.textBn}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation upon submit */}
                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-white border border-neutral-200 text-xs space-y-1">
                      <p className="text-neutral-700">{q.explanationEn}</p>
                      {isBn && (
                        <p className="text-neutral-500 font-bangla text-[11px]">
                          {q.explanationBn}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit button */}
          {!quizSubmitted ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGradeQuiz}
                disabled={Object.keys(quizAnswers).length < selectedStory.quiz.length}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isBn ? "উত্তর জমা দিন (+60 XP)" : "Check Answers (+60 XP)"}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <span className="font-semibold">
                {isBn ? "কুইজ সম্পন্ন হয়েছে! +60 XP আপনার প্রোফাইলে যুক্ত হয়েছে।" : "Quiz completed! +60 XP awarded to your profile."}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
