/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useRouter } from "./services/routerService";
import { AppShell } from "./components/common/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HskLevelsPage } from "./pages/HskLevelsPage";
import { HskLevelDetailPage } from "./pages/HskLevelDetailPage";
import { VocabularyPage } from "./pages/VocabularyPage";
import { VocabularyDetailPage } from "./pages/VocabularyDetailPage";
import { PracticeHubPage } from "./pages/PracticeHubPage";
import { PronunciationPracticePage } from "./pages/PronunciationPracticePage";
import { TonePracticePage } from "./pages/TonePracticePage";
import { SentencePracticePage } from "./pages/SentencePracticePage";
import { WritingPage } from "./pages/WritingPage";
import { CharacterWritingDetailPage } from "./pages/CharacterWritingDetailPage";
import { SavedWordsPage } from "./pages/SavedWordsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { SettingsPage } from "./pages/SettingsPage";
import { DataQualityPage } from "./pages/DataQualityPage";
import { AiTutorPage } from "./pages/AiTutorPage";
import { SpeakingPracticePage } from "./pages/SpeakingPracticePage";
import { FlashcardPage } from "./pages/FlashcardPage";
import { GradedStoriesPage } from "./pages/GradedStoriesPage";
import { RadicalsPage } from "./pages/RadicalsPage";
import { HanziDeconstructorPage } from "./pages/HanziDeconstructorPage";
import { MockExamPage } from "./pages/MockExamPage";
import { HskLearningPathPage } from "./pages/HskLearningPathPage";
import { GrammarLabPage } from "./pages/GrammarLabPage";
import { PinyinLabPage } from "./pages/PinyinLabPage";
import { SentenceBuilderPage } from "./pages/SentenceBuilderPage";
import { DictationLabPage } from "./pages/DictationLabPage";
import { ListeningLabPage } from "./pages/ListeningLabPage";
import { ReadingLabPage } from "./pages/ReadingLabPage";
import { AiConversationPage } from "./pages/AiConversationPage";
import { MistakeBookPage } from "./pages/MistakeBookPage";
import { WeakAreaPracticePage } from "./pages/WeakAreaPracticePage";
import { DailyMissionPage } from "./pages/DailyMissionPage";
import { StudyPlanPage } from "./pages/StudyPlanPage";
import { MiniTestsPage } from "./pages/MiniTestsPage";
import { RealLifeChinesePage } from "./pages/RealLifeChinesePage";
import { ChineseCulturePage } from "./pages/ChineseCulturePage";
import { TonePitchVisualizerPage } from "./pages/TonePitchVisualizerPage";
import { AdminResourcePage } from "./pages/AdminResourcePage";
import { CommunityResourcesPage } from "./pages/CommunityResourcesPage";

export default function App() {
  const { currentPath, route } = useRouter();

  const renderCurrentRoute = () => {
    const { path, params, query } = route;

    if (path === "/" || path === "") {
      return <LandingPage />;
    }

    if (path === "/dashboard") {
      return <DashboardPage />;
    }

    if (path === "/chat" || path === "/tutor") {
      return (
        <AiTutorPage
          initialPrompt={query.q}
          initialMode={query.mode as any}
        />
      );
    }

    if (path === "/speaking") {
      return <SpeakingPracticePage />;
    }

    if (path === "/flashcards") {
      return <FlashcardPage />;
    }

    if (path === "/stories") {
      return <GradedStoriesPage />;
    }

    if (path === "/radicals") {
      return <RadicalsPage />;
    }

    if (path === "/etymology" || path === "/deconstructor") {
      return <HanziDeconstructorPage />;
    }

    if (path === "/exam") {
      return <MockExamPage />;
    }

    if (path === "/learning-path") {
      return <HskLearningPathPage />;
    }

    if (path === "/grammar") {
      return <GrammarLabPage />;
    }

    if (path === "/pinyin-lab") {
      return <PinyinLabPage />;
    }

    if (path === "/sentence-builder") {
      return <SentenceBuilderPage />;
    }

    if (path === "/dictation") {
      return <DictationLabPage />;
    }

    if (path === "/listening-lab") {
      return <ListeningLabPage />;
    }

    if (path === "/reading-lab") {
      return <ReadingLabPage />;
    }

    if (path === "/ai-conversation") {
      return <AiConversationPage />;
    }

    if (path === "/mistake-book") {
      return <MistakeBookPage />;
    }

    if (path === "/weak-areas") {
      return <WeakAreaPracticePage />;
    }

    if (path === "/daily-missions") {
      return <DailyMissionPage />;
    }

    if (path === "/study-plan") {
      return <StudyPlanPage />;
    }

    if (path === "/mini-tests") {
      return <MiniTestsPage />;
    }

    if (path === "/real-life") {
      return <RealLifeChinesePage />;
    }

    if (path === "/culture") {
      return <ChineseCulturePage />;
    }

    if (path === "/hsk") {
      return <HskLevelsPage />;
    }

    if (params.level) {
      return <HskLevelDetailPage level={params.level} />;
    }

    if (params.id) {
      return <VocabularyDetailPage id={params.id} />;
    }

    if (path === "/vocabulary") {
      return (
        <VocabularyPage
          initialQuery={query.q || ""}
          initialLevel={query.hsk || undefined}
        />
      );
    }

    if (path === "/practice") {
      return <PracticeHubPage />;
    }

    if (path === "/practice/pronunciation") {
      return <PronunciationPracticePage />;
    }

    if (path === "/practice/tones" || path === "/pitch-visualizer" || path === "/tone-visualizer") {
      return <TonePitchVisualizerPage />;
    }

    if (path === "/practice/sentences") {
      return <SentencePracticePage initialSentenceId={query.id} />;
    }

    if (params.character) {
      return <CharacterWritingDetailPage character={params.character} />;
    }

    if (path === "/writing") {
      return <WritingPage />;
    }

    if (path === "/saved") {
      return <SavedWordsPage />;
    }

    if (path === "/progress") {
      return <ProgressPage />;
    }

    if (path === "/settings") {
      return <SettingsPage />;
    }

    if (path === "/admin/resources" || path === "/admin") {
      return <AdminResourcePage />;
    }

    if (path === "/resources" || path === "/community-resources") {
      return <CommunityResourcesPage />;
    }

    if (path === "/dev/data-quality") {
      return <DataQualityPage />;
    }

    // Default fallback to Dashboard
    return <DashboardPage />;
  };

  return (
    <AppShell currentPath={currentPath}>
      {renderCurrentRoute()}
    </AppShell>
  );
}
