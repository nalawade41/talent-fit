import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';

// Mock Login Form Component
const MockLoginForm = ({ onSubmit }: { onSubmit: (email: string, password: string) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    onSubmit(email, password);
  };

  return (
    <div data-testid="login-form">
      <h1>TalentMatch</h1>
      <p>Sign in to your account</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="Enter your email"
            defaultValue=""
          />
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="Enter your password"
            defaultValue=""
          />
        </div>
        
        <button type="submit">Sign In</button>
      </form>
      
      <div>
        <h3>Demo Accounts:</h3>
        <div>Employee: sarah@company.com / demo123</div>
        <div>Manager: michael@company.com / demo123</div>
      </div>
    </div>
  );
};

// Mock Protected Route Component
const MockProtectedRoute = ({ 
  children, 
  isAuthenticated = false 
}: { 
  children: React.ReactNode, 
  isAuthenticated?: boolean 
}) => {
  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }
  return <>{children}</>;
};

describe('Authentication Workflow Tests', () => {
  it('renders login form with correct elements', () => {
    const mockOnSubmit = vi.fn();
    render(<MockLoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('TalentMatch')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows demo account information', () => {
    const mockOnSubmit = vi.fn();
    render(<MockLoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Demo Accounts:')).toBeInTheDocument();
    expect(screen.getByText('Employee: sarah@company.com / demo123')).toBeInTheDocument();
    expect(screen.getByText('Manager: michael@company.com / demo123')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', () => {
    const mockOnSubmit = vi.fn();
    render(<MockLoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('renders protected content when authenticated', () => {
    render(
      <MockProtectedRoute isAuthenticated={true}>
        <div>Protected Content</div>
      </MockProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows redirect message when not authenticated', () => {
    render(
      <MockProtectedRoute isAuthenticated={false}>
        <div>Protected Content</div>
      </MockProtectedRoute>
    );

    expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
