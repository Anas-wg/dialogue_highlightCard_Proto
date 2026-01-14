import { useState } from 'react';
import { ConversationShareHeader } from '../components/share/ConversationShareHeader';
import { ShareTabBar } from '../components/share/ShareTabBar';
import { SelectableConversation } from '../components/share/SelectableConversation';
import type { ChatMessage } from '../types/chat';

interface ConversationShareProps {
  messages: ChatMessage[];
  avatarUrl?: string;
  onBack: () => void;
  onComplete: (startIndex: number, endIndex: number, hideMyMessages: boolean) => void;
  onNavigateToSentence?: () => void;
}

export function ConversationShare({
  messages,
  avatarUrl,
  onBack,
  onComplete,
  onNavigateToSentence,
}: ConversationShareProps) {
  const [activeTab, setActiveTab] = useState<'sentence' | 'conversation'>('conversation');

  const handleTabChange = (tab: 'sentence' | 'conversation') => {
    if (tab === 'sentence' && onNavigateToSentence) {
      onNavigateToSentence();
    } else {
      setActiveTab(tab);
    }
  };
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);
  const [hideMyMessages, setHideMyMessages] = useState(false);

  const selectedCount = (() => {
    if (startIndex === null) return 0;
    if (endIndex === null) {
      const msg = messages[startIndex];
      if (hideMyMessages && msg.sender === 'user') return 0;
      return 1;
    }
    let count = 0;
    for (let i = startIndex; i <= endIndex; i++) {
      if (hideMyMessages && messages[i].sender === 'user') continue;
      count++;
    }
    return count;
  })();

  const handleSelectAll = () => {
    setStartIndex(0);
    setEndIndex(messages.length - 1);
  };

  const handleDeselectAll = () => {
    setStartIndex(null);
    setEndIndex(null);
  };

  const handleMessageClick = (index: number) => {
    if (startIndex === null) {
      // 첫 번째 클릭: 시작 설정
      setStartIndex(index);
      setEndIndex(null);
    } else if (endIndex === null) {
      // 두 번째 클릭
      if (index < startIndex) {
        // 시작보다 앞: 새로운 시작으로 변경
        setStartIndex(index);
      } else if (index > startIndex) {
        // 시작보다 뒤: 종료로 설정
        setEndIndex(index);
      }
      // 같은 위치 클릭: 무시
    } else {
      // 이미 범위가 설정된 경우: 새로운 시작으로 리셋
      setStartIndex(index);
      setEndIndex(null);
    }
  };

  const handleComplete = () => {
    if (startIndex !== null && endIndex !== null) {
      onComplete(startIndex, endIndex, hideMyMessages);
    }
  };

  const isSelectionComplete = startIndex !== null && endIndex !== null;

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col h-full max-w-[80%] mx-auto bg-[#fdf6f6]">
        <ConversationShareHeader
        selectedCount={selectedCount}
        onBack={onBack}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <ShareTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 내 대사 가리기 옵션 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-700">내 대사 가리기</span>
        <button
          onClick={() => setHideMyMessages(!hideMyMessages)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            hideMyMessages ? 'bg-[#ff2e7f]' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              hideMyMessages ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* 안내 텍스트 */}
      <div className="py-8 text-center text-sm text-gray-500">
        <p>***</p>
        <p className="mt-2 font-medium text-gray-700">시작 말풍선과 종료 말풍선을 선택하세요.</p>
        <p className="mt-1">전체 대화를 공유하고 싶다면, 우측 상단 전체 선택 버튼을 눌러주세요.</p>
        <p>특정 문장만 공유하고 싶다면, <span className="font-bold">상단의 문장 공유하기</span>를 눌러주세요</p>
        <p className="mt-2">***</p>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto">
        <SelectableConversation
          messages={messages}
          avatarUrl={avatarUrl}
          startIndex={startIndex}
          endIndex={endIndex}
          hideMyMessages={hideMyMessages}
          onMessageClick={handleMessageClick}
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
