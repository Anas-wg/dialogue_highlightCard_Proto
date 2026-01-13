import { useState, useRef, useEffect } from 'react';
import { CarouselHeader } from '../components/card/CarouselHeader';
import { SentenceCard } from '../components/card/SentenceCard';
import { ConversationCard } from '../components/card/ConversationCard';
import { useImageGenerator } from '../hooks/useImageGenerator';
import type { CardData } from '../types/card';

interface CarouselPreviewProps {
  cards: CardData[];
  initialIndex: number;
  onBack: () => void;
}

// 레이아웃 상수
const HEADER_HEIGHT = 60;
const NAV_HEIGHT = 60;
const BUTTONS_HEIGHT = 100;
const PADDING = 32;

export function CarouselPreview({ cards, initialIndex, onBack }: CarouselPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(0.4);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { generateImage, downloadImage } = useImageGenerator();

  const currentCard = cards[currentIndex];

  // viewport 기반 동적 스케일 계산
  useEffect(() => {
    const calculateScale = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // 사용 가능한 영역 계산
      const availableHeight = viewportHeight - HEADER_HEIGHT - NAV_HEIGHT - BUTTONS_HEIGHT - PADDING * 2;
      const availableWidth = viewportWidth - PADDING * 2;

      // 카드 크기 (1080x1080)
      const cardSize = 1080;

      // 높이와 너비 모두 고려한 스케일 계산
      const scaleByHeight = availableHeight / cardSize;
      const scaleByWidth = availableWidth / cardSize;

      // 둘 중 작은 값 사용 (최대 1, 최소 0.3)
      const newScale = Math.min(1, Math.max(0.3, Math.min(scaleByHeight, scaleByWidth)));

      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // 키보드 방향키 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length]);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      const dataUrl = await generateImage(cardRef.current);
      if (dataUrl) {
        downloadImage(dataUrl, `highlight_card_${currentIndex + 1}.png`);
      }
    }
  };

  const handleShare = (platform: 'twitter') => {
    const currentCard = cards[currentIndex];
    const shareUrl = 'shareUrl' in currentCard.character
      ? currentCard.character.shareUrl
      : 'https://www.loveydovey.ai';

    if (platform === 'twitter') {
      const xText = '#러비더비 에서 나만의 캐릭터와 지금 만나기💕';
      const encodedText = encodeURIComponent(xText);
      const encodedUrl = encodeURIComponent(shareUrl || 'https://www.loveydovey.ai');
      const url = `https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <CarouselHeader
        currentIndex={currentIndex}
        totalCount={cards.length}
        onBack={onBack}
      />

      {/* 카드 표시 영역 */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 overflow-hidden"
      >
        <div
          className="shadow-2xl rounded-lg overflow-hidden"
          style={{
            width: `${1080 * scale}px`,
            height: `${1080 * scale}px`,
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <div
              ref={cardRef}
              style={{
                width: '1080px',
                height: '1080px',
              }}
            >
              {currentCard.type === 'sentence' ? (
                <SentenceCard character={currentCard.character} sentences={currentCard.sentences} />
              ) : (
                <ConversationCard character={currentCard.character} messages={currentCard.messages} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="flex items-center justify-center gap-8 py-4">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full transition-colors ${
            currentIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 도트 인디케이터 */}
        <div className="flex gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-[#ff2e7f]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === cards.length - 1}
          className={`p-2 rounded-full transition-colors ${
            currentIndex === cards.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 하단 공유/다운로드 버튼 */}
      <div className="flex items-center justify-center gap-6 py-6 bg-white border-t border-gray-100">
        {/* X (Twitter) */}
        <button
          onClick={() => handleShare('twitter')}
          className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#ff2e7f] hover:bg-gray-200 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
