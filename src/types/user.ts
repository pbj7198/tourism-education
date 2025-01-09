export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: 'admin' | 'user';
  createdAt: string;
  status: 'active' | 'blocked';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  confirmPassword?: string;
} 