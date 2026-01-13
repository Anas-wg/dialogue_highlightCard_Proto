interface MessageBalloonSelectHeaderProps {
  onBack: () => void;
}

export function MessageBalloonSelectHeader({ onBack }: MessageBalloonSelectHeaderProps) {
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

      <h1 className="text-lg font-semibold">문장 공유하기</h1>

      <div className="w-10" />
    </div>
  );
}
