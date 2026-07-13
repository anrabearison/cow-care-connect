/**
 * Tests de sanitization HTML
 * Valide que DOMPurify supprime les injections XSS
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHtml, isHtmlUnsafe } from '../sanitizeHtml';

describe('Sanitize HTML Tests', () => {
  describe('Scénario 1: Script injection', () => {
    it('doit supprimer les balises script', () => {
      const maliciousHtml = '<script>alert("XSS")</script><p>Contenu valide</p>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert("XSS")');
      expect(sanitized).toContain('Contenu valide');
    });

    it('doit supprimer les scripts avec src', () => {
      const maliciousHtml = '<script src="https://evil.com/malware.js"></script><p>Texte</p>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('<script');
      expect(sanitized).not.toContain('evil.com');
      expect(sanitized).toContain('Texte');
    });
  });

  describe('Scénario 2: Balise img onerror', () => {
    it('doit supprimer l\'attribut onerror', () => {
      const maliciousHtml = '<img src="image.jpg" onerror="alert(\'XSS\')" />';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
      // DOMPurify supprime l'élément entier s'il contient des attributs dangereux
    });

    it('doit supprimer onerror avec code complexe', () => {
      const maliciousHtml = '<img src="x" onerror="document.location=\'http://evil.com\'" />';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('document.location');
      expect(sanitized).not.toContain('evil.com');
    });
  });

  describe('Scénario 3: Iframe', () => {
    it('doit supprimer les balises iframe', () => {
      const maliciousHtml = '<iframe src="https://evil.com"></iframe><p>Contenu</p>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('<iframe');
      expect(sanitized).not.toContain('evil.com');
      expect(sanitized).toContain('Contenu');
    });

    it('doit supprimer les iframes avec onerror', () => {
      const maliciousHtml = '<iframe src="x" onerror="alert(\'XSS\')"></iframe>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('<iframe');
      expect(sanitized).not.toContain('onerror');
    });
  });

  describe('Scénario 4: SVG', () => {
    it('doit supprimer les scripts dans SVG', () => {
      const maliciousHtml = '<svg><script>alert("XSS")</script></svg>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });

    it('doit supprimer les onerror dans SVG', () => {
      const maliciousHtml = '<svg><image href="x" onerror="alert(\'XSS\')" /></svg>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
    });
  });

  describe('Scénario 5: Liens javascript:', () => {
    it('doit supprimer les liens javascript:', () => {
      const maliciousHtml = '<a href="javascript:alert(\'XSS\')">Cliquez ici</a>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).not.toContain('alert');
    });

    it('doit supprimer les liens javascript: avec encodage', () => {
      const maliciousHtml = '<a href="javascript&#58;alert(\'XSS\')">Lien</a>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('javascript');
      expect(sanitized).not.toContain('alert');
    });

    it('doit autoriser les liens https normaux', () => {
      const validHtml = '<a href="https://example.com">Lien valide</a>';
      const sanitized = sanitizeHtml(validHtml);

      expect(sanitized).toContain('https://example.com');
      expect(sanitized).toContain('Lien valide');
    });
  });

  describe('Scénario 6: Contenu HTML valide', () => {
    it('doit conserver le HTML légitime', () => {
      const validHtml = '<p>Paragraphe <strong>gras</strong> et <em>italique</em></p>';
      const sanitized = sanitizeHtml(validHtml);

      expect(sanitized).toContain('<p>');
      expect(sanitized).toContain('<strong>');
      expect(sanitized).toContain('<em>');
      expect(sanitized).toContain('Paragraphe');
      expect(sanitized).toContain('gras');
      expect(sanitized).toContain('italique');
    });

    it('doit conserver les listes', () => {
      const validHtml = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const sanitized = sanitizeHtml(validHtml);

      expect(sanitized).toContain('<ul>');
      expect(sanitized).toContain('<li>');
      expect(sanitized).toContain('Item 1');
      expect(sanitized).toContain('Item 2');
    });

    it('doit conserver les liens valides', () => {
      const validHtml = '<a href="https://example.com" target="_blank">Lien</a>';
      const sanitized = sanitizeHtml(validHtml);

      expect(sanitized).toContain('<a');
      expect(sanitized).toContain('href="https://example.com"');
      expect(sanitized).toContain('Lien');
    });

    it('doit conserver les tableaux', () => {
      const validHtml = '<table><tr><td>Cellule</td></tr></table>';
      const sanitized = sanitizeHtml(validHtml);

      expect(sanitized).toContain('<table>');
      expect(sanitized).toContain('<tr>');
      expect(sanitized).toContain('<td>');
      expect(sanitized).toContain('Cellule');
    });
  });

  describe('Scénario 7: Cas limites', () => {
    it('doit retourner une chaîne vide pour null', () => {
      const sanitized = sanitizeHtml(null as any);
      expect(sanitized).toBe('');
    });

    it('doit retourner une chaîne vide pour undefined', () => {
      const sanitized = sanitizeHtml(undefined as any);
      expect(sanitized).toBe('');
    });

    it('doit retourner une chaîne vide pour une chaîne vide', () => {
      const sanitized = sanitizeHtml('');
      expect(sanitized).toBe('');
    });

    it('doit retourner une chaîne vide pour un non-string', () => {
      const sanitized = sanitizeHtml(123 as any);
      expect(sanitized).toBe('');
    });
  });

  describe('Scénario 8: Détection de contenu dangereux', () => {
    it('doit détecter les scripts', () => {
      const maliciousHtml = '<script>alert("XSS")</script>';
      expect(isHtmlUnsafe(maliciousHtml)).toBe(true);
    });

    it('doit détecter les liens javascript:', () => {
      const maliciousHtml = '<a href="javascript:alert(\'XSS\')">Lien</a>';
      expect(isHtmlUnsafe(maliciousHtml)).toBe(true);
    });

    it('doit détecter onerror', () => {
      const maliciousHtml = '<img src="x" onerror="alert(\'XSS\')" />';
      expect(isHtmlUnsafe(maliciousHtml)).toBe(true);
    });

    it('doit détecter les iframes', () => {
      const maliciousHtml = '<iframe src="https://evil.com"></iframe>';
      expect(isHtmlUnsafe(maliciousHtml)).toBe(true);
    });

    it('doit détecter onload', () => {
      const maliciousHtml = '<img src="x" onload="alert(\'XSS\')" />';
      expect(isHtmlUnsafe(maliciousHtml)).toBe(true);
    });

    it('doit détecter onclick', () => {
      const maliciousHtml = '<div onclick="alert(\'XSS\')">Cliquez</div>';
      expect(isHtmlUnsafe(maliciousHtml)).toBe(true);
    });

    it('ne doit pas détecter le HTML valide comme dangereux', () => {
      const validHtml = '<p>Paragraphe <strong>gras</strong></p>';
      expect(isHtmlUnsafe(validHtml)).toBe(false);
    });
  });

  describe('Scénario 9: Attributs dangereux multiples', () => {
    it('doit supprimer tous les attributs on*', () => {
      const maliciousHtml = '<div onclick="alert(1)" onmouseover="alert(2)" onfocus="alert(3)">Texte</div>';
      const sanitized = sanitizeHtml(maliciousHtml);

      expect(sanitized).not.toContain('onclick');
      expect(sanitized).not.toContain('onmouseover');
      expect(sanitized).not.toContain('onfocus');
      expect(sanitized).toContain('Texte');
    });
  });

  describe('Scénario 10: Encodage et échappement', () => {
    it('doit gérer les entités HTML', () => {
      const validHtml = '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>';
      const sanitized = sanitizeHtml(validHtml);

      expect(sanitized).toContain('&lt;');
      expect(sanitized).toContain('&gt;');
    });
  });
});
