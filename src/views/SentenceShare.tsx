import { useState } from 'react';
import { SentenceShareHeader } from '../components/share/SentenceShareHeader';
import { ShareTabBar } from '../components/share/ShareTabBar';
import { SelectableMessage } from '../components/share/SelectableMessage';
import type { ChatMessage } from '../types/chat';

interface SentenceShareProps {
  message: ChatMessage;
  avatarUrl?: string;
  onBack: () => void;
}

export function SentenceShare({ message, avatarUrl, onBack }: SentenceShareProps) {
  const [activeTab, setActiveTab] = useState<'sentence' | 'conversation'>('sentence');
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const sentences = message.content.split('\n').filter((s) => s.trim() !== '');

  const handleSelectAll = () => {
    const allIndices = new Set(sentences.map((_, i) => i));
    setSelectedIndices(allIndices);
  };

  const handleDeselectAll = () => {
    setSelectedIndices(new Set());
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdf6f6]">
      <SentenceShareHeader
        selectedCount={selectedIndices.size}
        onBack={onBack}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <ShareTabBar activeTab={activeTab} onTabChange={setActiveTab} />

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
    </div>
  );
}
