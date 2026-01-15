import { useState, useRef } from 'react';
import { ConversationShareHeader } from '../components/share/ConversationShareHeader';
import { IndividualSelectConversation } from '../components/share/IndividualSelectConversation';
import { ConversationCard } from '../components/card/ConversationCard';
import { useImageGenerator } from '../hooks/useImageGenerator';
import { saveShareData, createShareUrl } from '../utils/shareStorage';
import { mockCurrentUser } from '../mock/userData';
import type { ChatMessage } from '../types/chat';

interface ConversationShareProps {
  messages: ChatMessage[];
  avatarUrl?: string;
  characterName: string;
  onBack: () => void;
  onComplete: () => void;
}

export function ConversationShare({
  messages,
  avatarUrl,
  characterName,
  onBack,
  onComplete,
}: ConversationShareProps) {
  const [hideMyMessages, setHideMyMessages] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { generateImage, downloadImage } = useImageGenerator();

  // 선택된 메시지들 (필터링 적용)
  const getFilteredMessages = (): ChatMessage[] => {
    const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
    let filtered = sortedIndices.map((i) => messages[i]);

    if (hideMyMessages) {
      filtered = filtered.filter((m) => m.sender !== 'user');
    }

    return filtered;
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
    let count = 0;
    for (const index of selectedIndices) {
      if (hideMyMessages && messages[index].sender === 'user') continue;
      count++;
    }
    return count;
  })();

  const handleSelectAll = () => {
    const allIndices = new Set(messages.map((_, i) => i));
    setSelectedIndices(allIndices);
  };

  const handleDeselectAll = () => {
    setSelectedIndices(new Set());
  };

  const handleComplete = async () => {
    if (selectedIndices.size === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      const filteredMessages = getFilteredMessages();
      const character = { name: characterName, avatarUrl };

      // 약간의 딜레이 후 이미지 생성 (렌더링 대기)
      await new Promise(resolve => setTimeout(resolve, 100));

      // 이미지 생성 및 다운로드
      if (cardRef.current) {
        const dataUrl = await generateImage(cardRef.current);
        if (dataUrl) {
          downloadImage(dataUrl, 'highlight_card.png');
        }
      }

      // localStorage에 저장하고 새 탭에서 공유 페이지 열기
      saveShareData(character, filteredMessages, mockCurrentUser.id);
      const shareUrl = createShareUrl();
      window.open(shareUrl, '_blank');

      // 완료 콜백 (모달 표시)
      onComplete();
    } finally {
      setIsProcessing(false);
    }
  };

  const isSelectionComplete = selectedIndices.size > 0;
  const filteredMessages = getFilteredMessages();

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col h-full max-w-[80%] mx-auto bg-[#fdf6f6]">
        <ConversationShareHeader
          selectedCount={selectedCount}
          onBack={onBack}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />

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
          <p className="mt-2 font-medium text-gray-700">공유할 말풍선을 개별적으로 선택하세요.</p>
          <p className="mt-1 text-gray-500">원하는 말풍선을 클릭하면 선택/해제됩니다.</p>
          <p className="mt-4">전체 대화를 공유하려면 우측 상단의 <span className="font-bold">'전체 선택'</span>을 누르세요.</p>
          <p className="mt-2">***</p>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto">
          <IndividualSelectConversation
            messages={messages}
            avatarUrl={avatarUrl}
            selectedIndices={selectedIndices}
            hideMyMessages={hideMyMessages}
            onToggleSelect={handleToggleSelect}
          />
        </div>

        {/* 선택 완료 버튼 */}
        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleComplete}
            disabled={!isSelectionComplete || isProcessing}
            className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${
              isSelectionComplete && !isProcessing
                ? 'bg-[#ff2e7f] hover:bg-[#e0266f]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isProcessing ? '처리 중...' : '선택 완료'}
          </button>
        </div>
      </div>

      {/* 숨겨진 카드 렌더링 영역 (이미지 생성용) */}
      {filteredMessages.length > 0 && (
        <div className="fixed" style={{ left: -9999, top: 0 }}>
          <div ref={cardRef} style={{ width: 1080 }}>
            <ConversationCard
              character={{ name: characterName, avatarUrl }}
              messages={filteredMessages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
