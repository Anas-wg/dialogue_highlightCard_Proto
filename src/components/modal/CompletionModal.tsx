interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToChat: () => void;
  onReselect: () => void;
}

export function CompletionModal({ isOpen, onClose, onBackToChat, onReselect }: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-[360px] p-6"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      >
        {/* 체크 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#ff2e7f] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* 메시지 */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          공유 페이지가 완성되었습니다
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          이미지가 저장되었고, 공유 페이지가 새 탭에서 열렸어요.
        </p>

        {/* 버튼 영역 */}
        <div className="space-y-3">
          <button
            onClick={onReselect}
            className="w-full py-3 bg-[#ff2e7f] text-white font-medium rounded-xl hover:bg-[#e0266f] transition-colors"
          >
            다시 선택하기
          </button>
          <button
            onClick={onBackToChat}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            채팅으로 돌아가기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
