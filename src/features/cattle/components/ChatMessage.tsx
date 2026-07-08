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
  const headerPattern = /^(🚨 URGENCE|🔍 OBSERVATION|📋 DIAGNOSTIC POSSIBLE|👨‍⚕️ CONSULTATION)\s*:?(?:\s*(.*))?$/;
  const lines = content.split('\n');
  const sections: Array<{ body: string; rawTitle: string }> = [];
  let currentSection: { body: string; rawTitle: string } | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    const match = trimmedLine.match(headerPattern);

    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        rawTitle: match[1],
        body: match[2]?.trim() || '',
      };
      continue;
    }

    if (currentSection) {
      currentSection.body = `${currentSection.body}${currentSection.body ? '\n' : ''}${line}`.trim();
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.filter((section) => section.body);
};

const parseInlineMarkdown = (text: string) => {
  const inlinePattern = /(\*\*|__)(.+?)\1|(\*|_)(.+?)\3/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = inlinePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      nodes.push(
        <strong key={`strong-${match.index}`}>{match[2]}</strong>,
      );
    } else if (match[3]) {
      nodes.push(
        <em key={`em-${match.index}`}>{match[4]}</em>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
};

const renderMarkdown = (content: string, textClassName = 'text-slate-700') => {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={`list-${nodes.length}`} className={`ml-3 list-disc space-y-1 text-sm leading-relaxed break-words ${textClassName}`}>
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const listMatch = trimmedLine.match(/^[*+-]\s+(.*)$/);

    if (listMatch) {
      listItems.push(
        <li key={`li-${index}`}>
          {parseInlineMarkdown(listMatch[1])}
        </li>,
      );
      return;
    }

    flushList();

    if (trimmedLine === '') {
      nodes.push(<div key={`br-${index}`} className="h-2" />);
      return;
    }

    nodes.push(
      <p key={`p-${index}`} className={`text-sm leading-relaxed break-words ${textClassName}`}>
        {parseInlineMarkdown(line)}
      </p>,
    );
  });

  flushList();
  return nodes;
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
    <div className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-8 sm:w-8">
          <Bot className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
        </div>
      )}

      <div className={`min-w-0 max-w-[94%] sm:max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`w-full rounded-2xl border p-2.5 text-sm leading-relaxed shadow-sm sm:p-4 ${
            isUser
              ? 'border-primary/20 bg-gradient-to-br from-primary/95 via-primary to-primary/85 text-white shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)]'
              : 'border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-700'
          }`}
        >
          {!isUser && sections.length > 0 ? (
            <div className="w-full space-y-3">
              <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border sm:h-9 sm:w-9 ${tone.badge}`}>
                    <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Analyse santé
                    </div>
                    <div className="text-sm font-semibold leading-snug text-slate-800">Recommandation vétérinaire</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {isPriority && (
                    <Badge className="border-rose-200 bg-rose-100 text-[10px] text-rose-700 sm:text-xs">
                      Urgence prioritaire
                    </Badge>
                  )}
                  {message.severity && (
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone.badge}`}>
                      {message.severity === 'critical' ? 'Critique' : message.severity === 'high' ? 'Élevée' : message.severity === 'medium' ? 'Moyenne' : 'Faible'}
                    </span>
                  )}
                </div>
              </div>
              {sections.map((section) => {
                const sectionMeta = getSectionMeta(section.rawTitle, message.severity);
                const Icon = sectionMeta.icon;

                return (
                  <div key={section.rawTitle} className={`rounded-xl border bg-white/85 p-2.5 shadow-sm sm:p-3 ${sectionMeta.cardClass}`}>
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border sm:h-8 sm:w-8 ${sectionMeta.iconClass}`}>
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${sectionMeta.titleClass}`}>
                          {section.rawTitle}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-slate-700">
                          {renderMarkdown(section.body)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`w-full text-sm leading-relaxed ${isUser ? 'text-white/95' : 'text-slate-700'}`}>
              {renderMarkdown(message.content, isUser ? 'text-white/95' : 'text-slate-700')}
            </div>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
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
        <div className="order-1 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary sm:h-8 sm:w-8">
          <User className="h-3.5 w-3.5 text-primary-foreground sm:h-4 sm:w-4" />
        </div>
      )}
    </div>
  );
};
