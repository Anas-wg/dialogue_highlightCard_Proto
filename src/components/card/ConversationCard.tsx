// 대화 공유 카드 - Design D (심플 모던 핑크)
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
    <div className="w-[1080px] h-[1080px] bg-[#fff8fa] flex flex-col overflow-hidden">
      {/* 상단 로고 바 */}
      <div className="shrink-0 px-10 py-6 border-b border-[#ff2e7f]/10">
        <img
          src="/figma_view/Loveydovey_logo_real.svg"
          alt="LoveyDovey"
          className="h-8 object-contain"
        />
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 px-12 py-8 space-y-8 overflow-hidden">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const isCharacter = message.sender === 'character';

          if (isUser) {
            return (
              <div key={message.id} className="flex flex-col items-end gap-2">
                <div className="max-w-[55%] px-7 py-5 rounded-2xl bg-[#ff2e7f]">
                  <p className="whitespace-pre-wrap text-white text-xl leading-relaxed">{message.content}</p>
                </div>
                <span className="text-sm text-[#ff2e7f]/40 mr-2">{formatTime(message.timestamp)}</span>
              </div>
            );
          }

          if (isCharacter) {
            return (
              <div key={message.id} className="flex gap-5">
                <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff2e7f]/20">
                  {character.avatarUrl ? (
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center text-[#ff2e7f] text-xl font-medium">
                      {character.name[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-lg font-medium text-[#ff2e7f]">{message.senderName}</span>
                  <div className="mt-2 max-w-[70%] px-7 py-5 bg-white rounded-2xl border border-[#ff2e7f]/10">
                    <p className="text-gray-700 whitespace-pre-wrap text-xl leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-[#ff2e7f]/40">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* 하단 캐릭터 정보 */}
      <div className="shrink-0 px-10 py-6 border-t border-[#ff2e7f]/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ff2e7f]/20">
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center text-[#ff2e7f] font-medium">
                {character.name[0]}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-[#ff2e7f]">{character.name}</p>
            <p className="text-sm text-[#ff2e7f]/50">LoveyDovey Character</p>
          </div>
        </div>
        <div className="text-[#ff2e7f]/60 text-sm font-medium">
          @lovey_dovey
        </div>
      </div>
    </div>
  );
}
