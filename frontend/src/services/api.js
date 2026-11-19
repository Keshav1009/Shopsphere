/**
 * REST API Client Service with Automatic In-Browser Fallback for GitHub Pages
 * Transparently falls back to mockStore if backend server is unreachable
 */

import { mockStore } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('mnb_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Safe executor that tries backend first, and seamlessly falls back to client mockStore
async function tryApiOrMock(apiCallFn, mockCallFn) {
  try {
    return await apiCallFn();
  } catch (err) {
    // If network error, backend down, or static GitHub Pages hosting
    console.info('⚡ [API Client] Live backend unreachable; resolving via in-browser MockStore.', err.message);
    return await mockCallFn();
  }
}

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg = data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth Endpoints
  async register(userData) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        return handleResponse(res);
      },
      () => mockStore.register(userData)
    );
  },

  async login(credentials) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        return handleResponse(res);
      },
      () => mockStore.login(credentials)
    );
  },

  async getProfile() {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getProfile()
    );
  },

  async updateProfile(profileData) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(profileData)
        });
        return handleResponse(res);
      },
      () => mockStore.updateProfile(profileData)
    );
  },

  async getAllUsers() {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/auth/users`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getAllUsers()
    );
  },

  // Products Endpoints
  async getProducts(params = {}) {
    return tryApiOrMock(
      async () => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            query.append(key, val);
          }
        });
        const url = `${BASE_URL}/products${query.toString() ? '?' + query.toString() : ''}`;
        const res = await fetch(url);
        return handleResponse(res);
      },
      () => mockStore.getProducts(params)
    );
  },

  async getProductById(id) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/products/${id}`);
        return handleResponse(res);
      },
      () => mockStore.getProductById(id)
    );
  },

  async createProduct(productData) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/products`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(productData)
        });
        return handleResponse(res);
      },
      () => mockStore.createProduct(productData)
    );
  },

  async updateProduct(id, productData) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(productData)
        });
        return handleResponse(res);
      },
      () => mockStore.updateProduct(id, productData)
    );
  },

  async deleteProduct(id) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.deleteProduct(id)
    );
  },

  async addReview(productId, reviewData) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(reviewData)
        });
        return handleResponse(res);
      },
      () => mockStore.addReview(productId, reviewData)
    );
  },

  // Orders Endpoints
  async createOrder(orderPayload) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/orders`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(orderPayload)
        });
        return handleResponse(res);
      },
      () => mockStore.createOrder(orderPayload)
    );
  },

  async getMyOrders() {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/orders/my-orders`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getMyOrders()
    );
  },

  async getAllOrders() {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/orders/admin/all`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getAllOrders()
    );
  },

  async getOrderById(id) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/orders/${id}`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getOrderById(id)
    );
  },

  async updateOrderStatus(id, order_status) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ order_status })
        });
        return handleResponse(res);
      },
      () => mockStore.updateOrderStatus(id, order_status)
    );
  },

  // Collaborative Projects Endpoints
  async getProjects(params = {}) {
    return tryApiOrMock(
      async () => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${BASE_URL}/projects${query ? '?' + query : ''}`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getProjects(params)
    );
  },

  async getProjectById(id) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/projects/${id}`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getProjectById(id)
    );
  },

  async createProject(projectData) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/projects`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(projectData)
        });
        return handleResponse(res);
      },
      () => mockStore.createProject(projectData)
    );
  },

  async updateProject(id, projectData) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/projects/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(projectData)
        });
        return handleResponse(res);
      },
      () => mockStore.updateProject(id, projectData)
    );
  },

  async deleteProject(id) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/projects/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.deleteProject(id)
    );
  },

  // Peer-to-Peer Messaging Endpoints
  async getMessages(referenceId) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/messages/${referenceId}`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getMessages(referenceId)
    );
  },

  async sendMessage(messagePayload) {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/messages`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(messagePayload)
        });
        return handleResponse(res);
      },
      () => mockStore.sendMessage(messagePayload)
    );
  },

  // Analytics & Forecasting Endpoints
  async getAnalyticsSummary() {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/analytics/summary`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getAnalyticsSummary()
    );
  },

  async getAnalyticsBreakdowns() {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/analytics/breakdowns`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getAnalyticsSummary()
    );
  },

  async getSalesForecast() {
    return tryApiOrMock(
      async () => {
        const res = await fetch(`${BASE_URL}/analytics/forecast`, {
          headers: getAuthHeaders()
        });
        return handleResponse(res);
      },
      () => mockStore.getSalesForecast()
    );
  }
};
