const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

import type { User } from '@/types';

interface LoginResponse {
  token: string;
  user: User;
}

// Mock user data for development
const MOCK_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    id: '1',
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    username: 'user',
    password: 'user123',
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user'
  },
];

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    // Use mock login if enabled
    if (USE_MOCK) {
      const mockUser = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        token: `mock-token-${mockUser.id}`,
        user: mockUser,
      };
    }

    // Real API login
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  async validateToken(token: string): Promise<boolean> {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));
      // Check if token matches our mock token pattern
      return token.startsWith('mock-token-') && MOCK_USERS.some(user => token === `mock-token-${user.id}`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  },
};
