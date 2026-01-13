import type { ChatMessage } from '../../types/chat';

interface SelectableConversationProps {
  messages: ChatMessage[];
  avatarUrl?: string;
  startIndex: number | null;
  endIndex: number | null;
  hideMyMessages: boolean;
  onMessageClick: (index: number) => void;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function SelectableConversation({
  messages,
  avatarUrl,
  startIndex,
  endIndex,
  hideMyMessages,
  onMessageClick,
}: SelectableConversationProps) {
  const isInRange = (index: number) => {
    if (startIndex === null) return false;
    if (endIndex === null) return index === startIndex;
    return index >= startIndex && index <= endIndex;
  };

  return (
    <div className="py-4">
      {messages.map((message, index) => {
        const isUser = message.sender === 'user';
        const isCharacter = message.sender === 'character';
        const isStart = index === startIndex;
        const isEnd = index === endIndex;
        const inRange = isInRange(index);

        if (isUser) {
          if (hideMyMessages) {
            return null;
          }
          return (
            <div
              key={message.id}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${
                inRange ? 'bg-[#ffd5e5]/30' : 'hover:bg-gray-100'
              }`}
              onClick={() => onMessageClick(index)}
            >
              <div className="flex-1 flex flex-col items-end gap-1">
                <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-sm bg-[#ff2e7f]/20">
                  <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
              </div>
              {(isStart || isEnd) && (
                <div
                  className="shrink-0 px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: '#ff2e7f' }}
                >
                  {isStart ? '시작' : '종료'}
                </div>
              )}
            </div>
          );
        }

        if (isCharacter) {
          return (
            <div
              key={message.id}
              className={`flex items-start gap-2 px-4 py-2 cursor-pointer transition-colors ${
                inRange ? 'bg-[#ffd5e5]/30' : 'hover:bg-gray-100'
              }`}
              onClick={() => onMessageClick(index)}
            >
              {(isStart || isEnd) && (
                <div
                  className="shrink-0 px-2 py-1 rounded text-xs font-medium text-white self-center"
                  style={{ backgroundColor: '#ff2e7f' }}
                >
                  {isStart ? '시작' : '종료'}
                </div>
              )}
              <div className="flex gap-3 flex-1">
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

                  <div className="mt-1 text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
