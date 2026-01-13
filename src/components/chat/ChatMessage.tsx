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

          <div className="mt-1 max-w-[85%] px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <span>{formatTime(message.timestamp)}</span>
            <button
              onClick={handleShare}
              className="hover:text-[#ff2e7f] transition-colors"
              aria-label="공유"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
