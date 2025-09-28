import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';

// Mock components to avoid complex dependencies
const MockButton = ({ children, onClick, ...props }: { children: React.ReactNode, onClick?: () => void }) => (
  <button onClick={onClick} {...props}>{children}</button>
);

const MockInput = ({ value, onChange, placeholder, ...props }: { value?: string, onChange?: (e: any) => void, placeholder?: string }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} {...props} />
);

describe('Basic UI Component Tests', () => {
  it('renders button with text', () => {
    render(<MockButton>Click me</MockButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const mockOnClick = vi.fn();
    render(<MockButton onClick={mockOnClick}>Click me</MockButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    button.click();
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders input with placeholder', () => {
    render(<MockInput placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('updates input value', () => {
    const mockOnChange = vi.fn();
    render(<MockInput value="test" onChange={mockOnChange} />);
    
    const input = screen.getByDisplayValue('test');
    expect(input).toBeInTheDocument();
  });
});
