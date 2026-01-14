import { useState, useRef, useEffect } from 'react';
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
  const [cardSize, setCardSize] = useState(270);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { generateImage, downloadImage } = useImageGenerator();

  // 반응형 카드 크기 계산
  useEffect(() => {
    const calculateCardSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const gap = 16; // gap-4 = 16px
      const maxGridWidth = Math.min(containerWidth, 896); // max-w-4xl = 896px
      // 3열 + 2개의 gap
      const newCardSize = Math.floor((maxGridWidth - gap * 2) / 3);
      setCardSize(Math.min(350, Math.max(100, newCardSize)));
    };

    calculateCardSize();
    window.addEventListener('resize', calculateCardSize);
    return () => window.removeEventListener('resize', calculateCardSize);
  }, []);

  const scale = cardSize / 1080;

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

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col h-full max-w-[80%] mx-auto bg-[#fdf6f6]">
        <GridHeader
        selectedCount={selectedIndices.size}
        onBack={onBack}
        onDownload={handleDownload}
      />

      {/* 안내 문구 */}
      <div className="py-8 text-center text-sm text-gray-500">
        <p>***</p>
        <p className="mt-2 font-medium text-gray-700">생성된 전체 대화 하이라이트 카드를 확인하세요.</p>
        <p className="mt-1">다운로드할 카드의 체크 버튼을 누른 후, 상단의 다운로드 버튼을 눌러주세요.</p>
        <p className="mt-2">***</p>
      </div>

      {/* 그리드 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto mt-4 px-4 pb-4"
      >
        <div className="grid grid-cols-3 gap-4 pt-1 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all ${
                selectedIndices.has(index)
                  ? 'ring-4 ring-[#ff2e7f]'
                  : 'hover:shadow-lg'
              }`}
              style={{
                width: `${cardSize}px`,
                height: `${cardSize}px`,
              }}
              onClick={() => onCardTap(index)}
              onContextMenu={(e) => handleRightClick(e, index)}
            >
              {/* 미리보기용 축소 카드 */}
              <div
                style={{
                  transform: `scale(${scale})`,
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

              {/* 선택 체크 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(index);
                }}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  selectedIndices.has(index)
                    ? 'bg-[#ff2e7f]'
                    : 'bg-gray-300'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
