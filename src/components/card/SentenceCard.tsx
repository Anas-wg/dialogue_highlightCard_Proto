import type { CharacterInfo } from '../../types/chat';

interface SentenceCardProps {
  character: CharacterInfo;
  sentences: string[];
}

export function SentenceCard({ character, sentences }: SentenceCardProps) {
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden">
      {/* 배경 이미지 */}
      {character.avatarUrl && (
        <img
          src={character.avatarUrl}
          alt={character.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* 대각선 그라데이션 오버레이: 좌상단 검정 → 우하단 투명 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col p-12">
        {/* 상단 로고 영역 */}
        <div className="shrink-0 flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#ff2e7f]" />
            <span className="text-white text-2xl font-semibold">{character.name}</span>
          </div>
          <img
            src="/figma_view/Loveydovey_logo_real.svg"
            alt="LoveyDovey"
            className="h-8 object-contain brightness-0 invert"
          />
        </div>

        {/* 문장들 - 세로 중앙 정렬 */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-8">
            {sentences.map((sentence, index) => (
              <p
                key={index}
                className="text-white text-3xl leading-relaxed font-medium whitespace-pre-wrap"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {sentence}
              </p>
            ))}
          </div>
        </div>

        {/* 하단 캐릭터 정보 */}
        <div className="shrink-0 mt-12">
          <p className="text-white/60 text-lg">
            {character.description} | {character.job}
          </p>
        </div>
      </div>
    </div>
  );
}
