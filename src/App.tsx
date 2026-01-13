import { useState } from 'react';
import { ChatRoom } from './views/ChatRoom';
import { SentenceShare } from './views/SentenceShare';
import { ConversationShare } from './views/ConversationShare';
import { MessageBalloonSelect } from './views/MessageBalloonSelect';
import { GridPreview } from './views/GridPreview';
import { CarouselPreview } from './views/CarouselPreview';
import { ShareModal } from './components/modal/ShareModal';
import { mockChatRoom } from './mock/chatData';
import { splitSentencesToCards } from './utils/cardSplitter';
import type { ChatMessage } from './types/chat';
import type { CardData } from './types/card';

type Screen =
  | 'chatroom'
  | 'sentenceShare'
  | 'conversationShare'
  | 'messageSelect'
  | 'gridPreview'
  | 'carouselPreview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('chatroom');
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShareMessage = (messageId: string) => {
    const message = mockChatRoom.messages.find((m) => m.id === messageId);
    if (message) {
      setSelectedMessage(message);
      setCurrentScreen('sentenceShare');
    }
  };

  const handleCreateCard = () => {
    setCurrentScreen('conversationShare');
  };

  const handleSentenceComplete = (selectedIndices: number[]) => {
    if (!selectedMessage) return;

    const sentences = selectedMessage.content
      .split('\n')
      .filter((s) => s.trim() !== '');

    const selectedSentences = selectedIndices.map((i) => sentences[i]);

    // 문장들을 카드별로 분할
    const splitCards = splitSentencesToCards(selectedSentences);

    // 각 분할된 그룹을 CardData로 변환
    const cardDataList: CardData[] = splitCards.map((cardSentences) => ({
      type: 'sentence',
      character: mockChatRoom.character,
      sentences: cardSentences,
    }));

    setCards(cardDataList);
    setCurrentScreen('gridPreview');
  };

  const handleConversationComplete = (
    startIndex: number,
    endIndex: number,
    hideMyMessages: boolean
  ) => {
    let filteredMessages = mockChatRoom.messages.slice(startIndex, endIndex + 1);

    if (hideMyMessages) {
      filteredMessages = filteredMessages.filter((m) => m.sender !== 'user');
    }

    const cardData: CardData = {
      type: 'conversation',
      character: {
        name: mockChatRoom.character.name,
        avatarUrl: mockChatRoom.character.avatarUrl,
      },
      messages: filteredMessages,
    };

    setCards([cardData]);
    setCurrentScreen('gridPreview');
  };

  const handleBackToChatRoom = () => {
    setCurrentScreen('chatroom');
    setSelectedMessage(null);
    setCards([]);
    setCarouselIndex(0);
  };

  const handleBackToGrid = () => {
    setCurrentScreen('gridPreview');
  };

  const handleCardTap = (index: number) => {
    setCarouselIndex(index);
    setCurrentScreen('carouselPreview');
  };

  const handleDownloadComplete = () => {
    setShowShareModal(true);
  };

  if (currentScreen === 'sentenceShare' && selectedMessage) {
    return (
      <SentenceShare
        message={selectedMessage}
        avatarUrl={mockChatRoom.character.avatarUrl}
        onBack={handleBackToChatRoom}
        onNavigateToConversation={() => setCurrentScreen('conversationShare')}
        onComplete={handleSentenceComplete}
      />
    );
  }

  if (currentScreen === 'conversationShare') {
    return (
      <ConversationShare
        messages={mockChatRoom.messages}
        avatarUrl={mockChatRoom.character.avatarUrl}
        onBack={handleBackToChatRoom}
        onComplete={handleConversationComplete}
        onNavigateToSentence={() => setCurrentScreen('messageSelect')}
      />
    );
  }

  if (currentScreen === 'messageSelect') {
    return (
      <MessageBalloonSelect
        messages={mockChatRoom.messages}
        avatarUrl={mockChatRoom.character.avatarUrl}
        onBack={handleBackToChatRoom}
        onSelectMessage={(message) => {
          setSelectedMessage(message);
          setCurrentScreen('sentenceShare');
        }}
        onNavigateToConversation={() => setCurrentScreen('conversationShare')}
      />
    );
  }

  if (currentScreen === 'gridPreview' && cards.length > 0) {
    return (
      <>
        <GridPreview
          cards={cards}
          onBack={handleBackToChatRoom}
          onCardTap={handleCardTap}
          onDownloadComplete={handleDownloadComplete}
        />
        <ShareModal
          isOpen={showShareModal}
          shareUrl={mockChatRoom.character.shareUrl || ''}
          onClose={() => setShowShareModal(false)}
        />
      </>
    );
  }

  if (currentScreen === 'carouselPreview' && cards.length > 0) {
    return (
      <CarouselPreview
        cards={cards}
        initialIndex={carouselIndex}
        onBack={handleBackToGrid}
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
