interface ConversationShareHeaderProps {
  selectedCount: number;
  onBack: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMenu?: () => void;
}

export function ConversationShareHeader({
  selectedCount,
  onBack,
  onSelectAll,
  onDeselectAll,
  onMenu,
}: ConversationShareHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <button
        onClick={onBack}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="뒤로가기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={onSelectAll}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          전체 선택
        </button>
        <button
          onClick={onDeselectAll}
          className="text-sm transition-colors"
          style={{ color: '#ff2e7f' }}
        >
          선택 해제({selectedCount})
        </button>
        <button
          onClick={onMenu}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="메뉴"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
