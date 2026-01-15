import type { ChatMessage } from './chat';

export interface ConversationCardData {
  type: 'conversation';
  character: { name: string; avatarUrl?: string };
  messages: ChatMessage[];
}

export type CardData = ConversationCardData;
