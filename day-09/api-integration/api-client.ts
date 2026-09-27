/**
 * Day 9: REST API Integration Client
 * TypeScript API Client with endpoints configuration, typed DTOs, and error mapping.
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export const API_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:8000/api',
  timeout: 5000
};

export const API_ENDPOINTS = {
  HEALTH: `${API_CONFIG.baseUrl}/health`,
  STATS: `${API_CONFIG.baseUrl}/facilities/stats`,
  FACILITIES: `${API_CONFIG.baseUrl}/facilities`,
  INSPECTIONS: `${API_CONFIG.baseUrl}/inspections`,
  COMPLAINTS: `${API_CONFIG.baseUrl}/complaints`
};

export class ApiErrorHandler {
  static handle(error: any): string {
    if (error.status === 0) {
      return 'Cannot reach API server. Please ensure the backend is running on port 8000.';
    }
    if (error.status === 422) {
      return 'Validation failed. Please verify the submitted form values.';
    }
    if (error.status === 404) {
      return 'Requested resource was not found.';
    }
    return error.message || 'An unexpected error occurred while contacting the server.';
  }
}
