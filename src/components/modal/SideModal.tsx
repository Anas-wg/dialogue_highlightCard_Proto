interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard?: () => void;
}

export function SideModal({ isOpen, onClose, onCreateCard }: SideModalProps) {
  if (!isOpen) return null;

  const handleCreateCard = () => {
    onClose();
    onCreateCard?.();
  };

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
            {/* 대화 하이라이트 카드 만들기 */}
            <button
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
              onClick={handleCreateCard}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span className="text-gray-800">대화 하이라이트 카드 만들기</span>
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
