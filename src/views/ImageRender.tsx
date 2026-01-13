interface ImageRenderProps {
  onBack: () => void;
}

export function ImageRender({ onBack }: ImageRenderProps) {
  return (
    <div className="flex flex-col h-screen bg-[#fdf6f6]">
      <header className="flex items-center px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로가기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl text-gray-500">이미지 렌더링</p>
      </div>
    </div>
  );
}
