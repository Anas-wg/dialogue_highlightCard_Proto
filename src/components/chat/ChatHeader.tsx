interface ChatHeaderProps {
  characterName: string;
  coins: number;
  onBack?: () => void;
  onMenu?: () => void;
}

export function ChatHeader({ characterName, coins, onBack, onMenu }: ChatHeaderProps) {
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
        <span className="font-medium text-gray-800">
          {characterName} <span className="text-[#ff2e7f]">✦</span> &gt;
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#ff2e7f] text-[#ff2e7f]">
          <span className="font-medium">{coins.toLocaleString()}</span>
          <span>🪙</span>
        </div>
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
