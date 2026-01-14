// 카드 분할 로직 - 추정 높이 기반

import type { ChatMessage } from '../types/chat';

// ============ SentenceCard 상수 ============
const CARD_HEIGHT = 1080;
const SENTENCE_HEADER_HEIGHT = 280;  // 로고 + 캐릭터 정보 (이름, 나이, 직업, 해시태그, 한마디)
const SENTENCE_PADDING = 60;         // 상 40px + 하 20px
const SENTENCE_SAFETY_MARGIN = 80;   // 안전 마진 (오버플로우 방지)
const SENTENCE_CONTENT_HEIGHT = CARD_HEIGHT - SENTENCE_HEADER_HEIGHT - SENTENCE_PADDING - SENTENCE_SAFETY_MARGIN; // ≈ 660px

const CHARS_PER_LINE = 30;           // 한 줄당 글자 수 (text-xl 기준)
const LINE_HEIGHT = 36;              // 줄 높이 (px, text-xl leading-relaxed)
const BUBBLE_PADDING = 72;           // 말풍선 패딩 py-5(40px) + mt-2(8px) + 간격
const AVATAR_ROW_HEIGHT = 40;        // 아바타 + 이름 높이 (w-16 + text-lg)
const MAX_SENTENCE_CHARS = 350;      // 문장 최대 글자 수 (카드 1장에 들어갈 수 있는 크기)

// ============ ConversationCard 상수 (Design D) ============
const CONV_CHARS_PER_LINE = 32;      // 실제 말풍선 너비 기준
const CONV_LINE_HEIGHT = 28;         // text-xl 실측
const CONV_MESSAGE_GAP = 32;         // space-y-8

// 캐릭터 메시지 상수
const CHAR_NAME_HEIGHT = 24;         // text-lg 실측
const CHAR_BUBBLE_PADDING = 40;      // py-5 실측
const CHAR_TIME_HEIGHT = 24;         // text-sm + mt-2

// 사용자 메시지 상수
const USER_BUBBLE_PADDING = 40;      // py-5 실측
const USER_TIME_HEIGHT = 20;         // text-sm

/**
 * 긴 문장을 최대 길이로 자르고 "..." 추가
 */
export function truncateSentence(sentence: string): string {
  if (sentence.length <= MAX_SENTENCE_CHARS) {
    return sentence;
  }
  return sentence.slice(0, MAX_SENTENCE_CHARS).trim() + '...';
}

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

  const MAX_SENTENCES_PER_CARD = 4;
  const cards: string[][] = [];
  let currentCard: string[] = [];
  let currentHeight = 0;

  for (const rawSentence of sentences) {
    // 긴 문장은 잘라서 "..."로 표시
    const sentence = truncateSentence(rawSentence);
    const height = estimateSentenceHeight(sentence);

    // 4문장 도달 또는 높이 초과 시 다음 카드로
    const wouldOverflow = currentHeight + height > SENTENCE_CONTENT_HEIGHT;
    const maxSentencesReached = currentCard.length >= MAX_SENTENCES_PER_CARD;

    if ((wouldOverflow || maxSentencesReached) && currentCard.length > 0) {
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
 * 텍스트의 실제 라인 수 계산 (줄바꿈 + 자동 줄바꿈 고려)
 */
function countActualLines(content: string): number {
  const lines = content.split('\n');
  let totalLines = 0;

  for (const line of lines) {
    if (line.length === 0) {
      totalLines += 1; // 빈 줄도 1줄로 계산
    } else {
      // 각 줄이 자동 줄바꿈되는 횟수 계산
      totalLines += Math.ceil(line.length / CONV_CHARS_PER_LINE);
    }
  }

  return totalLines;
}

/**
 * 단일 메시지의 예상 렌더링 높이를 계산
 */
export function estimateMessageHeight(message: ChatMessage): number {
  const lines = countActualLines(message.content);
  const textHeight = lines * CONV_LINE_HEIGHT;

  if (message.sender === 'user') {
    // 사용자 메시지: 말풍선 + 시간 + 간격
    return textHeight + USER_BUBBLE_PADDING + USER_TIME_HEIGHT + CONV_MESSAGE_GAP;
  } else {
    // 캐릭터 메시지: 이름 + 말풍선 + 시간 + 간격
    return CHAR_NAME_HEIGHT + textHeight + CHAR_BUBBLE_PADDING + CHAR_TIME_HEIGHT + CONV_MESSAGE_GAP;
  }
}

/**
 * 메시지 배열을 단일 카드로 반환 (분할 없음)
 * 세로로 긴 단일 카드 형태로 변경됨
 * @param messages 전체 메시지 배열
 * @returns 단일 카드 배열 (1개의 카드에 모든 메시지 포함)
 */
export function splitMessagesToCards(messages: ChatMessage[]): ChatMessage[][] {
  if (messages.length === 0) return [];

  // 분할 없이 모든 메시지를 단일 카드로 반환
  return [messages];
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

  return SENTENCE_HEADER_HEIGHT + SENTENCE_PADDING + contentHeight;
}
