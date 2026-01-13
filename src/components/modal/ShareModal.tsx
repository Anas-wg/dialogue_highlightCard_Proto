import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  shareUrl: string;
  onClose: () => void;
}

export function ShareModal({ isOpen, shareUrl, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `#러비더비 에서 나만의 캐릭터와 지금 만나기💕\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleShare = (platform: 'instagram' | 'facebook' | 'twitter') => {
    const xText = '#러비더비 에서 나만의 캐릭터와 지금 만나기💕';
    const encodedXText = encodeURIComponent(xText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedXText}`;
        break;
      case 'twitter':
        url = `https://x.com/intent/post?text=${encodedXText}&url=${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct web sharing, just copy text
        handleCopy();
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 완료 메시지 */}
        <div className="text-center mb-6">
          <p className="text-[#ff2e7f] font-bold text-lg">
            선택하신 이미지의 다운로드가 완료되었습니다
          </p>
          <p className="text-[#ff2e7f] mt-2">
            아래 텍스트를 복사 붙여넣기 한 후
          </p>
          <p className="text-[#ff2e7f]">
            SNS에 대화 하이라이트 카드를 공유하세요!
          </p>
        </div>

        {/* 공유 텍스트 */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl mb-6 overflow-hidden">
          <div className="flex-1 min-w-0 text-sm text-gray-700 whitespace-pre-wrap break-all">
            {shareText}
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {copied ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2e7f" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>

        {/* SNS 버튼 */}
        <div className="flex items-center justify-center gap-4">
          {/* X (Twitter) */}
          <button
            onClick={() => handleShare('twitter')}
            className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
