export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            // Token invalide ou expiré
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');

            // Redirection vers la page de login
            // On utilise window.location pour forcer un rechargement complet et nettoyer l'état
            window.location.href = '/login';

            // On rejette la promesse pour arrêter l'exécution
            throw new Error('Session expirée, veuillez vous reconnecter');
        }

        return response;
    } catch (error) {
        throw error;
    }
};
