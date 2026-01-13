import type { CharacterInfo } from '../../types/chat';

interface SentenceCardProps {
  character: CharacterInfo;
  sentences: string[];
}

export function SentenceCard({ character, sentences }: SentenceCardProps) {
  return (
    <div
      className="w-[1080px] h-[1080px] pt-10 px-10 pb-5 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffd5e5 0%, #ffffff 100%)',
      }}
    >
      {/* 로고 */}
      <div className="shrink-0 mb-6">
        <img
          src="/figma_view/Loveydovey_logo_real.svg"
          alt="LoveyDovey"
          className="h-10 object-contain"
        />
      </div>

      {/* 캐릭터 정보 */}
      <div className="shrink-0 text-center mb-8">
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
      <div className="flex-1 space-y-8 overflow-hidden">
        {sentences.map((sentence, index) => (
          <div key={index} className="flex items-start gap-5">
            {/* 아바타 */}
            <div className="shrink-0 w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-md">
              {character.avatarUrl ? (
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                  {character.name[0]}
                </div>
              )}
            </div>

            {/* 이름 + 말풍선 */}
            <div className="flex-1">
              <span className="text-lg font-semibold text-gray-700">{character.name}</span>
              <div className="mt-2 px-8 py-5 bg-white rounded-2xl rounded-tl-sm shadow-md">
                <p className="text-gray-800 whitespace-pre-wrap text-xl leading-relaxed">
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
