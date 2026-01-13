import type { CharacterInfo } from '../../types/chat';

interface SentenceCardProps {
  character: CharacterInfo;
  sentences: string[];
}

export function SentenceCard({ character, sentences }: SentenceCardProps) {
  return (
    <div
      className="w-[1080px] min-h-[1080px] p-10 flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #ffd5e5 0%, #ffffff 100%)',
      }}
    >
      {/* 로고 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#ff2e7f] flex items-center justify-center">
          <span className="text-white text-lg font-bold">L</span>
        </div>
        <span className="text-[#ff2e7f] text-xl font-semibold">LoveyDovey</span>
      </div>

      {/* 캐릭터 정보 */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-[#ff2e7f] mb-3">{character.name}</h1>
        <p className="text-xl text-[#ff2e7f] mb-4">
          {character.age} · {character.description} | {character.job}
        </p>
        <div className="flex justify-center gap-6 mb-4">
          {character.hashtags?.map((tag, index) => (
            <span key={index} className="text-lg text-[#ff2e7f]/70">#{tag}</span>
          ))}
        </div>
        <p className="text-lg text-[#ff2e7f]/80 italic">{character.quote}</p>
      </div>

      {/* 선택된 문장들 */}
      <div className="flex-1 space-y-6">
        {sentences.map((sentence, index) => (
          <div key={index} className="flex items-start gap-4">
            {/* 아바타 */}
            <div className="shrink-0 w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
              {character.avatarUrl ? (
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                  {character.name[0]}
                </div>
              )}
            </div>

            {/* 이름 + 말풍선 */}
            <div className="flex-1">
              <span className="text-base font-semibold text-gray-700">{character.name}</span>
              <div className="mt-2 px-6 py-4 bg-white rounded-2xl rounded-tl-sm shadow-sm">
                <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
                  {sentence}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
