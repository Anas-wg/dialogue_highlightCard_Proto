interface CarouselHeaderProps {
  currentIndex: number;
  totalCount: number;
  onBack: () => void;
  backText?: string;
  guideTitle?: string;
  guideDescription?: string;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

export function CarouselHeader({
  currentIndex,
  totalCount,
  onBack,
  backText = '다시 선택하기',
  guideTitle = '공유할 하이라이트 카드를 확인하세요',
  guideDescription,
  screenSize = 'desktop',
}: CarouselHeaderProps) {
  const isMobile = screenSize === 'mobile';

  return (
    <div>
      {/* 상단 네비게이션 영역 */}
      <div className={`flex items-center justify-between bg-[#ffd5e5] ${
        isMobile ? 'px-3 py-2' : 'px-4 py-3'
      }`}>
        <button
          onClick={onBack}
          className="flex items-center gap-1 p-2 -ml-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {!isMobile && <span className="text-sm text-gray-700">{backText}</span>}
        </button>

        {/* 햄버거 메뉴 */}
        <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <svg width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* 가이드 텍스트 영역 */}
      <div className={`bg-[#ffe8f0] text-center ${
        isMobile ? 'px-3 py-2' : 'px-4 py-4'
      }`}>
        <h1 className={`text-[#ff2e7f] font-medium ${
          isMobile ? 'text-sm' : 'text-base'
        }`}>
          {guideTitle} ({currentIndex + 1}/{totalCount})
        </h1>
        {guideDescription && !isMobile && (
          <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
            {guideDescription}
          </p>
        )}
      </div>
    </div>
  );
}
