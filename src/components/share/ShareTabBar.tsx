interface ShareTabBarProps {
  activeTab: 'sentence' | 'conversation';
  onTabChange: (tab: 'sentence' | 'conversation') => void;
}

export function ShareTabBar({ activeTab, onTabChange }: ShareTabBarProps) {
  return (
    <div className="flex">
      <button
        onClick={() => onTabChange('sentence')}
        className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
          activeTab === 'sentence'
            ? 'text-white'
            : 'text-gray-400 bg-white'
        }`}
        style={activeTab === 'sentence' ? { backgroundColor: '#ff2e7f' } : undefined}
      >
        문장 공유하기
      </button>
      <button
        onClick={() => onTabChange('conversation')}
        className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
          activeTab === 'conversation'
            ? 'text-white'
            : 'text-gray-400 bg-white'
        }`}
        style={activeTab === 'conversation' ? { backgroundColor: '#ff2e7f' } : undefined}
      >
        대화 공유하기
      </button>
    </div>
  );
}
