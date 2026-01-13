import type { AffinityInfo } from '../../types/chat';

interface AffinityBarProps {
  affinity: AffinityInfo;
}

export function AffinityBar({ affinity }: AffinityBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-white" style={{ backgroundColor: '#ff2e7f' }}>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-white/90">♡</span>
        <span className="font-medium">{affinity.level}</span>
        <span className="text-white/70">▶</span>
        <span className="font-medium">{affinity.nextLevel}</span>
      </div>

      <div className="flex-1 relative h-2 bg-white/30 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${affinity.progress}%` }}
        />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium mix-blend-difference" style={{ color: '#ff2e7f' }}>
          {affinity.progress}%
        </span>
      </div>

      <div className="shrink-0 font-medium">
        호감도: {affinity.score}점
      </div>
    </div>
  );
}
