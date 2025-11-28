/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Erreur réseau, veuillez vérifier votre connexion') {
        super(message, 'NETWORK_ERROR', 0);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Session expirée, veuillez vous reconnecter') {
        super(message, 'AUTH_ERROR', 401);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id?: string | number) {
        const message = id
            ? `${resource} avec l'identifiant '${id}' introuvable`
            : `${resource} introuvable`;
        super(message, 'NOT_FOUND', 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public field?: string) {
        super(message, 'VALIDATION_ERROR', 422);
    }
}

export class BusinessRuleError extends AppError {
    constructor(message: string) {
        super(message, 'BUSINESS_RULE_ERROR', 400);
    }
}

export class ServerError extends AppError {
    constructor(message: string = 'Erreur serveur, veuillez réessayer plus tard') {
        super(message, 'SERVER_ERROR', 500);
    }
}

/**
 * Convert HTTP status code to appropriate error
 */
export function createErrorFromStatus(status: number, message?: string): AppError {
    switch (status) {
        case 401:
            return new AuthenticationError(message);
        case 404:
            return new NotFoundError(message || 'Ressource');
        case 422:
            return new ValidationError(message || 'Données invalides');
        case 400:
            return new BusinessRuleError(message || 'Opération non autorisée');
        case 500:
        case 502:
        case 503:
            return new ServerError(message);
        default:
            return new AppError(message || 'Une erreur est survenue', 'UNKNOWN_ERROR', status);
    }
}

/**
 * Error messages centralisés
 */
export const ErrorMessages = {
    NETWORK: 'Erreur réseau, veuillez vérifier votre connexion',
    AUTH_EXPIRED: 'Session expirée, veuillez vous reconnecter',
    SERVER: 'Erreur serveur, veuillez réessayer plus tard',
    NOT_FOUND: 'Ressource introuvable',
    VALIDATION: 'Données invalides',
    UNKNOWN: 'Une erreur est survenue',

    // Cattle specific
    CATTLE_LOAD_ERROR: 'Erreur lors du chargement de la liste des bovins',
    CATTLE_GET_ERROR: 'Erreur lors du chargement du bovin',
    CATTLE_CREATE_ERROR: 'Erreur lors de la création du bovin',
    CATTLE_UPDATE_ERROR: 'Erreur lors de la mise à jour du bovin',
    CATTLE_DELETE_ERROR: 'Erreur lors de la suppression du bovin',

    // Auth specific
    LOGIN_ERROR: 'Identifiants incorrects',
    LOGOUT_ERROR: 'Erreur lors de la déconnexion',
} as const;
