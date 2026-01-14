import type { ChatMessage } from '../../types/chat';

interface IndividualSelectConversationProps {
  messages: ChatMessage[];
  avatarUrl?: string;
  selectedIndices: Set<number>;
  hideMyMessages: boolean;
  onToggleSelect: (index: number) => void;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function IndividualSelectConversation({
  messages,
  avatarUrl,
  selectedIndices,
  hideMyMessages,
  onToggleSelect,
}: IndividualSelectConversationProps) {
  return (
    <div className="py-4">
      {messages.map((message, index) => {
        const isUser = message.sender === 'user';
        const isCharacter = message.sender === 'character';
        const isSelected = selectedIndices.has(index);

        if (isUser) {
          if (hideMyMessages) {
            return null;
          }
          return (
            <div
              key={message.id}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${
                isSelected ? 'bg-[#ffd5e5]/30' : 'hover:bg-gray-100'
              }`}
              onClick={() => onToggleSelect(index)}
            >
              <div className="flex-1 flex flex-col items-end gap-1">
                <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-sm bg-[#ff2e7f]/20">
                  <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
              </div>
              {/* 체크박스 */}
              <div
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#ff2e7f] border-[#ff2e7f]'
                    : 'bg-white border-gray-300'
                }`}
              >
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          );
        }

        if (isCharacter) {
          return (
            <div
              key={message.id}
              className={`flex items-start gap-2 px-4 py-2 cursor-pointer transition-colors ${
                isSelected ? 'bg-[#ffd5e5]/30' : 'hover:bg-gray-100'
              }`}
              onClick={() => onToggleSelect(index)}
            >
              {/* 체크박스 */}
              <div
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors self-center ${
                  isSelected
                    ? 'bg-[#ff2e7f] border-[#ff2e7f]'
                    : 'bg-white border-gray-300'
                }`}
              >
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
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
