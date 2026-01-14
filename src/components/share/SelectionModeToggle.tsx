type SelectionMode = 'capture' | 'individual';

interface SelectionModeToggleProps {
  mode: SelectionMode;
  onModeChange: (mode: SelectionMode) => void;
}

export function SelectionModeToggle({ mode, onModeChange }: SelectionModeToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
      <button
        onClick={() => onModeChange('capture')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          mode === 'capture'
            ? 'bg-[#ff2e7f] text-white'
            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
        }`}
      >
        {mode === 'capture' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        캡처 방식
      </button>
      <button
        onClick={() => onModeChange('individual')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          mode === 'individual'
            ? 'bg-[#ff2e7f] text-white'
            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
        }`}
      >
        {mode === 'individual' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        개별 선택
      </button>
    </div>
  );
}

export type { SelectionMode };
