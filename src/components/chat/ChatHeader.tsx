interface ChatHeaderProps {
  characterName: string;
  coins: number;
  onBack?: () => void;
  onShare?: () => void;
  onMenu?: () => void;
}

export function ChatHeader({ characterName, coins, onBack, onShare, onMenu }: ChatHeaderProps) {
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

      <div className="flex items-center gap-2">
        {/* 캐릭터 이름 버튼 */}
        <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors">
          <span className="font-medium">{characterName}</span>
          <span className="text-[#ff2e7f]">✦</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        {/* 코인 버튼 */}
        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#ff2e7f] text-[#ff2e7f]">
          <span className="font-medium">{coins.toLocaleString()}</span>
          <span>🪙</span>
        </div>
        <button
          onClick={onShare}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#ff2e7f] text-white rounded-full hover:bg-[#ff2e7f]/90 transition-colors text-sm font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span>공유</span>
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
