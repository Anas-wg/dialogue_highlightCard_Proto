import { useState } from 'react';
import { SentenceShareHeader } from '../components/share/SentenceShareHeader';
import { ShareTabBar } from '../components/share/ShareTabBar';
import { SelectableMessage } from '../components/share/SelectableMessage';
import type { ChatMessage } from '../types/chat';

interface SentenceShareProps {
  message: ChatMessage;
  avatarUrl?: string;
  onBack: () => void;
  onNavigateToConversation?: () => void;
  onComplete?: (selectedIndices: number[]) => void;
}

export function SentenceShare({ message, avatarUrl, onBack, onNavigateToConversation, onComplete }: SentenceShareProps) {
  const handleTabChange = (tab: 'sentence' | 'conversation') => {
    if (tab === 'conversation' && onNavigateToConversation) {
      onNavigateToConversation();
    }
  };
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const sentences = message.content.split('\n').filter((s) => s.trim() !== '');

  const handleSelectAll = () => {
    const allIndices = new Set(sentences.map((_, i) => i));
    setSelectedIndices(allIndices);
  };

  const handleDeselectAll = () => {
    setSelectedIndices(new Set());
  };

  const handleComplete = () => {
    if (selectedIndices.size > 0 && onComplete) {
      onComplete(Array.from(selectedIndices).sort((a, b) => a - b));
    }
  };

  const isSelectionComplete = selectedIndices.size > 0;

  return (
    <div className="flex flex-col h-screen bg-[#fdf6f6]">
      <SentenceShareHeader
        selectedCount={selectedIndices.size}
        onBack={onBack}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <ShareTabBar activeTab="sentence" onTabChange={handleTabChange} />

      {/* 안내 텍스트 */}
      <div className="py-8 text-center text-sm text-gray-500">
        <p>***</p>
        <p className="mt-2 font-medium text-gray-700">말풍선 안에서 공유하고 싶은 문장을 클릭하세요.</p>
        <p className="mt-1">전체 문장을 공유하고 싶다면, 우측 상단 전체 선택 버튼을 눌러주세요.</p>
        <p>다른 말풍선 내용도 공유하고 싶다면, 말풍선 공유하기 버튼을 눌러주세요</p>
        <p className="mt-2">***</p>
      </div>

      {/* 메시지 */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <SelectableMessage
          message={message}
          avatarUrl={avatarUrl}
          selectedIndices={selectedIndices}
          onSelectionChange={setSelectedIndices}
        />
      </div>

      {/* 선택 완료 버튼 */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleComplete}
          disabled={!isSelectionComplete}
          className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${
            isSelectionComplete
              ? 'bg-[#ff2e7f] hover:bg-[#e0266f]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}
