import { useState, useRef, useEffect, useCallback } from 'react';
import { CarouselHeader } from '../components/card/CarouselHeader';
import { SentenceCard } from '../components/card/SentenceCard';
import { ConversationCard } from '../components/card/ConversationCard';
import { useImageGenerator } from '../hooks/useImageGenerator';
import { saveShareData, createShareUrl } from '../utils/shareStorage';
import type { CardData } from '../types/card';

interface CarouselPreviewProps {
  cards: CardData[];
  initialIndex: number;
  onBack: () => void;
  onBackToHome?: () => void; // ChatRoom으로 돌아가기
}

// 레이아웃 상수
const THUMBNAIL_WIDTH = 120;

export function CarouselPreview({ cards, initialIndex, onBack, onBackToHome }: CarouselPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(0.5);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cardHeight, setCardHeight] = useState(1080);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { generateImage, downloadImage } = useImageGenerator();

  const currentCard = cards[currentIndex];
  const isConversationCard = currentCard.type === 'conversation';
  const isSentenceCard = currentCard.type === 'sentence';

  // 썸네일 체크 토글
  const toggleSelection = (index: number) => {
    setSelectedIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // 카드 높이 측정 (대화 카드는 동적 높이)
  useEffect(() => {
    if (cardRef.current) {
      const height = cardRef.current.scrollHeight;
      setCardHeight(height);
    }
  }, [currentCard]);

  // viewport 기반 동적 스케일 계산
  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth * 0.8; // 80% 컨테이너 기준
      const availableWidth = viewportWidth - THUMBNAIL_WIDTH - 80; // 썸네일 + 패딩 제외
      const cardWidth = 1080;
      const newScale = Math.min(0.6, Math.max(0.35, availableWidth / cardWidth));
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // 스크롤 위치 추적
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollTop);
    }
  }, []);

  // 키보드 방향키 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length]);

  // 문장 카드: 휠 스크롤로 카드 전환
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isSentenceCard || cards.length <= 1) return;

    e.preventDefault();

    if (e.deltaY > 0) {
      // 아래로 스크롤 → 다음 카드
      setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
    } else if (e.deltaY < 0) {
      // 위로 스크롤 → 이전 카드
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  }, [isSentenceCard, cards.length]);

  // 휠 이벤트 등록 (문장 카드용)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isSentenceCard) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel, isSentenceCard]);

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

  // 현재 카드 다운로드
  const handleDownload = async () => {
    if (cardRef.current) {
      const dataUrl = await generateImage(cardRef.current);
      if (dataUrl) {
        downloadImage(dataUrl, `highlight_card_${currentIndex + 1}.png`);
      }
    }
  };

  // 선택된 카드들 일괄 다운로드
  const handleBatchDownload = async () => {
    const indicesToDownload = selectedIndices.size > 0
      ? Array.from(selectedIndices).sort((a, b) => a - b)
      : [currentIndex]; // 선택 없으면 현재 카드만

    for (const index of indicesToDownload) {
      const ref = cardRefs.current[index];
      if (ref) {
        const dataUrl = await generateImage(ref);
        if (dataUrl) {
          downloadImage(dataUrl, `highlight_card_${index + 1}.png`);
          // 다운로드 간 약간의 딜레이
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
  };

  const handleShare = (platform: 'twitter') => {
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

  // 웹 공유 링크 생성 (대화 카드만)
  const [linkCopied, setLinkCopied] = useState(false);
  const handleShareLink = async () => {
    if (!isConversationCard || currentCard.type !== 'conversation') return;

    // localStorage에 저장
    saveShareData(currentCard.character, currentCard.messages);

    // URL 생성 및 새 탭에서 열기
    const url = createShareUrl();
    window.open(url, '_blank');

    // 클립보드에도 복사
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  // 썸네일 뷰포트 인디케이터 계산
  const thumbnailScale = THUMBNAIL_WIDTH / 1080;
  const viewportHeight = scrollContainerRef.current?.clientHeight || 500;
  const visibleRatio = viewportHeight / (cardHeight * scale);
  const scrollRatio = scrollPosition / ((cardHeight * scale) - viewportHeight + 1);
  const indicatorHeight = Math.min(1, visibleRatio) * (cardHeight * thumbnailScale);
  const indicatorTop = scrollRatio * ((cardHeight * thumbnailScale) - indicatorHeight);

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col h-full max-w-[80%] mx-auto bg-white">
        <CarouselHeader
          currentIndex={currentIndex}
          totalCount={cards.length}
          onBack={onBack}
          backText={isConversationCard ? '채팅으로 돌아가기' : '다시 선택하기'}
          guideTitle={isConversationCard ? '이 대화로 공유할 하이라이트 카드입니다' : '공유할 하이라이트 카드를 확인하세요'}
          guideDescription={isConversationCard
            ? '선택한 대화 범위가 카드로 만들어졌어요.\n아래로 스크롤하면 전체 대화를 확인할 수 있어요.'
            : '선택한 문장으로 카드가 만들어졌어요.'
          }
        />

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 좌측: 썸네일 사이드바 */}
          {/* 대화 카드: 뷰포트 인디케이터 */}
          {isConversationCard && cardHeight > 1080 && (
            <div className="shrink-0 p-4 bg-gray-50 border-r border-gray-200">
              <div className="relative" style={{ width: THUMBNAIL_WIDTH }}>
                <div
                  className="overflow-hidden rounded shadow-sm"
                  style={{
                    width: THUMBNAIL_WIDTH,
                    height: cardHeight * thumbnailScale,
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${thumbnailScale})`,
                      transformOrigin: 'top left',
                      width: 1080,
                    }}
                  >
                    <ConversationCard character={currentCard.character} messages={currentCard.messages} />
                  </div>
                </div>
                <div
                  className="absolute left-0 right-0 border-2 border-[#ff2e7f] bg-[#ff2e7f]/10 rounded pointer-events-none"
                  style={{
                    top: Math.max(0, indicatorTop),
                    height: Math.max(20, indicatorHeight),
                  }}
                />
              </div>
            </div>
          )}

          {/* 문장 카드: 썸네일 리스트 + 체크박스 */}
          {isSentenceCard && cards.length > 0 && (
            <div className="shrink-0 w-[140px] p-3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <div className="space-y-3">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-[#ff2e7f] shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {/* 썸네일 이미지 */}
                    <div
                      className="overflow-hidden"
                      style={{
                        width: 120,
                        height: 120,
                      }}
                    >
                      <div
                        style={{
                          transform: 'scale(0.111)',
                          transformOrigin: 'top left',
                          width: 1080,
                          height: 1080,
                        }}
                      >
                        {card.type === 'sentence' && (
                          <SentenceCard character={card.character} sentences={card.sentences} />
                        )}
                      </div>
                    </div>

                    {/* 체크 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(index);
                      }}
                      className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        selectedIndices.has(index)
                          ? 'bg-[#ff2e7f]'
                          : 'bg-gray-300'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>

                    {/* 카드 번호 */}
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 rounded text-white text-xs">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 우측: 스크롤 가능한 카드 미리보기 */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4"
          >
            <div className="flex justify-center">
              <div
                className="shadow-2xl rounded-lg overflow-hidden"
                style={{
                  width: 1080 * scale,
                  height: cardHeight * scale,
                }}
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: 1080,
                    height: cardHeight,
                  }}
                >
                  <div ref={cardRef}>
                    {currentCard.type === 'sentence' ? (
                      <SentenceCard character={currentCard.character} sentences={currentCard.sentences} />
                    ) : (
                      <ConversationCard character={currentCard.character} messages={currentCard.messages} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 네비게이션 (카드가 여러 개일 때만) */}
        {cards.length > 1 && (
          <div className="flex items-center justify-center gap-8 py-3 border-t border-gray-100">
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
        )}

        {/* 하단 버튼 영역 */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
          {/* 좌측: 채팅으로 돌아가기 버튼 (문장 카드만) */}
          <div>
            {isSentenceCard && onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-sm">채팅으로 돌아가기</span>
              </button>
            )}
          </div>

          {/* 중앙: 공유/다운로드 버튼 */}
          <div className="flex items-center gap-4">
            {/* 링크 공유 버튼 (대화 카드만) */}
            {isConversationCard && (
              <button
                onClick={handleShareLink}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  linkCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-[#ff2e7f] text-white hover:bg-[#e0266f]'
                }`}
              >
                {linkCopied ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                )}
              </button>
            )}

            <button
              onClick={() => handleShare('twitter')}
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            <button
              onClick={isSentenceCard && selectedIndices.size > 0 ? handleBatchDownload : handleDownload}
              className="relative w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#ff2e7f] hover:bg-gray-100 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {/* 선택된 카드 수 표시 */}
              {isSentenceCard && selectedIndices.size > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff2e7f] text-white text-xs rounded-full flex items-center justify-center">
                  {selectedIndices.size}
                </span>
              )}
            </button>
          </div>

          {/* 우측: 빈 공간 (균형) */}
          <div className="w-25" />
        </div>
      </div>

      {/* 숨겨진 풀사이즈 카드 (다운로드용) */}
      {isSentenceCard && (
        <div className="fixed top-0" style={{ left: -9999 }}>
          {cards.map((card, index) => (
            <div
              key={index}
              ref={el => { cardRefs.current[index] = el; }}
              style={{ width: 1080, height: 1080 }}
            >
              {card.type === 'sentence' && (
                <SentenceCard character={card.character} sentences={card.sentences} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
