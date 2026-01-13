import type { ChatMessage } from '../../types/chat';

interface ConversationCardProps {
  character: { name: string; avatarUrl?: string };
  messages: ChatMessage[];
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function ConversationCard({ character, messages }: ConversationCardProps) {
  return (
    <div
      className="w-[1080px] min-h-[1080px] p-8 flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #ffd5e5 0%, #ffffff 100%)',
      }}
    >
      {/* 헤더: 아바타 + 이름 + 로고 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                {character.name[0]}
              </div>
            )}
          </div>
          <span className="font-medium text-gray-800">{character.name}</span>
        </div>

        {/* 로고 */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#ff2e7f] flex items-center justify-center">
            <span className="text-white text-xs">L</span>
          </div>
          <span className="text-[#ff2e7f] font-medium">LoveyDovey</span>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 space-y-4">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const isCharacter = message.sender === 'character';

          if (isUser) {
            return (
              <div key={message.id} className="flex flex-col items-end gap-1">
                <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-sm bg-[#ff2e7f]/20">
                  <p className="whitespace-pre-wrap text-gray-800 text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
              </div>
            );
          }

          if (isCharacter) {
            return (
              <div key={message.id} className="flex gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {character.avatarUrl ? (
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      {character.name[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700">{message.senderName}</span>
                  <div className="mt-1 max-w-[85%] px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
