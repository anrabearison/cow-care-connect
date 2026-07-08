import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Send, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ChatMessage, Message } from './ChatMessage';
import { healthService, ChatMessage as ApiChatMessage } from '../services/health.service';
import { Cattle } from '../types';

interface HealthChatbotProps {
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

const createWelcomeMessage = (cattleName: string): Message => ({
  id: 'welcome',
  role: 'model',
  content: `Bonjour ! Je suis l'assistant santé pour ${cattleName}. Décrivez les symptômes que vous observez et je vous aiderai à identifier les problèmes possibles.`,
  timestamp: new Date(),
});

export const HealthChatbot: React.FC<HealthChatbotProps> = ({
  cattleId,
  cattle,
  messages: externalMessages,
  setMessages: setExternalMessages,
  apiHistory: externalApiHistory,
  setApiHistory: setExternalApiHistory,
  severity: externalSeverity,
  setSeverity: setExternalSeverity,
  confidence: externalConfidence,
  setConfidence: setExternalConfidence,
}) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(() => [createWelcomeMessage(cattle.name)]);
  const [localSeverity, setLocalSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('low');
  const [localConfidence, setLocalConfidence] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localApiHistory, setLocalApiHistory] = useState<ApiChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = externalMessages ?? localMessages;
  const setMessages = setExternalMessages ?? setLocalMessages;
  const apiHistory = externalApiHistory ?? localApiHistory;
  const setApiHistory = setExternalApiHistory ?? setLocalApiHistory;
  const severity = externalSeverity ?? localSeverity;
  const setSeverity = setExternalSeverity ?? setLocalSeverity;
  const confidence = externalConfidence ?? localConfidence;
  const setConfidence = setExternalConfidence ?? setLocalConfidence;

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

      const response = await healthService.chat({
        question: input,
        animalId: cattleId,
        history: updatedHistory,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.response,
        timestamp: new Date(),
        severity: response.severity ?? 'low',
      };

      setSeverity(response.severity ?? 'low');
      setConfidence(response.confidence ?? null);
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
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-blue-50 via-white to-blue-50/80 shadow-sm">
      <CardHeader className="px-3 pb-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2">
            <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <CardTitle className="text-base sm:text-lg">Assistant Santé</CardTitle>
              <CardDescription className="mt-1 text-sm leading-relaxed">
                Décrivez les symptômes observés. L'IA vous aidera à identifier les problèmes possibles.
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="w-full text-[11px] sm:w-auto sm:text-xs">
            IA - Consultation vétérinaire recommandée
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-3 pb-4 sm:px-6 sm:pb-6">
        {/* Message area */}
        <div className="h-[55vh] min-h-[280px] max-h-[420px] overflow-y-auto space-y-3 rounded-xl border border-slate-200/80 bg-white/70 p-2 sm:h-80 sm:p-3">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Textarea
            placeholder="Ex: Ma vache a une diarrhée depuis hier..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[56px] flex-1 resize-none"
            disabled={isLoading}
            maxLength={500}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="w-full self-end px-4 sm:w-auto"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-white/70 px-3 py-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Gravité estimée : {severity === 'critical' ? 'critique' : severity === 'high' ? 'élevée' : severity === 'medium' ? 'moyenne' : 'faible'}</span>
          </div>
          {confidence !== null && <span>Confiance : {(confidence * 100).toFixed(0)}%</span>}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
          <span>
            Cet assistant ne remplace pas un vétérinaire. Consultez un professionnel pour tout traitement.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
