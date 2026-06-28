const API_BASE_URL = 'http://localhost:8080';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('birthday_gift_token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('birthday_gift_token');
    localStorage.removeItem('birthday_gift_user');
    window.location.href = '/login';
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
  }

  const result: ApiResponse<T> = await response.json().catch(() => ({
    success: response.ok,
  }));

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || '요청이 실패했습니다.');
  }

  return result.data as T;
}

export const api = {
  auth: {
    login: async (email: string, password = 'password') => {
      const data = await request<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('birthday_gift_token', data.token);
      return data.user;
    },
    register: async (username: string, email: string, password = 'password', role: 'GIVER' | 'RECIPIENT') => {
      const data = await request<{ token: string; user: any }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, role }),
      });
      localStorage.setItem('birthday_gift_token', data.token);
      return data.user;
    },
    getMe: () => request<any>('/api/auth/me'),
  },

  events: {
    list: () => request<any[]>('/api/events'),
    get: (id: string | number) => request<any>(`/api/events/${id}`),
    create: (eventData: any) => request<any>('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
    update: (id: string | number, eventData: any) => request<any>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
    delete: (id: string | number) => request<void>(`/api/events/${id}`, {
      method: 'DELETE',
    }),
    send: (id: string | number) => request<any>(`/api/events/${id}/send`, {
      method: 'POST',
    }),
    complete: (id: string | number) => request<any>(`/api/events/${id}/complete`, {
      method: 'PATCH',
    }),
    getInvite: (id: string | number) => request<any>(`/api/invite/${id}`),
  },

  options: {
    add: (eventId: string | number, optionData: any) => request<any>(`/api/events/${eventId}/options`, {
      method: 'POST',
      body: JSON.stringify(optionData),
    }),
    delete: (eventId: string | number, optionId: string | number) => request<void>(`/api/events/${eventId}/options/${optionId}`, {
      method: 'DELETE',
    }),
  },

  selections: {
    select: (eventId: string | number, selectedOptionId: string | number) => request<any>(`/api/events/${eventId}/select`, {
      method: 'POST',
      body: JSON.stringify({ selectedOptionId }),
    }),
    get: (eventId: string | number) => request<any>(`/api/events/${eventId}/selection`),
  },
};
