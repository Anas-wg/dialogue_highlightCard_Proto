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

  const handleShare = (platform: 'instagram' | 'facebook' | 'twitter') => {
    // 추후 Web Intent 구현
    console.log(`Share to ${platform}`);
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
            ref={cardRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
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
        {/* Instagram */}
        <button
          onClick={() => handleShare('instagram')}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

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
