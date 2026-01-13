import { useRef, useState } from 'react';
import type { ChatMessage } from '../../types/chat';

interface SelectableMessageProps {
  message: ChatMessage;
  avatarUrl?: string;
  selectedIndices: Set<number>;
  onSelectionChange: (indices: Set<number>) => void;
}

export function SelectableMessage({
  message,
  avatarUrl,
  selectedIndices,
  onSelectionChange,
}: SelectableMessageProps) {
  const sentences = message.content.split('\n').filter((s) => s.trim() !== '');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    setDragStartIndex(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging && dragStartIndex !== null) {
      const newSelection = new Set(selectedIndices);
      const start = Math.min(dragStartIndex, index);
      const end = Math.max(dragStartIndex, index);
      for (let i = start; i <= end; i++) {
        newSelection.add(i);
      }
      onSelectionChange(newSelection);
    }
  };

  const handleMouseUp = (index: number) => {
    if (isDragging) {
      if (dragStartIndex === index) {
        // Single click - toggle
        const newSelection = new Set(selectedIndices);
        if (newSelection.has(index)) {
          newSelection.delete(index);
        } else {
          newSelection.add(index);
        }
        onSelectionChange(newSelection);
      }
      setIsDragging(false);
      setDragStartIndex(null);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStartIndex(null);
    }
  };

  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="shrink-0 w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={message.senderName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            {message.senderName[0]}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-700">{message.senderName}</span>

        <div
          ref={containerRef}
          className="mt-1 max-w-[85%] px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm select-none"
          onMouseLeave={handleMouseLeave}
        >
          {sentences.map((sentence, index) => (
            <p
              key={index}
              className={`text-sm leading-relaxed cursor-pointer transition-colors rounded px-1 -mx-1 ${
                selectedIndices.has(index)
                  ? 'text-black'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
              style={selectedIndices.has(index) ? { backgroundColor: '#ffd5e5' } : undefined}
              onMouseDown={() => handleMouseDown(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseUp={() => handleMouseUp(index)}
            >
              {sentence}
            </p>
          ))}
        </div>

        <div className="mt-1 text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
    </div>
  );
}
