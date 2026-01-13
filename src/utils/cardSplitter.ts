// 카드 분할 로직 - 추정 높이 기반

// 상수 정의
const CARD_HEIGHT = 1080;
const HEADER_HEIGHT = 280;      // 로고 + 캐릭터 정보 (이름, 나이, 직업, 해시태그, 한마디)
const PADDING = 80;             // 상하 패딩
const CONTENT_HEIGHT = CARD_HEIGHT - HEADER_HEIGHT - PADDING; // ≈ 720px

const CHARS_PER_LINE = 35;      // 한 줄당 글자 수 (큰 폰트 기준)
const LINE_HEIGHT = 32;         // 줄 높이 (px)
const BUBBLE_PADDING = 56;      // 말풍선 패딩 + 마진
const AVATAR_ROW_HEIGHT = 32;   // 아바타 + 이름 높이

/**
 * 단일 문장의 예상 렌더링 높이를 계산
 */
export function estimateSentenceHeight(sentence: string): number {
  const lines = Math.ceil(sentence.length / CHARS_PER_LINE);
  return AVATAR_ROW_HEIGHT + (lines * LINE_HEIGHT) + BUBBLE_PADDING;
}

/**
 * 문장 배열을 카드별로 분할
 * @param sentences 전체 문장 배열
 * @returns 카드별 문장 배열 (2차원 배열)
 */
export function splitSentencesToCards(sentences: string[]): string[][] {
  if (sentences.length === 0) return [];

  const cards: string[][] = [];
  let currentCard: string[] = [];
  let currentHeight = 0;

  for (const sentence of sentences) {
    const height = estimateSentenceHeight(sentence);

    // 현재 카드에 추가하면 넘치는 경우
    if (currentHeight + height > CONTENT_HEIGHT && currentCard.length > 0) {
      // 현재 카드 완료, 새 카드 시작
      cards.push(currentCard);
      currentCard = [sentence];
      currentHeight = height;
    } else {
      // 현재 카드에 추가
      currentCard.push(sentence);
      currentHeight += height;
    }
  }

  // 마지막 카드 추가
  if (currentCard.length > 0) {
    cards.push(currentCard);
  }

  return cards;
}

/**
 * 카드의 실제 콘텐츠 높이를 추정 (Carousel 동적 스케일용)
 * @param sentenceCount 문장 개수
 * @param sentences 문장 배열
 * @returns 예상 카드 높이 (px)
 */
export function estimateCardHeight(sentences: string[]): number {
  let contentHeight = 0;

  for (const sentence of sentences) {
    contentHeight += estimateSentenceHeight(sentence);
  }

  return HEADER_HEIGHT + PADDING + contentHeight;
}
