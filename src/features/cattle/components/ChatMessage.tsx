import React from 'react';
import { Bot, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

interface ChatMessageProps {
  message: Message;
}

const parseStructuredSections = (content: string) => {
  const sections = content
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(🚨 URGENCE|🔍 OBSERVATION|📋 DIAGNOSTIC POSSIBLE|👨‍⚕️ CONSULTATION):\s*(.*)$/s);
      if (!match) return null;

      const [, rawTitle, body] = match;
      const title = rawTitle.replace(/^🚨\s*/, '').replace(/^🔍\s*/, '').replace(/^📋\s*/, '').replace(/^👨‍⚕️\s*/, '');
      return { title, body, rawTitle };
    })
    .filter(Boolean) as Array<{ title: string; body: string; rawTitle: string }>;

  return sections;
};

const getToneClasses = (severity?: 'critical' | 'high' | 'medium' | 'low') => {
  switch (severity) {
    case 'critical':
      return {
        badge: 'bg-rose-100 text-rose-700 border-rose-200',
        section: 'border-rose-200 bg-rose-50/80',
      };
    case 'high':
      return {
        badge: 'bg-orange-100 text-orange-700 border-orange-200',
        section: 'border-orange-200 bg-orange-50/80',
      };
    case 'medium':
      return {
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        section: 'border-amber-200 bg-amber-50/80',
      };
    default:
      return {
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        section: 'border-emerald-200 bg-emerald-50/80',
      };
  }
};

const getSectionClasses = (rawTitle: string, severity?: 'critical' | 'high' | 'medium' | 'low') => {
  const tone = getToneClasses(severity);

  if (rawTitle.includes('URGENCE')) {
    return `${tone.section} border-l-4 border-rose-500`;
  }

  if (rawTitle.includes('OBSERVATION')) {
    return `${tone.section} border-l-4 border-amber-500`;
  }

  if (rawTitle.includes('CONSULTATION')) {
    return `${tone.section} border-l-4 border-sky-500`;
  }

  return `${tone.section} border-l-4 border-slate-400`;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const sections = !isUser ? parseStructuredSections(message.content) : [];
  const tone = getToneClasses(message.severity);

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
        >
          {!isUser && sections.length > 0 ? (
            <div className="space-y-2">
              <div className="mb-2 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone.badge}`}>
                  Analyse santé
                </span>
                {message.severity && (
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${tone.badge}`}>
                    {message.severity === 'critical' ? 'Critique' : message.severity === 'high' ? 'Élevée' : message.severity === 'medium' ? 'Moyenne' : 'Faible'}
                  </span>
                )}
              </div>
              {sections.map((section) => (
                <div key={section.rawTitle} className={`rounded-md border px-3 py-2 ${getSectionClasses(section.rawTitle, message.severity)}`}>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                    {section.rawTitle}
                  </div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{section.body}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {!isUser && (
            <Badge variant="outline" className="text-xs">
              IA
            </Badge>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center order-1">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};
