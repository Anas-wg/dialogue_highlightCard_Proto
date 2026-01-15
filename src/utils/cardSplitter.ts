// 카드 분할 로직 - ConversationCard 전용

import type { ChatMessage } from '../types/chat';

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
