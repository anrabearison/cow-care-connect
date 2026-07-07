import React from 'react';
import { AlertTriangle, Bot, Eye, ShieldCheck, Stethoscope, User } from 'lucide-react';
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
      return { body, rawTitle };
    })
    .filter(Boolean) as Array<{ body: string; rawTitle: string }>;

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

const getSectionMeta = (rawTitle: string, severity?: 'critical' | 'high' | 'medium' | 'low') => {
  const tone = getToneClasses(severity);

  if (rawTitle.includes('URGENCE')) {
    return {
      icon: AlertTriangle,
      cardClass: `border-rose-200 bg-rose-50/90 ${tone.section}`,
      iconClass: 'border-rose-200 bg-rose-100 text-rose-700',
      titleClass: 'text-rose-700',
    };
  }

  if (rawTitle.includes('OBSERVATION')) {
    return {
      icon: Eye,
      cardClass: `border-amber-200 bg-amber-50/90 ${tone.section}`,
      iconClass: 'border-amber-200 bg-amber-100 text-amber-700',
      titleClass: 'text-amber-700',
    };
  }

  if (rawTitle.includes('CONSULTATION')) {
    return {
      icon: ShieldCheck,
      cardClass: `border-sky-200 bg-sky-50/90 ${tone.section}`,
      iconClass: 'border-sky-200 bg-sky-100 text-sky-700',
      titleClass: 'text-sky-700',
    };
  }

  return {
    icon: Stethoscope,
    cardClass: `border-slate-200 bg-white/90 ${tone.section}`,
    iconClass: 'border-slate-200 bg-slate-100 text-slate-700',
    titleClass: 'text-slate-700',
  };
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const sections = !isUser ? parseStructuredSections(message.content) : [];
  const tone = getToneClasses(message.severity);
  const isPriority = message.severity === 'critical' || message.severity === 'high';

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
            <div className={`space-y-3 rounded-2xl border p-4 shadow-sm ${isPriority ? 'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50 shadow-[0_10px_30px_-12px_rgba(244,63,94,0.35)]' : 'border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-sm'}`}>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${tone.badge}`}>
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Analyse santé
                    </div>
                    <div className="text-sm font-semibold text-slate-800">Recommandation vétérinaire</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPriority && (
                    <Badge className="border-rose-200 bg-rose-100 text-rose-700">
                      Urgence prioritaire
                    </Badge>
                  )}
                  {message.severity && (
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone.badge}`}>
                      {message.severity === 'critical' ? 'Critique' : message.severity === 'high' ? 'Élevée' : message.severity === 'medium' ? 'Moyenne' : 'Faible'}
                    </span>
                  )}
                </div>
              </div>
              {sections.map((section) => {
                const sectionMeta = getSectionMeta(section.rawTitle, message.severity);
                const Icon = sectionMeta.icon;

                return (
                  <div key={section.rawTitle} className={`rounded-xl border bg-white/85 p-3 shadow-sm ${sectionMeta.cardClass}`}>
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${sectionMeta.iconClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${sectionMeta.titleClass}`}>
                          {section.rawTitle}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                          {section.body}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
