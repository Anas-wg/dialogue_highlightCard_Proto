import type { ChatMessage, CharacterInfo } from './chat';

export interface SentenceCardData {
  type: 'sentence';
  character: CharacterInfo;
  sentences: string[];
}

export interface ConversationCardData {
  type: 'conversation';
  character: { name: string; avatarUrl?: string };
  messages: ChatMessage[];
}

export type CardData = SentenceCardData | ConversationCardData;
