import { DataProvider, fetchUtils } from 'react-admin';
import { stringify } from 'qs';
import { API_CONFIG } from '@/config/api';

// Global getter for selected owner ID (will be set by AdminApp)
let getSelectedOwnerIdFn: (() => string | null) | null = null;

export const setOwnerIdGetter = (fn: () => string | null) => {
  getSelectedOwnerIdFn = fn;
};




// Provider pour les vraies APIs
const apiUrl = API_CONFIG.ADMIN_API_URL;

// Custom HTTP client avec authentification JWT
const httpClient = (url: string, options: any = {}) => {
  const token = localStorage.getItem('auth_token');
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  return fetchUtils.fetchJson(url, options);
};

// Map React Admin resource names to API endpoints
const getResourcePath = (resource: string) => {
  const resourceMap: Record<string, string> = {
    'typeEvenements': 'event-types',
    'herd-books': 'herd-books',
    'herd-book-cattle': 'herd-book-cattle',
    // Add other mappings if needed
  };
  return resourceMap[resource] || resource;
};

// Helper function to transform cattle data before sending to API
const transformCattleData = (data: any) => {
  const transformed = { ...data };

  // Extract IDs from reference objects
  if (transformed.category && typeof transformed.category === 'object') {
    transformed.category = transformed.category.id;
  }
  if (transformed.character && typeof transformed.character === 'object') {
    transformed.character = transformed.character.id;
  }
  if (transformed.status && typeof transformed.status === 'object') {
    transformed.status = transformed.status.id;
  }

  // Remove status from payload as it is not accepted by backend on create/update
  if ('status' in transformed) {
    delete transformed.status;
  }

  // Remove purchaseCategory from source if present (not supported by backend)
  if (transformed.source && 'purchaseCategory' in transformed.source) {
    delete transformed.source.purchaseCategory;
  }

  return transformed;
};

// Helper function to transform herd-book-cattle data before sending to API
const transformHerdBookCattleData = (data: any) => {
  const transformed = { ...data };

  // Map snake_case to camelCase and resolve references to IDs
  if (transformed.herd_book_id) {
    transformed.herdBookId = typeof transformed.herd_book_id === 'object' ? transformed.herd_book_id.id : transformed.herd_book_id;
    delete transformed.herd_book_id;
  }
  if (transformed.cattle_id) {
    transformed.cattleId = typeof transformed.cattle_id === 'object' ? transformed.cattle_id.id : transformed.cattle_id;
    delete transformed.cattle_id;
  }
  if (transformed.category_id) {
    transformed.categoryId = typeof transformed.category_id === 'object' ? transformed.category_id.id : transformed.category_id;
    delete transformed.category_id;
  }
  if (transformed.status_id) {
    transformed.statusId = typeof transformed.status_id === 'object' ? transformed.status_id.id : transformed.status_id;
    delete transformed.status_id;
  }
  if (transformed.n_carnet !== undefined) {
    transformed.nCarnet = transformed.n_carnet;
    delete transformed.n_carnet;
  }

  // Also extract references from nested cattle if present
  if (transformed.cattle) {
    transformed.cattle = transformCattleData(transformed.cattle);
  }

  return transformed;
};

