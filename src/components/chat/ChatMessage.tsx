import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  avatarUrl?: string;
  onContextMenu?: (messageId: string) => void;
  onShare?: (messageId: string) => void;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function ChatMessage({ message, avatarUrl, onContextMenu, onShare }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const isCharacter = message.sender === 'character';

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(message.id);
  };

  const handleShare = () => {
    onShare?.(message.id);
  };

  if (isUser) {
    return (
      <div
        className="flex flex-col items-end gap-1 px-4 py-2"
        onContextMenu={handleContextMenu}
      >
        <div className="max-w-[70%] px-4 py-3 bg-[#ff2e7f]/20 rounded-2xl rounded-br-sm">
          <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
      </div>
    );
  }

  if (isCharacter) {
    return (
      <div
        className="flex gap-3 px-4 py-2"
        onContextMenu={handleContextMenu}
      >
        <div className="shrink-0 w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={message.senderName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              {message.senderName[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-700">{message.senderName}</span>

          <div className="relative mt-1 max-w-[85%] px-4 py-3 pb-8 bg-white rounded-2xl rounded-tl-sm shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            <button
              onClick={handleShare}
              className="absolute bottom-2 right-3 text-xs text-[#ff2e7f]/70 hover:text-[#ff2e7f] transition-colors font-medium"
            >
              공유하기
            </button>
          </div>

          <div className="mt-1 text-xs text-gray-400">
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
