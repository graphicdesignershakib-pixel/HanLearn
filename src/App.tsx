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
import { AuthProtectedGate } from "./components/auth/AuthProtectedGate";

export default function App() {
  const { currentPath, route } = useRouter();

  const renderCurrentRoute = () => {
    const { path, params, query } = route;

    if (path === "/" || path === "") {
      return <LandingPage />;
    }

    if (path === "/admin/resources" || path === "/admin") {
      return (
        <AuthProtectedGate requireAdmin>
          <AdminResourcePage />
        </AuthProtectedGate>
      );
    }

    let pageContent: React.ReactNode;

    if (path === "/dashboard") {
      pageContent = <DashboardPage />;
    } else if (path === "/chat" || path === "/tutor") {
      pageContent = (
        <AiTutorPage
          initialPrompt={query.q}
          initialMode={query.mode as any}
        />
      );
    } else if (path === "/speaking") {
      pageContent = <SpeakingPracticePage />;
    } else if (path === "/flashcards") {
      pageContent = <FlashcardPage />;
    } else if (path === "/stories") {
      pageContent = <GradedStoriesPage />;
    } else if (path === "/radicals") {
      pageContent = <RadicalsPage />;
    } else if (path === "/etymology" || path === "/deconstructor") {
      pageContent = <HanziDeconstructorPage />;
    } else if (path === "/exam") {
      pageContent = <MockExamPage />;
    } else if (path === "/learning-path") {
      pageContent = <HskLearningPathPage />;
    } else if (path === "/grammar") {
      pageContent = <GrammarLabPage />;
    } else if (path === "/pinyin-lab") {
      pageContent = <PinyinLabPage />;
    } else if (path === "/sentence-builder") {
      pageContent = <SentenceBuilderPage />;
    } else if (path === "/dictation") {
      pageContent = <DictationLabPage />;
    } else if (path === "/listening-lab") {
      pageContent = <ListeningLabPage />;
    } else if (path === "/reading-lab") {
      pageContent = <ReadingLabPage />;
    } else if (path === "/ai-conversation") {
      pageContent = <AiConversationPage />;
    } else if (path === "/mistake-book") {
      pageContent = <MistakeBookPage />;
    } else if (path === "/weak-areas") {
      pageContent = <WeakAreaPracticePage />;
    } else if (path === "/daily-missions") {
      pageContent = <DailyMissionPage />;
    } else if (path === "/study-plan") {
      pageContent = <StudyPlanPage />;
    } else if (path === "/mini-tests") {
      pageContent = <MiniTestsPage />;
    } else if (path === "/real-life") {
      pageContent = <RealLifeChinesePage />;
    } else if (path === "/culture") {
      pageContent = <ChineseCulturePage />;
    } else if (path === "/hsk") {
      pageContent = <HskLevelsPage />;
    } else if (params.level) {
      pageContent = <HskLevelDetailPage level={params.level} />;
    } else if (params.id) {
      pageContent = <VocabularyDetailPage id={params.id} />;
    } else if (path === "/vocabulary") {
      pageContent = (
        <VocabularyPage
          initialQuery={query.q || ""}
          initialLevel={query.hsk || undefined}
        />
      );
    } else if (path === "/practice") {
      pageContent = <PracticeHubPage />;
    } else if (path === "/practice/pronunciation") {
      pageContent = <PronunciationPracticePage />;
    } else if (path === "/practice/tones" || path === "/pitch-visualizer" || path === "/tone-visualizer") {
      pageContent = <TonePitchVisualizerPage />;
    } else if (path === "/practice/sentences") {
      pageContent = <SentencePracticePage initialSentenceId={query.id} />;
    } else if (params.character) {
      pageContent = <CharacterWritingDetailPage character={params.character} />;
    } else if (path === "/writing") {
      pageContent = <WritingPage />;
    } else if (path === "/saved") {
      pageContent = <SavedWordsPage />;
    } else if (path === "/progress") {
      pageContent = <ProgressPage />;
    } else if (path === "/settings") {
      pageContent = <SettingsPage />;
    } else if (path === "/resources" || path === "/community-resources") {
      pageContent = <CommunityResourcesPage />;
    } else if (path === "/dev/data-quality") {
      pageContent = <DataQualityPage />;
    } else {
      pageContent = <DashboardPage />;
    }

    return <AuthProtectedGate>{pageContent}</AuthProtectedGate>;
  };

  return (
    <AppShell currentPath={currentPath}>
      {renderCurrentRoute()}
    </AppShell>
  );
}
