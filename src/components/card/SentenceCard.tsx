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
            src="/assets/Loveydovey_logo_real.svg"
            alt="LoveyDovey"
            className="h-8 object-contain"
          />
        </div>

        {/* 문장들 - 세로 중앙 정렬, 마침표 기준 줄바꿈 */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-6">
            {sentences.flatMap((sentence, sentenceIndex) => {
              // "캐릭터이름: " 패턴 제거 (대사 표시)
              let cleanedSentence = sentence.replace(/^[가-힣a-zA-Z_]+:\s*/, '');
              // 앞뒤 따옴표 제거
              cleanedSentence = cleanedSentence.replace(/^["']|["']$/g, '');

              // 말줄임표(...) 보호 후 마침표로 분리
              const ELLIPSIS_PLACEHOLDER = '<<<ELLIPSIS>>>';
              const protectedSentence = cleanedSentence.replace(/\.\.\./g, ELLIPSIS_PLACEHOLDER);
              const lines = protectedSentence
                .split(/(?<=\.)\s*/)
                .map(s => s.replace(new RegExp(ELLIPSIS_PLACEHOLDER, 'g'), '...').trim())
                .filter(s => s.length > 0);

              return lines.map((line, lineIndex) => (
                <p
                  key={`${sentenceIndex}-${lineIndex}`}
                  className="text-white text-3xl leading-relaxed font-medium"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  {line}
                </p>
              ));
            })}
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
