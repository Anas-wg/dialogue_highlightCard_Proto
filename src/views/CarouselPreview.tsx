import { useState, useRef, useEffect, useCallback, type TouchEvent } from 'react';
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
const THUMBNAIL_WIDTH_DESKTOP = 120;
const THUMBNAIL_WIDTH_TABLET = 80;

// 브레이크포인트
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

export function CarouselPreview({ cards, initialIndex, onBack, onBackToHome }: CarouselPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(0.5);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cardHeight, setCardHeight] = useState(1080);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
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

  // viewport 기반 동적 스케일 계산 + 화면 크기 감지
  useEffect(() => {
    const calculateLayout = () => {
      const windowWidth = window.innerWidth;

      // 화면 크기 감지
      let newScreenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (windowWidth < MOBILE_BREAKPOINT) {
        newScreenSize = 'mobile';
      } else if (windowWidth < TABLET_BREAKPOINT) {
        newScreenSize = 'tablet';
      }
      setScreenSize(newScreenSize);

      // 스케일 계산
      const cardWidth = 1080;
      let availableWidth: number;
      let minScale: number;
      let maxScale: number;

      if (newScreenSize === 'mobile') {
        // 모바일: 사이드바 없음, 전체 너비 사용
        availableWidth = windowWidth - 32; // 좌우 패딩 16px씩
        minScale = 0.28;
        maxScale = 0.4;
      } else if (newScreenSize === 'tablet') {
        // 태블릿: 작은 사이드바
        const containerWidth = windowWidth * 0.9;
        availableWidth = containerWidth - THUMBNAIL_WIDTH_TABLET - 48;
        minScale = 0.35;
        maxScale = 0.5;
      } else {
        // 데스크톱: 현재와 동일
        const containerWidth = windowWidth * 0.8;
        availableWidth = containerWidth - THUMBNAIL_WIDTH_DESKTOP - 80;
        minScale = 0.35;
        maxScale = 0.6;
      }

      const newScale = Math.min(maxScale, Math.max(minScale, availableWidth / cardWidth));
      setScale(newScale);
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
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

  // 모바일 스와이프 핸들러
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (screenSize !== 'mobile' || cards.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (screenSize !== 'mobile' || cards.length <= 1 || touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const threshold = 50; // 최소 스와이프 거리

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 왼쪽으로 스와이프 → 다음 카드
        setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
      } else {
        // 오른쪽으로 스와이프 → 이전 카드
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    }

    setTouchStartX(null);
  };

  // 썸네일 뷰포트 인디케이터 계산
  const thumbnailWidth = screenSize === 'tablet' ? THUMBNAIL_WIDTH_TABLET : THUMBNAIL_WIDTH_DESKTOP;
  const thumbnailScale = thumbnailWidth / 1080;
  const viewportHeight = scrollContainerRef.current?.clientHeight || 500;
  const visibleRatio = viewportHeight / (cardHeight * scale);
  const scrollRatio = scrollPosition / ((cardHeight * scale) - viewportHeight + 1);
  const indicatorHeight = Math.min(1, visibleRatio) * (cardHeight * thumbnailScale);
  const indicatorTop = scrollRatio * ((cardHeight * thumbnailScale) - indicatorHeight);

  return (
    <div className="h-screen bg-white">
      <div className={`flex flex-col h-full mx-auto bg-white ${
        screenSize === 'mobile' ? 'max-w-full' : screenSize === 'tablet' ? 'max-w-[90%]' : 'max-w-[80%]'
      }`}>
        <CarouselHeader
          currentIndex={currentIndex}
          totalCount={cards.length}
          onBack={onBack}
          backText={isConversationCard ? '채팅으로 돌아가기' : '다시 선택하기'}
          guideTitle={isConversationCard ? '이 대화로 공유할 하이라이트 카드입니다' : '공유할 하이라이트 카드를 확인하세요'}
          guideDescription={isConversationCard
            ? '선택한 대화 범위가 카드로 만들어졌어요.\n아래로 스크롤하면 전체 대화를 확인할 수 있어요.'
            : '선택한 문장으로 카드가 만들어졌어요.\n저장할 카드를 왼쪽에서 체크해보세요.'
          }
          screenSize={screenSize}
        />

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 좌측: 썸네일 사이드바 */}
          {/* 대화 카드: 뷰포트 인디케이터 (모바일에서 숨김) */}
          {isConversationCard && cardHeight > 1080 && screenSize !== 'mobile' && (
            <div className={`shrink-0 bg-gray-50 border-r border-gray-200 ${
              screenSize === 'tablet' ? 'p-2' : 'p-4'
            }`}>
              <div className="relative" style={{ width: thumbnailWidth }}>
                <div
                  className="overflow-hidden rounded shadow-sm"
                  style={{
                    width: thumbnailWidth,
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

          {/* 문장 카드: 썸네일 리스트 + 체크박스 (모바일에서 숨김) */}
          {isSentenceCard && cards.length > 0 && screenSize !== 'mobile' && (
            <div className={`shrink-0 bg-gray-50 border-r border-gray-200 overflow-y-auto ${
              screenSize === 'tablet' ? 'w-[100px] p-2' : 'w-[140px] p-3'
            }`}>
              <div className={screenSize === 'tablet' ? 'space-y-2' : 'space-y-3'}>
                {cards.map((card, index) => {
                  const thumbSize = screenSize === 'tablet' ? 80 : 120;
                  const thumbScale = thumbSize / 1080;
                  return (
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
                          width: thumbSize,
                          height: thumbSize,
                        }}
                      >
                        <div
                          style={{
                            transform: `scale(${thumbScale})`,
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
                        className={`absolute top-1 right-1 rounded-full flex items-center justify-center transition-colors ${
                          screenSize === 'tablet' ? 'w-5 h-5' : 'w-6 h-6'
                        } ${
                          selectedIndices.has(index)
                            ? 'bg-[#ff2e7f]'
                            : 'bg-gray-300'
                        }`}
                      >
                        <svg width={screenSize === 'tablet' ? 10 : 12} height={screenSize === 'tablet' ? 10 : 12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>

                      {/* 카드 번호 */}
                      <div className={`absolute bottom-1 left-1 bg-black/50 rounded text-white ${
                        screenSize === 'tablet' ? 'px-1 py-0.5 text-[10px]' : 'px-1.5 py-0.5 text-xs'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 데스크톱: 좌측 화살표 */}
          {screenSize === 'desktop' && cards.length > 1 && (
            <div className="shrink-0 flex items-center px-2">
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className={`p-3 rounded-full transition-colors ${
                  currentIndex === 0
                    ? 'text-gray-200 cursor-not-allowed'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>
          )}

          {/* 중앙: 스크롤 가능한 카드 미리보기 */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`flex-1 overflow-y-auto ${
              screenSize === 'mobile' ? 'p-2' : screenSize === 'tablet' ? 'p-3' : 'p-4'
            }`}
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

          {/* 데스크톱: 우측 화살표 */}
          {screenSize === 'desktop' && cards.length > 1 && (
            <div className="shrink-0 flex items-center px-2">
              <button
                onClick={goToNext}
                disabled={currentIndex === cards.length - 1}
                className={`p-3 rounded-full transition-colors ${
                  currentIndex === cards.length - 1
                    ? 'text-gray-200 cursor-not-allowed'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* 네비게이션 (카드가 여러 개일 때만) */}
        {cards.length > 1 && (
          <div className="flex items-center justify-center gap-8 py-3 border-t border-gray-100">
            {/* 모바일/태블릿: 좌측 화살표 */}
            {screenSize !== 'desktop' && (
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full transition-colors ${
                  currentIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Dot 인디케이터 (모든 화면) */}
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

            {/* 모바일/태블릿: 우측 화살표 */}
            {screenSize !== 'desktop' && (
              <button
                onClick={goToNext}
                disabled={currentIndex === cards.length - 1}
                className={`p-2 rounded-full transition-colors ${
                  currentIndex === cards.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div className={`flex items-center bg-white border-t border-gray-100 ${
          screenSize === 'mobile' ? 'justify-center px-4 py-3' : 'justify-between px-6 py-4'
        }`}>
          {/* 좌측: 채팅으로 돌아가기 버튼 (문장 카드만, 모바일에서 숨김) */}
          {screenSize !== 'mobile' && (
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
          )}

          {/* 중앙: 공유/다운로드 버튼 */}
          <div className={`flex items-start ${screenSize === 'mobile' ? 'gap-4' : 'gap-6'}`}>
            {/* 링크 공유 버튼 (대화 카드만) */}
            {isConversationCard && (
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleShareLink}
                  className={`relative rounded-full flex items-center justify-center transition-colors ${
                    screenSize === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
                  } ${
                    linkCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-[#ff2e7f] text-white hover:bg-[#e0266f]'
                  }`}
                >
                  {linkCopied ? (
                    <svg width={screenSize === 'mobile' ? 16 : 20} height={screenSize === 'mobile' ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width={screenSize === 'mobile' ? 16 : 20} height={screenSize === 'mobile' ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                </button>
                {screenSize !== 'mobile' && <span className="text-xs text-gray-500">공유하기</span>}
              </div>
            )}

            <button
              onClick={() => handleShare('twitter')}
              className={`rounded-full bg-black flex items-center justify-center text-white ${
                screenSize === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
              }`}
            >
              <svg width={screenSize === 'mobile' ? 16 : 20} height={screenSize === 'mobile' ? 16 : 20} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={isSentenceCard && selectedIndices.size > 0 ? handleBatchDownload : handleDownload}
                className={`relative rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#ff2e7f] hover:bg-gray-100 transition-colors ${
                  screenSize === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'
                }`}
              >
                <svg width={screenSize === 'mobile' ? 20 : 24} height={screenSize === 'mobile' ? 20 : 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              {screenSize !== 'mobile' && <span className="text-xs text-gray-500">저장하기</span>}
            </div>
          </div>

          {/* 우측: 빈 공간 (균형) - 모바일에서 숨김 */}
          {screenSize !== 'mobile' && <div className="w-25" />}
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
