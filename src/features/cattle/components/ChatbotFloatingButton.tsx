import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, X, MessageSquare } from 'lucide-react';
import { HealthChatbot } from './HealthChatbot';
import { Message } from './ChatMessage';
import { ChatMessage as ApiChatMessage } from '../services/health.service';
import { Cattle } from '../types';

interface ChatbotFloatingButtonProps {
  cattleId: string;
  cattle: Cattle;
  messages?: Message[];
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
  apiHistory?: ApiChatMessage[];
  setApiHistory?: React.Dispatch<React.SetStateAction<ApiChatMessage[]>>;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  setSeverity?: React.Dispatch<React.SetStateAction<'critical' | 'high' | 'medium' | 'low'>>;
  confidence?: number | null;
  setConfidence?: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ChatbotFloatingButton: React.FC<ChatbotFloatingButtonProps> = ({
  cattleId,
  cattle,
  messages,
  setMessages,
  apiHistory,
  setApiHistory,
  severity,
  setSeverity,
  confidence,
  setConfidence,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 sm:bottom-6 sm:right-6"
          size="icon"
          aria-label="Ouvrir l'assistant santé"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 left-3 right-3 z-50 animate-in slide-in-from-bottom-4 duration-300 sm:bottom-6 sm:right-6 sm:left-auto sm:w-full sm:max-w-md">
          <div className="overflow-hidden rounded-lg border bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 to-primary/5 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Assistant Santé</h3>
                  <p className="text-xs text-muted-foreground">{cattle.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
                aria-label="Fermer l'assistant santé"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Content */}
            <div className="max-h-[75vh] overflow-y-auto p-3 sm:max-h-[500px] sm:p-4">
              <HealthChatbot
                cattleId={cattleId}
                cattle={cattle}
                messages={messages}
                setMessages={setMessages}
                apiHistory={apiHistory}
                setApiHistory={setApiHistory}
                severity={severity}
                setSeverity={setSeverity}
                confidence={confidence}
                setConfidence={setConfidence}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
