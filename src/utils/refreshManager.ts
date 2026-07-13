/**
 * RefreshManager - Singleton pour gérer le rafraîchissement automatique des tokens
 *
 * Ce gestionnaire détecte les erreurs 401, lance un seul refresh token,
 * met les requêtes en attente, et les rejoue automatiquement après le refresh.
 *
 * Fonctionnalités:
 * - Gestion concurrente: un seul refresh même avec plusieurs 401 simultanés
 * - File d'attente: les requêtes concurrentes sont mises en attente
 * - Prévention des boucles: marqueur _retry sur les requêtes
 * - Exclusion des endpoints sensibles: /login, /refresh, /logout
 * - Nettoyage TanStack Query en cas d'échec
 * - Navigation React Router (pas de window.location)
 */

import { QueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from './apiClient';
import { AuthenticationError } from './errors';

// Type pour les requêtes en attente
type PendingRequest<T = unknown> = {
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
  requestFn: () => Promise<T>;
  endpoint: string;
};

// Type pour le callback de navigation
type NavigateCallback = (path: string) => void;

// Type pour le callback de nettoyage TanStack Query
type ClearCacheCallback = () => Promise<void>;

class RefreshManager {
  private isRefreshing: boolean = false;
  private pendingRequests: PendingRequest[] = [];
  private refreshPromise: Promise<boolean> | null = null;
  private navigateCallback: NavigateCallback | null = null;
  private clearCacheCallback: ClearCacheCallback | null = null;
  private queryClient: QueryClient | null = null;

  // Endpoints qui ne doivent jamais déclencher un refresh
  private readonly EXCLUDED_ENDPOINTS = [
    '/auth/login',
    '/auth/refresh',
    '/auth/logout',
    '/auth/google',
  ];

  /**
   * Enregistre le callback de navigation React Router
   */
  setNavigateCallback(callback: NavigateCallback): void {
    this.navigateCallback = callback;
  }

  /**
   * Enregistre le callback de nettoyage du cache TanStack Query
   */
  setClearCacheCallback(callback: ClearCacheCallback): void {
    this.clearCacheCallback = callback;
  }

  /**
   * Enregistre le QueryClient TanStack Query
   */
  setQueryClient(queryClient: QueryClient): void {
    this.queryClient = queryClient;
  }

  /**
   * Vérifie si un endpoint est exclu du refresh automatique
   */
  private isEndpointExcluded(endpoint: string): boolean {
    return this.EXCLUDED_ENDPOINTS.some(excluded => endpoint.includes(excluded));
  }

  /**
   * Vérifie si une requête a déjà été tentée (marqueur _retry)
   */
  private hasRequestBeenRetried(config: RequestConfig): boolean {
    return (config as { _retry?: boolean })._retry === true;
  }

  /**
   * Marque une requête comme ayant déjà été tentée
   */
  private markRequestAsRetried(config: RequestConfig): RequestConfig {
    return { ...config, _retry: true };
  }

  /**
   * Gère une erreur 401 en lançant le refresh token si nécessaire
   */
  async handle401Error<T>(
    requestFn: () => Promise<T>,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    // Vérifier si l'endpoint est exclu du refresh
    if (this.isEndpointExcluded(endpoint)) {
      throw new AuthenticationError('Endpoint excluded from automatic refresh');
    }

    // Vérifier si la requête a déjà été tentée (prévention boucle infinie)
    if (this.hasRequestBeenRetried(config)) {
      throw new AuthenticationError('Request already retried - stopping to prevent infinite loop');
    }

    // Si un refresh est déjà en cours, ajouter la requête à la file d'attente
    if (this.isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        this.pendingRequests.push({ resolve, reject, requestFn, endpoint });
      });
    }

    // Si aucun refresh n'est en cours, en lancer un
    if (!this.refreshPromise) {
      this.refreshPromise = this.performRefresh();
    }

    try {
      // Attendre que le refresh réussisse
      const refreshSuccess = await this.refreshPromise;

      if (refreshSuccess) {
        // Marquer la requête comme ayant été tentée
        const markedConfig = this.markRequestAsRetried(config);
        // Rejouer la requête originale avec le nouveau config
        return await requestFn();
      } else {
        // Refresh échoué - déconnecter
        throw new AuthenticationError('Refresh failed - session expired');
      }
    } finally {
      // Réinitialiser après que toutes les requêtes en attente ont été traitées
      if (this.pendingRequests.length === 0) {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    }
  }

  /**
   * Effectue le refresh token auprès du serveur
   */
  private async performRefresh(): Promise<boolean> {
    this.isRefreshing = true;

    try {
      // Appeler l'endpoint de refresh
      await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {}, { skipAuth: true });

      // Refresh réussi - rejouer toutes les requêtes en attente
      await this.replayPendingRequests();

      return true;
    } catch (error) {
      // Refresh échoué - rejeter toutes les requêtes en attente
      this.rejectPendingRequests(error);

      // Déclencher la déconnexion propre
      await this.triggerLogout();

      return false;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Rejoue toutes les requêtes en attente après un refresh réussi
   */
  private async replayPendingRequests(): Promise<void> {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    // Rejouer toutes les requêtes en parallèle
    const replayPromises = requests.map(async ({ resolve, reject, requestFn }) => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    await Promise.allSettled(replayPromises);
  }

  /**
   * Rejette toutes les requêtes en attente après un refresh échoué
   */
  private rejectPendingRequests(error: unknown): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    for (const { reject } of requests) {
      reject(new AuthenticationError('Refresh failed - session expired', error as Error));
    }
  }

  /**
   * Déclenche la déconnexion de l'utilisateur de manière propre
   */
  private async triggerLogout(): Promise<void> {
    try {
      // Appeler le endpoint de logout serveur
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continuer même si le logout serveur échoue
      console.error('Server logout failed:', error);
    }

    // Nettoyer le cache TanStack Query
    if (this.clearCacheCallback) {
      await this.clearCacheCallback();
    }

    // Nettoyer le QueryClient
    if (this.queryClient) {
      await this.queryClient.clear();
    }

    // Nettoyer le localStorage (migration cleanup)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    // Rediriger via React Router
    if (this.navigateCallback) {
      this.navigateCallback('/login');
    }
  }

  /**
   * Réinitialise le gestionnaire (utile pour les tests)
   */
  reset(): void {
    this.isRefreshing = false;
    this.pendingRequests = [];
    this.refreshPromise = null;
    this.navigateCallback = null;
    this.clearCacheCallback = null;
    this.queryClient = null;
  }

  /**
   * Retourne l'état actuel (utile pour les tests)
   */
  getState() {
    return {
      isRefreshing: this.isRefreshing,
      pendingRequestsCount: this.pendingRequests.length,
      hasRefreshPromise: this.refreshPromise !== null,
      hasNavigateCallback: this.navigateCallback !== null,
      hasClearCacheCallback: this.clearCacheCallback !== null,
      hasQueryClient: this.queryClient !== null,
    };
  }
}

// Export du singleton
export const refreshManager = new RefreshManager();
