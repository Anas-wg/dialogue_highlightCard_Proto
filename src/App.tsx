import { useState, useEffect } from 'react';
import { ChatRoom } from './views/ChatRoom';
import { ConversationShare } from './views/ConversationShare';
import { SharePage } from './views/SharePage';
import { CompletionModal } from './components/modal/CompletionModal';
import { mockChatRoom } from './mock/chatData';

type Screen = 'chatroom' | 'conversationShare';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('chatroom');
  const [isSharePage, setIsSharePage] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // URL 파라미터 감지: ?share=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('share') === 'true') {
      setIsSharePage(true);
    }
  }, []);

  const handleShareMessage = () => {
    setCurrentScreen('conversationShare');
  };

  const handleCreateCard = () => {
    setCurrentScreen('conversationShare');
  };

  // ConversationShare에서 이미지 생성/저장/공유 완료 후 호출
  const handleConversationComplete = () => {
    setShowCompletionModal(true);
  };

  const handleBackToChatRoom = () => {
    setCurrentScreen('chatroom');
    setShowCompletionModal(false);
  };

  // 모달에서 "다시 선택하기" 클릭
  const handleReselect = () => {
    setShowCompletionModal(false);
    // conversationShare 화면에 그대로 남아있음
  };

  // 공유 페이지 (URL 파라미터로 진입)
  if (isSharePage) {
    return <SharePage />;
  }

  if (currentScreen === 'conversationShare') {
    return (
      <>
        <ConversationShare
          messages={mockChatRoom.messages}
          avatarUrl={mockChatRoom.character.avatarUrl}
          characterName={mockChatRoom.character.name}
          onBack={handleBackToChatRoom}
          onComplete={handleConversationComplete}
        />
        <CompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          onBackToChat={handleBackToChatRoom}
          onReselect={handleReselect}
        />
      </>
    );
  }

  return (
    <ChatRoom
      data={mockChatRoom}
      onShareMessage={handleShareMessage}
      onCreateCard={handleCreateCard}
    />
  );
}

export default App;
