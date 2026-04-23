import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { storage } from '../utils/storage';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../utils/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User };

interface AuthContextType extends AuthState {
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: storage.get<User>(USER_KEY),
  token: storage.get<string>(AUTH_TOKEN_KEY),
  refreshToken: storage.get<string>(REFRESH_TOKEN_KEY),
  isAuthenticated: !!storage.get<string>(AUTH_TOKEN_KEY),
  isLoading: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      storage.set(AUTH_TOKEN_KEY, state.token);
    } else {
      storage.remove(AUTH_TOKEN_KEY);
    }
  }, [state.token]);

  useEffect(() => {
    if (state.refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, state.refreshToken);
    } else {
      storage.remove(REFRESH_TOKEN_KEY);
    }
  }, [state.refreshToken]);

  useEffect(() => {
    if (state.user) {
      storage.set(USER_KEY, state.user);
    } else {
      storage.remove(USER_KEY);
    }
  }, [state.user]);

  const login = useCallback((user: User, token: string, refreshToken: string) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken } });
  }, []);

  const logout = useCallback(() => {
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    storage.remove(USER_KEY);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setUser = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

