/**
 * Utilitaire de sanitization HTML
 * Utilise DOMPurify pour nettoyer le HTML et prévenir les injections XSS
 */

import DOMPurify from 'dompurify';

/**
 * Configuration DOMPurify pour l'application
 */
const sanitizeConfig = {
  // Autoriser les balises HTML courantes mais sécurisées
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
    'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  // Autoriser les attributs sécurisés
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'class', 'id', 'style',
    'colspan', 'rowspan',
  ],
  // Forcer https pour les liens
  FORCE_BODY: false,
  // Nettoyer les scripts
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  // Interdire les attributs dangereux
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  // Ajouter rel="noopener noreferrer" aux liens externes
  ADD_ATTR: ['target'],
};

/**
 * Sanitize le HTML pour prévenir les injections XSS
 * @param html - Le HTML à nettoyer
 * @returns Le HTML sécurisé
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, sanitizeConfig);
}

/**
 * Sanitize le HTML avec une configuration personnalisée
 * @param html - Le HTML à nettoyer
 * @param config - Configuration DOMPurify personnalisée
 * @returns Le HTML sécurisé
 */
export function sanitizeHtmlWithConfig(html: string, config: Partial<typeof sanitizeConfig>): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, config);
}

/**
 * Vérifie si le HTML contient du contenu potentiellement dangereux
 * @param html - Le HTML à vérifier
 * @returns true si le HTML contient du contenu dangereux
 */
export function isHtmlUnsafe(html: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /onmouseover=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(html));
}
