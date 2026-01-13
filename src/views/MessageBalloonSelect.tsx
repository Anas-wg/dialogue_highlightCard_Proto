import { MessageBalloonSelectHeader } from '../components/share/MessageBalloonSelectHeader';
import { ShareTabBar } from '../components/share/ShareTabBar';
import { ClickableConversation } from '../components/share/ClickableConversation';
import type { ChatMessage } from '../types/chat';

interface MessageBalloonSelectProps {
  messages: ChatMessage[];
  avatarUrl?: string;
  onBack: () => void;
  onSelectMessage: (message: ChatMessage) => void;
  onNavigateToConversation: () => void;
}

export function MessageBalloonSelect({
  messages,
  avatarUrl,
  onBack,
  onSelectMessage,
  onNavigateToConversation,
}: MessageBalloonSelectProps) {
  const handleTabChange = (tab: 'sentence' | 'conversation') => {
    if (tab === 'conversation') {
      onNavigateToConversation();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdf6f6]">
      <MessageBalloonSelectHeader onBack={onBack} />

      <ShareTabBar activeTab="sentence" onTabChange={handleTabChange} />

      {/* 안내 텍스트 */}
      <div className="py-8 text-center text-sm text-gray-500">
        <p>***</p>
        <p className="mt-2 font-medium text-gray-700">공유하고 싶은 문장이 있는 말풍선을 선택하세요.</p>
        <p className="mt-2">***</p>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto">
        <ClickableConversation
          messages={messages}
          avatarUrl={avatarUrl}
          onMessageClick={onSelectMessage}
        />
      </div>
    </div>
  );
}
