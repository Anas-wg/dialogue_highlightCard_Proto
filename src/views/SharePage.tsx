// 웹 공유 페이지 - ChatRoom UI 스타일
import { useState, useEffect } from 'react';
import { loadShareData, deleteShareData, type ShareData } from '../utils/shareStorage';
import { mockCurrentUser } from '../mock/userData';
import type { ChatMessage } from '../types/chat';

const CTA_URL = 'https://www.loveydovey.ai/characters/CMC392geRGBX3nGWq8LX';
const APP_LINK_URL = 'https://abr.ge/2nnlm6n';

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// 공유 페이지용 메시지 컴포넌트 (공유 버튼 없음)
function ShareMessage({ message, characterName }: { message: ChatMessage; characterName: string }) {
  const isUser = message.sender === 'user';
  const isCharacter = message.sender === 'character';

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 px-4 py-2">
        <div className="max-w-[70%] px-4 py-3 bg-[#ff2e7f]/20 rounded-2xl rounded-br-sm">
          <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
      </div>
    );
  }

  if (isCharacter) {
    return (
      <div className="flex gap-3 px-4 py-2">
        {/* 회색 원 아바타 (프로토타입) */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-medium">
          {characterName[0]}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-700">{message.senderName}</span>

          <div className="mt-1 max-w-[85%] px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          </div>

          <div className="mt-1 text-xs text-gray-400">
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function SharePage() {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  // localStorage에서 데이터 로드
  useEffect(() => {
    const data = loadShareData();
    setShareData(data);
    setLoading(false);
  }, []);

  const handleCTAClick = () => {
    window.open(CTA_URL, '_blank');
  };

  const handleDeleteShare = () => {
    const success = deleteShareData(mockCurrentUser.id);
    if (success) {
      setIsDeleted(true);
      setShareData(null);
    }
  };

  // 현재 사용자가 작성자인지 확인
  const isCreator = shareData?.creatorId === mockCurrentUser.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6f6] flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 공유가 취소된 경우
  if (isDeleted) {
    return (
      <div className="min-h-screen bg-[#fdf6f6] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-gray-700 mb-2">공유가 취소되었습니다</h1>
          <p className="text-gray-500 mb-6">
            이 공유 링크는 더 이상<br />
            사용할 수 없습니다.
          </p>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
          >
            탭 닫기
          </button>
        </div>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="min-h-screen bg-[#fdf6f6] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-gray-700 mb-2">공유 데이터가 없습니다</h1>
          <p className="text-gray-500 mb-6">
            공유 링크가 만료되었거나<br />
            다른 브라우저에서 접속하셨습니다.
          </p>
          <button
            onClick={handleCTAClick}
            className="px-6 py-3 bg-[#ff2e7f] text-white rounded-full font-medium hover:bg-[#e0266f] transition-colors"
          >
            러비더비 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col h-full max-w-[80%] mx-auto bg-[#fdf6f6]">
        {/* 상단: 캐릭터 정보 헤더 */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <div className="w-20" /> {/* 균형용 빈 공간 */}
          <div className="flex items-center gap-3">
            {/* 회색 원 아바타 (프로토타입) */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium">
              {shareData.character.name[0]}
            </div>
            <span className="font-medium text-gray-800">
              {shareData.character.name} <span className="text-[#ff2e7f]">✦</span>
            </span>
          </div>
          {/* 공유 취소 버튼 (작성자만 표시) */}
          <div className="w-20 flex justify-end">
            {isCreator && (
              <button
                onClick={handleDeleteShare}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                공유 취소
              </button>
            )}
          </div>
        </header>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-4">
            {shareData.messages.map((message) => (
              <ShareMessage
                key={message.id}
                message={message}
                characterName={shareData.character.name}
              />
            ))}
          </div>
        </div>

        {/* 하단: 가짜 채팅 입력 + CTA 버튼 */}
        <div className="bg-white border-t border-gray-100">
          {/* 가짜 채팅 입력 UI */}
          <div
            onClick={handleCTAClick}
            className="px-4 py-3 border-b border-gray-100 cursor-pointer"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-full">
              <input
                type="text"
                placeholder={`${shareData.character.name}에게 메시지 보내기...`}
                className="flex-1 bg-transparent text-sm text-gray-500 outline-none cursor-pointer"
                onClick={handleCTAClick}
                onFocus={(e) => {
                  e.preventDefault();
                  e.target.blur();
                  handleCTAClick();
                }}
                readOnly
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2e7f" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="p-4 flex gap-3">
            <button
              onClick={() => window.open(APP_LINK_URL, '_blank')}
              className="flex-1 py-3 bg-white text-gray-700 rounded-full font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              앱에서 바로 보기
            </button>
            <button
              onClick={handleCTAClick}
              className="flex-1 py-3 bg-[#ff2e7f] text-white rounded-full font-medium hover:bg-[#e0266f] transition-colors"
            >
              무료로 채팅하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
