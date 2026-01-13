import { useEffect, useRef, useState } from 'react';
import { ChatHeader } from '../components/chat/ChatHeader';
import { AffinityBar } from '../components/chat/AffinityBar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { SideModal } from '../components/modal/SideModal';
import { BottomModal } from '../components/modal/BottomModal';
import type { ChatRoomData } from '../types/chat';

interface ChatRoomProps {
  data: ChatRoomData;
  onShareMessage?: (messageId: string) => void;
  onCreateCard?: () => void;
}

export function ChatRoom({ data, onShareMessage, onCreateCard }: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [data.messages]);

  const handleMessageContextMenu = (messageId: string) => {
    console.log('Selected message ID:', messageId);
    setSelectedMessageId(messageId);
    setIsBottomModalOpen(true);
  };

  const handleShare = () => {
    if (selectedMessageId && onShareMessage) {
      setIsBottomModalOpen(false);
      onShareMessage(selectedMessageId);
    }
  };

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col h-full max-w-[80%] mx-auto bg-[#fdf6f6]">
        <ChatHeader
          characterName={data.character.name}
          coins={data.coins}
          onMenu={() => setIsMenuOpen(true)}
        />

        <AffinityBar affinity={data.affinity} />

        <div className="flex-1 overflow-y-auto">
          <div className="py-4">
          {data.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              avatarUrl={data.character.avatarUrl}
              onContextMenu={handleMessageContextMenu}
              onShare={onShareMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <SideModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onCreateCard={onCreateCard}
      />

      <BottomModal
        isOpen={isBottomModalOpen}
        onClose={() => {
          setIsBottomModalOpen(false);
          setSelectedMessageId(null);
        }}
        onShare={handleShare}
      />
      </div>
    </div>
  );
}
