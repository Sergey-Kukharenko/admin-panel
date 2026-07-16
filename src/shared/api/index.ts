// Экспортируем настроенный Axios-клиент для запросов к бэкенду
export { apiClient } from './api-client';

// Реэкспортируем всё, что отдает наружу папка auth (в данном случае userManager)
export * from './auth';
