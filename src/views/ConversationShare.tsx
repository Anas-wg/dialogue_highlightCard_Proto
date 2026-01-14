import { useState } from 'react';
import { ConversationShareHeader } from '../components/share/ConversationShareHeader';
import { ShareTabBar } from '../components/share/ShareTabBar';
import { SelectionModeToggle, type SelectionMode } from '../components/share/SelectionModeToggle';
import { SelectableConversation } from '../components/share/SelectableConversation';
import { IndividualSelectConversation } from '../components/share/IndividualSelectConversation';
import type { ChatMessage } from '../types/chat';

interface ConversationShareProps {
  messages: ChatMessage[];
  avatarUrl?: string;
  onBack: () => void;
  onComplete: (startIndex: number, endIndex: number, hideMyMessages: boolean) => void;
  onCompleteIndividual?: (selectedIndices: number[], hideMyMessages: boolean) => void;
  onNavigateToSentence?: () => void;
}

export function ConversationShare({
  messages,
  avatarUrl,
  onBack,
  onComplete,
  onCompleteIndividual,
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
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('capture');
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // 모드 변경 시 선택 초기화
  const handleModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setStartIndex(null);
    setEndIndex(null);
    setSelectedIndices(new Set());
  };

  // 개별 선택 토글
  const handleToggleSelect = (index: number) => {
    setSelectedIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectedCount = (() => {
    if (selectionMode === 'individual') {
      // 개별 선택 모드
      let count = 0;
      for (const index of selectedIndices) {
        if (hideMyMessages && messages[index].sender === 'user') continue;
        count++;
      }
      return count;
    }
    // 캡처 방식
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
    if (selectionMode === 'capture') {
      setStartIndex(0);
      setEndIndex(messages.length - 1);
    } else {
      // 개별 선택: 모든 인덱스 선택
      const allIndices = new Set(messages.map((_, i) => i));
      setSelectedIndices(allIndices);
    }
  };

  const handleDeselectAll = () => {
    if (selectionMode === 'capture') {
      setStartIndex(null);
      setEndIndex(null);
    } else {
      setSelectedIndices(new Set());
    }
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
    if (selectionMode === 'capture') {
      if (startIndex !== null && endIndex !== null) {
        onComplete(startIndex, endIndex, hideMyMessages);
      }
    } else {
      if (selectedIndices.size > 0 && onCompleteIndividual) {
        const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
        onCompleteIndividual(sortedIndices, hideMyMessages);
      }
    }
  };

  const isSelectionComplete = selectionMode === 'capture'
    ? startIndex !== null && endIndex !== null
    : selectedIndices.size > 0;

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

      {/* 선택 방식 토글 */}
      <SelectionModeToggle mode={selectionMode} onModeChange={handleModeChange} />

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
        {selectionMode === 'capture' ? (
          <>
            <p className="mt-2 font-medium text-gray-700">공유할 대화의 시작과 끝을 순서대로 선택하세요.</p>
            <p className="mt-1 text-gray-500">먼저 시작 말풍선을, 다음으로 종료 말풍선을 선택해요.</p>
            <p className="mt-4">전체 대화를 공유하려면 우측 상단의 <span className="font-bold">'전체 선택'</span>을 누르세요.</p>
          </>
        ) : (
          <>
            <p className="mt-2 font-medium text-gray-700">공유할 말풍선을 개별적으로 선택하세요.</p>
            <p className="mt-1 text-gray-500">원하는 말풍선을 클릭하면 선택/해제됩니다.</p>
            <p className="mt-4">전체 대화를 공유하려면 우측 상단의 <span className="font-bold">'전체 선택'</span>을 누르세요.</p>
          </>
        )}
        <p className="mt-1">일부 문장만 공유하려면 상단의 <span className="font-bold">'문장 공유하기'</span>를 선택하세요.</p>
        <p className="mt-2">***</p>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto">
        {selectionMode === 'capture' ? (
          <SelectableConversation
            messages={messages}
            avatarUrl={avatarUrl}
            startIndex={startIndex}
            endIndex={endIndex}
            hideMyMessages={hideMyMessages}
            onMessageClick={handleMessageClick}
          />
        ) : (
          <IndividualSelectConversation
            messages={messages}
            avatarUrl={avatarUrl}
            selectedIndices={selectedIndices}
            hideMyMessages={hideMyMessages}
            onToggleSelect={handleToggleSelect}
          />
        )}
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
