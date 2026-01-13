export interface ChatMessage {
  id: string;
  timestamp: string;
  sender: 'user' | 'character' | 'system';
  senderName: string;
  content: string;
}

export interface CharacterInfo {
  name: string;
  avatarUrl?: string;
  age?: number;
  description?: string;
  job?: string;
  hashtags?: string[];
  quote?: string;
  shareUrl?: string;
}

export interface AffinityInfo {
  level: string;
  nextLevel: string;
  progress: number;
  score: number;
}

export interface ChatRoomData {
  character: CharacterInfo;
  userId: string;
  affinity: AffinityInfo;
  coins: number;
  messages: ChatMessage[];
}
