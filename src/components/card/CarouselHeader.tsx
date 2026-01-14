interface CarouselHeaderProps {
  currentIndex: number;
  totalCount: number;
  onBack: () => void;
  backText?: string;
}

export function CarouselHeader({ currentIndex, totalCount, onBack, backText = '다시 선택하기' }: CarouselHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#ffd5e5]">
      <button
        onClick={onBack}
        className="flex items-center gap-1 p-2 -ml-2 hover:bg-white/20 rounded-lg transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="text-sm text-gray-700">{backText}</span>
      </button>

      <h1 className="text-[#ff2e7f] font-medium">
        생성된 개별 하이라이트 카드를 확인하세요({currentIndex + 1}/{totalCount})
      </h1>

      {/* 햄버거 메뉴 */}
      <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  );
}
