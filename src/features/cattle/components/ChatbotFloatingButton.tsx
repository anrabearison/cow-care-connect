import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, X, MessageSquare } from 'lucide-react';
import { HealthChatbot } from './HealthChatbot';
import { Cattle } from '../types';

interface ChatbotFloatingButtonProps {
  cattleId: string;
  cattle: Cattle;
}

export const ChatbotFloatingButton: React.FC<ChatbotFloatingButtonProps> = ({
  cattleId,
  cattle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50 flex items-center justify-center"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-lg shadow-2xl border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
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
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Content */}
            <div className="p-4 max-h-[500px] overflow-y-auto">
              <HealthChatbot cattleId={cattleId} cattle={cattle} />
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
