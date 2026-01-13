import { useState, useRef } from 'react';
import { GridHeader } from '../components/card/GridHeader';
import { SentenceCard } from '../components/card/SentenceCard';
import { ConversationCard } from '../components/card/ConversationCard';
import { useImageGenerator } from '../hooks/useImageGenerator';
import type { CardData } from '../types/card';

interface GridPreviewProps {
  cards: CardData[];
  onBack: () => void;
  onCardTap: (index: number) => void;
  onDownloadComplete: () => void;
}

export function GridPreview({ cards, onBack, onCardTap, onDownloadComplete }: GridPreviewProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { generateImage, downloadImage } = useImageGenerator();

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    toggleSelection(index);
  };

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleDownload = async () => {
    const selectedArray = Array.from(selectedIndices).sort((a, b) => a - b);

    for (let i = 0; i < selectedArray.length; i++) {
      const cardIndex = selectedArray[i];
      const cardElement = cardRefs.current[cardIndex];

      if (cardElement) {
        const dataUrl = await generateImage(cardElement);
        if (dataUrl) {
          downloadImage(dataUrl, `highlight_card_${cardIndex + 1}.png`);
        }
      }
    }

    onDownloadComplete();
  };

  // 스케일 비율 (1080px -> 미리보기 크기)
  const SCALE = 0.25;

  return (
    <div className="flex flex-col h-screen bg-[#fdf6f6]">
      <GridHeader
        selectedCount={selectedIndices.size}
        onBack={onBack}
        onDownload={handleDownload}
      />

      {/* 안내 문구 */}
      <div className="py-4 text-center">
        <p className="text-[#ff2e7f] font-medium">
          생성된 전체 대화 하이라이트 카드를 확인하세요
        </p>
      </div>

      {/* 그리드 */}
      <div className="flex-1 overflow-y-auto mt-4 px-4 pb-4">
        <div className="grid grid-cols-3 gap-4 pt-1">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all ${
                selectedIndices.has(index)
                  ? 'ring-4 ring-[#ff2e7f]'
                  : 'hover:shadow-lg'
              }`}
              style={{
                width: `${1080 * SCALE}px`,
                height: `${1080 * SCALE}px`,
              }}
              onClick={() => onCardTap(index)}
              onContextMenu={(e) => handleRightClick(e, index)}
            >
              {/* 미리보기용 축소 카드 */}
              <div
                style={{
                  transform: `scale(${SCALE})`,
                  transformOrigin: 'top left',
                }}
              >
                <div
                  ref={(el) => { cardRefs.current[index] = el; }}
                  style={{
                    width: '1080px',
                    height: '1080px',
                  }}
                >
                  {card.type === 'sentence' ? (
                    <SentenceCard character={card.character} sentences={card.sentences} />
                  ) : (
                    <ConversationCard character={card.character} messages={card.messages} />
                  )}
                </div>
              </div>

              {/* 선택 체크 표시 */}
              {selectedIndices.has(index) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#ff2e7f] rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
