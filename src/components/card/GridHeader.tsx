interface GridHeaderProps {
  selectedCount: number;
  onBack: () => void;
  onDownload: () => void;
}

export function GridHeader({ selectedCount, onBack, onDownload }: GridHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <button
        onClick={onBack}
        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        {/* 테마 변경 버튼 - 추후 구현 */}
        {/* <button className="text-gray-700 font-medium">테마 변경</button> */}

        <button
          onClick={onDownload}
          disabled={selectedCount === 0}
          className={`font-medium ${
            selectedCount > 0 ? 'text-[#ff2e7f]' : 'text-gray-300'
          }`}
        >
          다운로드({selectedCount})
        </button>

        {/* 햄버거 메뉴 */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
