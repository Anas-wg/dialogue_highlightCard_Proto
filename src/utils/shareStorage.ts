// Local Storage 기반 공유 데이터 관리
// 데모용: 같은 브라우저에서만 동작 (새 탭에서도 접근 가능)

import type { ChatMessage } from '../types/chat';

const SHARE_STORAGE_KEY = 'highlightCard_shareData';

export interface ShareData {
  character: {
    name: string;
    avatarUrl?: string;
  };
  messages: ChatMessage[];
  createdAt: number;
}

/**
 * 공유 데이터를 localStorage에 저장
 */
export function saveShareData(
  character: { name: string; avatarUrl?: string },
  messages: ChatMessage[]
): void {
  const data: ShareData = {
    character,
    messages,
    createdAt: Date.now(),
  };

  localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(data));
}

/**
 * localStorage에서 공유 데이터 로드
 * @returns ShareData 또는 null (데이터 없음)
 */
export function loadShareData(): ShareData | null {
  const stored = localStorage.getItem(SHARE_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ShareData;
  } catch {
    return null;
  }
}

/**
 * localStorage에서 공유 데이터 삭제
 */
export function clearShareData(): void {
  localStorage.removeItem(SHARE_STORAGE_KEY);
}

/**
 * 공유 URL 생성
 */
export function createShareUrl(): string {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=true`;
}