const realDataProvider: DataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    // Add owner_id if available (for super admin)
    const selectedOwnerId = getSelectedOwnerIdFn?.();
    const query = {
      page,
      per_page: perPage,
      sort: field,
      order: order,
      ...params.filter,
      ...(selectedOwnerId && { owner_id: selectedOwnerId }),
    };
    const url = `${apiUrl}/${getResourcePath(resource)}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.data || json,
      total: json.total || parseInt(headers.get('x-total-count') || '0', 10),
    }));
  },

  getOne: (resource, params) => {
    const selectedOwnerId = getSelectedOwnerIdFn?.();
    const query = selectedOwnerId ? stringify({ owner_id: selectedOwnerId }) : '';
    const url = `${apiUrl}/${getResourcePath(resource)}/${params.id}${query ? `?${query}` : ''}`;
    return httpClient(url).then(({ json }) => ({
      data: json,
    }));
  },

  getMany: (resource, params) => {
    const selectedOwnerId = getSelectedOwnerIdFn?.();
    const query = stringify(
      {
        id: params.ids,
        ...(selectedOwnerId && { owner_id: selectedOwnerId }),
      },
      { arrayFormat: 'repeat' }
    );
    const url = `${apiUrl}/${getResourcePath(resource)}?${query}`;
    return httpClient(url).then(({ json }) => ({ data: json.data || json }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    // Add owner_id if available (for super admin)
    const selectedOwnerId = getSelectedOwnerIdFn?.();
    const query = {
      page,
      per_page: perPage,
      sort: field,
      order: order,
      ...params.filter,
      [params.target]: params.id,
      ...(selectedOwnerId && { owner_id: selectedOwnerId }),
    };
    const url = `${apiUrl}/${getResourcePath(resource)}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.data || json,
      total: json.total || parseInt(headers.get('x-total-count') || '0', 10),
    }));
  },

  update: (resource, params) => {
    // Transform data before sending depending on resource
    let data = params.data;
    if (resource === 'cattle') {
      data = transformCattleData(params.data);
    } else if (resource === 'herd-book-cattle') {
      data = transformHerdBookCattleData(params.data);
    }

    const selectedOwnerId = getSelectedOwnerIdFn?.();
    const query = selectedOwnerId ? stringify({ owner_id: selectedOwnerId }) : '';
    const url = `${apiUrl}/${getResourcePath(resource)}/${params.id}${query ? `?${query}` : ''}`;

    return httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(({ json }) => ({ data: json }));
  },


  updateMany: (resource, params) => {
    const query = stringify({ id: params.ids }, { arrayFormat: 'repeat' });
    return httpClient(`${apiUrl}/${getResourcePath(resource)}?${query}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: params.ids }));
  },

  create: (resource, params) => {
    if (resource === 'cattle') {
      // Extract herd_book_id and n_carnet from data
      const { herd_book_id, n_carnet, ...cattleData } = params.data;

      // Transform cattle data
      const transformedData = transformCattleData(cattleData);

      // Build query params for herd book registration
      const queryParams: Record<string, string> = {};
      if (herd_book_id) queryParams.herd_book_id = herd_book_id;
      if (n_carnet) queryParams.n_carnet = n_carnet;

      const queryString = Object.keys(queryParams).length > 0
        ? '?' + stringify(queryParams)
        : '';

      return httpClient(`${apiUrl}/${getResourcePath(resource)}${queryString}`, {
        method: 'POST',
        body: JSON.stringify(transformedData),
      }).then(({ json }) => ({
        data: json,
      }));
    } else if (resource === 'herd-book-cattle') {
      const transformedData = transformHerdBookCattleData(params.data);
      return httpClient(`${apiUrl}/${getResourcePath(resource)}`, {
        method: 'POST',
        body: JSON.stringify(transformedData),
      }).then(({ json }) => ({
        data: json,
      }));
    }

    // Default behavior for other resources
    const data = params.data;
    return httpClient(`${apiUrl}/${getResourcePath(resource)}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(({ json }) => ({
      data: json,
    }));
  },


  delete: (resource, params) => {
    const selectedOwnerId = getSelectedOwnerIdFn?.();
    const query = selectedOwnerId ? stringify({ owner_id: selectedOwnerId }) : '';
    const url = `${apiUrl}/${getResourcePath(resource)}/${params.id}${query ? `?${query}` : ''}`;

    return httpClient(url, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json }));
  },

  deleteMany: (resource, params) => {
    const query = stringify({ id: params.ids }, { arrayFormat: 'repeat' });
    return httpClient(`${apiUrl}/${getResourcePath(resource)}?${query}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: params.ids }));
  },
};

// Export du provider
export const dataProvider = realDataProvider;