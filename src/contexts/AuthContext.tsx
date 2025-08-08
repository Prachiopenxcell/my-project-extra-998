import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  User, 
  Organization, 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  UserRole, 
  UserType,
  EntityType,
  ROLE_PERMISSIONS 
} from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ORGANIZATION'; payload: Organization | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  organization: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: []
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER': {
      const user = action.payload;
      return {
        ...state,
        user,
        isAuthenticated: !!user,
        permissions: user ? ROLE_PERMISSIONS[user.role] || [] : [],
        isLoading: false
      };
    }
    
    case 'SET_ORGANIZATION':
      return { ...state, organization: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'UPDATE_USER': {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...action.payload };
      return {
        ...state,
        user: updatedUser,
        permissions: ROLE_PERMISSIONS[updatedUser.role] || []
      };
    }
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };
    
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedOrganization = localStorage.getItem('organization');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'SET_USER', payload: user });
          
          if (storedOrganization) {
            const organization = JSON.parse(storedOrganization);
            dispatch({ type: 'SET_ORGANIZATION', payload: organization });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock login - in real app, this would call your API
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        role: credentials.userRole,
        userType: credentials.userRole.includes('service_seeker') ? UserType.SERVICE_SEEKER : UserType.SERVICE_PROVIDER,
        permissions: ROLE_PERMISSIONS[credentials.userRole] || [],
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({ type: 'SET_USER', payload: mockUser });
      
      // If it's an organization role, create mock organization
      if (credentials.userRole.includes('entity') || credentials.userRole.includes('admin')) {
        const mockOrganization: Organization = {
          id: '1',
          name: 'Sample Organization',
          type: EntityType.ORGANIZATION,
          adminUserId: mockUser.id,
          members: [],
          subscriptions: [],
          isActive: true,
          createdAt: new Date()
        };
        
        localStorage.setItem('organization', JSON.stringify(mockOrganization));
        dispatch({ type: 'SET_ORGANIZATION', payload: mockOrganization });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock registration - in real app, this would call your API
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        userType: data.userType,
        entityType: data.entityType,
        permissions: ROLE_PERMISSIONS[data.role] || [],
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        invitationToken: data.invitationToken
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({ type: 'SET_USER', payload: newUser });
      
      // If registering an organization, create it
      if (data.organizationName && (data.role.includes('entity') || data.role.includes('admin'))) {
        const newOrganization: Organization = {
          id: Date.now().toString(),
          name: data.organizationName,
          type: data.entityType || EntityType.ORGANIZATION,
          adminUserId: newUser.id,
          members: [],
          subscriptions: [],
          isActive: true,
          createdAt: new Date()
        };
        
        localStorage.setItem('organization', JSON.stringify(newOrganization));
        dispatch({ type: 'SET_ORGANIZATION', payload: newOrganization });
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    dispatch({ type: 'LOGOUT' });
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!state.user) return false;
    
    return state.permissions.some(permission => 
      permission.module === module && permission.actions.includes(action)
    );
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    hasPermission,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
