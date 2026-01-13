import { useState } from 'react';
import { ChatRoom } from './views/ChatRoom';
import { SentenceShare } from './views/SentenceShare';
import { mockChatRoom } from './mock/chatData';
import type { ChatMessage } from './types/chat';

type Screen = 'chatroom' | 'sentenceShare';

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
      />
    );
  }

  return (
    <ChatRoom
      data={mockChatRoom}
      onShareMessage={handleShareMessage}
    />
  );
}

export default App;
