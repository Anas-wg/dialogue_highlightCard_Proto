import { useState, useEffect } from 'react';
import { ChatRoom } from './views/ChatRoom';
import { ConversationShare } from './views/ConversationShare';
import { Preview } from './views/Preview';
import { SharePage } from './views/SharePage';
import { CompletionModal } from './components/modal/CompletionModal';
import { mockChatRoom } from './mock/chatData';
import type { CardData } from './types/card';

type Screen =
  | 'chatroom'
  | 'conversationShare'
  | 'preview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('chatroom');
  const [cards, setCards] = useState<CardData[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
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
  const handleConversationComplete = (cardData: CardData) => {
    setCards([cardData]);
    setCarouselIndex(0);
    setShowCompletionModal(true);
  };

  const handleBackToChatRoom = () => {
    setCurrentScreen('chatroom');
    setCards([]);
    setCarouselIndex(0);
    setShowCompletionModal(false);
  };

  // CarouselPreview에서 뒤로가기 (재선택)
  const handleBackFromCarousel = () => {
    setCurrentScreen('conversationShare');
    setCards([]);
  };

  // 모달에서 "결과물 보기" 클릭
  const handleViewResult = () => {
    setShowCompletionModal(false);
    setCurrentScreen('preview');
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
          onViewResult={handleViewResult}
        />
      </>
    );
  }

  if (currentScreen === 'preview' && cards.length > 0) {
    return (
      <Preview
        cards={cards}
        initialIndex={carouselIndex}
        onBack={handleBackFromCarousel}
        onBackToHome={handleBackToChatRoom}
      />
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
