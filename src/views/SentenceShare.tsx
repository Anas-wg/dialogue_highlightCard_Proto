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
    <div className="h-screen bg-white">
      <div className="flex flex-col h-full max-w-[80%] mx-auto bg-[#fdf6f6]">
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
        <p className="mt-2 font-medium text-gray-700">탭하여 공유할 문장을 선택하세요.</p>
        <p className="mt-2">여러 말풍선을 한 번에 공유하려면 <span className="font-bold">상단의 대화 공유하기</span>를 선택하세요.</p>
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
    </div>
  );
}
