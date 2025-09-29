import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { LoginPage } from '../LoginPage';
import { ProtectedRoute } from '../ProtectedRoute';

// Mock the auth context
const mockLogin = vi.fn();
const mockLogout = vi.fn();

const mockUseAuth = vi.fn(() => ({
  user: null,
  role: null,
  login: mockLogin,
  logout: mockLogout,
  isLoading: false,
}));

vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: mockUseAuth,
}));

// Mock the auth context
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    role: null,
    login: mockLogin,
    logout: mockLogout,
    isLoading: false,
  }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Authentication Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LoginPage', () => {
    it('renders login page with sign in form', () => {
      render(<LoginPage />);

      expect(screen.getByText('TalentMatch')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows email and password inputs', () => {
      render(<LoginPage />);

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('calls login when form is submitted', async () => {
      mockLogin.mockResolvedValue(true);
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
      });
    });

    it('shows error message on failed login', async () => {
      mockLogin.mockResolvedValue(false);
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('ProtectedRoute', () => {
    it('renders children when user is authenticated', () => {
      // Mock authenticated user
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'employee' },
        role: 'employee',
        login: mockLogin,
        logout: mockLogout,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', () => {
      // Mock unauthenticated user
      mockUseAuth.mockReturnValue({
        user: null,
        role: null,
        login: mockLogin,
        logout: mockLogout,
        isLoading: false,
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('shows loading state when authentication is in progress', () => {
      // Mock loading state
      mockUseAuth.mockReturnValue({
        user: null,
        role: null,
        login: mockLogin,
        logout: mockLogout,
        isLoading: true,
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
