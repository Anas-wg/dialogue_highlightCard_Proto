import { useState } from 'react';
import { ChatRoom } from './views/ChatRoom';
import { SentenceShare } from './views/SentenceShare';
import { ConversationShare } from './views/ConversationShare';
import { ImageRender } from './views/ImageRender';
import { mockChatRoom } from './mock/chatData';
import type { ChatMessage } from './types/chat';

type Screen = 'chatroom' | 'sentenceShare' | 'conversationShare' | 'imageRender';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('chatroom');
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);

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

  const handleConversationComplete = (
    _startIndex: number,
    _endIndex: number,
    _hideMyMessages: boolean
  ) => {
    // 추후 이 데이터를 ImageRender로 전달
    setCurrentScreen('imageRender');
  };

  const handleBackToChatRoom = () => {
    setCurrentScreen('chatroom');
    setSelectedMessage(null);
  };

  if (currentScreen === 'sentenceShare' && selectedMessage) {
    return (
      <SentenceShare
        message={selectedMessage}
        avatarUrl={mockChatRoom.character.avatarUrl}
        onBack={handleBackToChatRoom}
        onNavigateToConversation={() => setCurrentScreen('conversationShare')}
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
      />
    );
  }

  if (currentScreen === 'imageRender') {
    return <ImageRender onBack={handleBackToChatRoom} />;
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
