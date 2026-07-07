import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Send, AlertTriangle } from 'lucide-react';
import { ChatMessage, Message } from './ChatMessage';
import { santeAnimaleService, ChatMessage as ApiChatMessage } from '../services/sante-animale.service';
import { Cattle } from '../types';

interface HealthChatbotProps {
  cattleId: string;
  cattle: Cattle;
}

export const HealthChatbot: React.FC<HealthChatbotProps> = ({ cattleId, cattle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Bonjour ! Je suis l'assistant santé pour ${cattle.name}. Décrivez les symptômes que vous observez et je vous aiderai à identifier les problèmes possibles.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiHistory, setApiHistory] = useState<ApiChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const updatedHistory: ApiChatMessage[] = [
        ...apiHistory,
        { role: 'user', parts: [{ text: input }] },
      ];

      const response = await santeAnimaleService.chat({
        question: input,
        animalId: cattleId,
        history: updatedHistory,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setApiHistory([
        ...updatedHistory,
        { role: 'model', parts: [{ text: response.response }] },
      ]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Assistant Santé</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            IA - Consultation vétérinaire recommandée
          </Badge>
        </div>
        <CardDescription className="text-sm">
          Décrivez les symptômes observés. L'IA vous aidera à identifier les problèmes possibles.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Message area */}
        <div className="h-80 overflow-y-auto space-y-3 p-3 bg-white/50 rounded-lg border">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Ex: Ma vache a une diarrhée depuis hier..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
            maxLength={500}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="px-4 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Warning */}
        <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded border border-yellow-200 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <span>
            Cet assistant ne remplace pas un vétérinaire. Consultez un professionnel pour tout traitement.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
