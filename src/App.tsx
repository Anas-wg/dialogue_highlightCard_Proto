import { useState, useEffect } from 'react';
import { ChatRoom } from './views/ChatRoom';
import { SentenceShare } from './views/SentenceShare';
import { ConversationShare } from './views/ConversationShare';
import { MessageBalloonSelect } from './views/MessageBalloonSelect';
import { CarouselPreview } from './views/CarouselPreview';
import { SharePage } from './views/SharePage';
import { mockChatRoom } from './mock/chatData';
import { splitSentencesToCards, splitMessagesToCards } from './utils/cardSplitter';
import type { ChatMessage } from './types/chat';
import type { CardData } from './types/card';

type Screen =
  | 'chatroom'
  | 'sentenceShare'
  | 'conversationShare'
  | 'messageSelect'
  | 'carouselPreview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('chatroom');
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isSharePage, setIsSharePage] = useState(false);

  // URL 파라미터 감지: ?share=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('share') === 'true') {
      setIsSharePage(true);
    }
  }, []);

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
    // 문장 공유도 바로 CarouselPreview로 이동
    setCarouselIndex(0);
    setCurrentScreen('carouselPreview');
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

    // 메시지들을 단일 카드로 변환 (분할 없음)
    const splitCards = splitMessagesToCards(filteredMessages);

    // 각 분할된 그룹을 CardData로 변환
    const cardDataList: CardData[] = splitCards.map((cardMessages) => ({
      type: 'conversation',
      character: {
        name: mockChatRoom.character.name,
        avatarUrl: mockChatRoom.character.avatarUrl,
      },
      messages: cardMessages,
    }));

    setCards(cardDataList);
    // 대화 공유는 바로 CarouselPreview로 이동
    setCarouselIndex(0);
    setCurrentScreen('carouselPreview');
  };

  // 개별 선택 모드로 대화 공유 완료
  const handleConversationCompleteIndividual = (
    selectedIndices: number[],
    hideMyMessages: boolean
  ) => {
    // 선택된 인덱스의 메시지들만 추출
    let filteredMessages = selectedIndices.map((i) => mockChatRoom.messages[i]);

    if (hideMyMessages) {
      filteredMessages = filteredMessages.filter((m) => m.sender !== 'user');
    }

    // 메시지들을 단일 카드로 변환
    const splitCards = splitMessagesToCards(filteredMessages);

    const cardDataList: CardData[] = splitCards.map((cardMessages) => ({
      type: 'conversation',
      character: {
        name: mockChatRoom.character.name,
        avatarUrl: mockChatRoom.character.avatarUrl,
      },
      messages: cardMessages,
    }));

    setCards(cardDataList);
    setCarouselIndex(0);
    setCurrentScreen('carouselPreview');
  };

  const handleBackToChatRoom = () => {
    setCurrentScreen('chatroom');
    setSelectedMessage(null);
    setCards([]);
    setCarouselIndex(0);
  };

  // 대화 공유 CarouselPreview에서 뒤로가기 (재선택)
  const handleBackFromConversationCarousel = () => {
    setCurrentScreen('conversationShare');
    setCards([]);
  };

  // 문장 공유 CarouselPreview에서 뒤로가기 (SentenceShare로)
  const handleBackFromSentenceCarousel = () => {
    setCurrentScreen('sentenceShare');
    setCards([]);
  };

  // 공유 페이지 (URL 파라미터로 진입)
  if (isSharePage) {
    return <SharePage />;
  }

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
        onCompleteIndividual={handleConversationCompleteIndividual}
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

  if (currentScreen === 'carouselPreview' && cards.length > 0) {
    const isConversationCard = cards[0]?.type === 'conversation';
    return (
      <CarouselPreview
        cards={cards}
        initialIndex={carouselIndex}
        onBack={isConversationCard ? handleBackFromConversationCarousel : handleBackFromSentenceCarousel}
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
