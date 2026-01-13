interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideModal({ isOpen, onClose }: SideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg"
        style={{ animation: 'slideIn 0.2s ease-out' }}
      >
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-4">채팅방 설정</h2>

          <nav className="space-y-1">
            {/* 대화 하이라이트 카드 공유하기 */}
            <button
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              onClick={() => {}}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span className="text-gray-800">대화 하이라이트 카드 공유하기</span>
            </button>

            {/* 채팅방 삭제 */}
            <button
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors text-left"
              onClick={() => {}}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="text-red-500">채팅방 삭제</span>
            </button>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
