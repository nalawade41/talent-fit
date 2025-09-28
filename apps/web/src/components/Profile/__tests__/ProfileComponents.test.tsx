import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { ProfileForm } from '../ProfileForm';
import { AvailabilityToggle } from '../AvailabilityToggle';
import { SkillsSelector } from '../SkillsSelector';
import { CountrySelector } from '../CountrySelector';
import { IndustrySelector } from '../IndustrySelector';

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Profile Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProfileForm', () => {
    const mockEmployee = {
      user_id: '1',
      user: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
      },
      geo: 'US',
      skills: ['React', 'TypeScript'],
      status: 'available' as const,
      type: 'Full-time',
      years_of_experience: 5,
      industry: 'Technology',
      date_of_joining: '2023-01-01',
      end_date: null,
      notice_date: null,
    };

    it('renders profile form with employee data', () => {
      render(<ProfileForm employee={mockEmployee} onSave={vi.fn()} />);

      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    });

    it('calls onSave when form is submitted', async () => {
      const mockOnSave = vi.fn();
      render(<ProfileForm employee={mockEmployee} onSave={mockOnSave} />);

      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('validates required fields', async () => {
      render(<ProfileForm employee={mockEmployee} onSave={vi.fn()} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('AvailabilityToggle', () => {
    it('renders availability toggle with correct initial state', () => {
      render(<AvailabilityToggle isAvailable={true} onToggle={vi.fn()} />);

      expect(screen.getByText('Available for work')).toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
      const mockOnToggle = vi.fn();
      render(<AvailabilityToggle isAvailable={true} onToggle={mockOnToggle} />);

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockOnToggle).toHaveBeenCalledWith(false);
    });

    it('shows correct status text', () => {
      render(<AvailabilityToggle isAvailable={false} onToggle={vi.fn()} />);

      expect(screen.getByText('Not available')).toBeInTheDocument();
    });
  });

  describe('SkillsSelector', () => {
    const availableSkills = ['React', 'TypeScript', 'Node.js', 'Python'];

    it('renders skills selector with available skills', () => {
      render(
        <SkillsSelector
          selectedSkills={['React']}
          availableSkills={availableSkills}
          onSkillsChange={vi.fn()}
        />
      );

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('calls onSkillsChange when skill is selected', () => {
      const mockOnChange = vi.fn();
      render(
        <SkillsSelector
          selectedSkills={['React']}
          availableSkills={availableSkills}
          onSkillsChange={mockOnChange}
        />
      );

      const typescriptSkill = screen.getByText('TypeScript');
      fireEvent.click(typescriptSkill);

      expect(mockOnChange).toHaveBeenCalledWith(['React', 'TypeScript']);
    });

    it('removes skill when clicked again', () => {
      const mockOnChange = vi.fn();
      render(
        <SkillsSelector
          selectedSkills={['React', 'TypeScript']}
          availableSkills={availableSkills}
          onSkillsChange={mockOnChange}
        />
      );

      const reactSkill = screen.getByText('React');
      fireEvent.click(reactSkill);

      expect(mockOnChange).toHaveBeenCalledWith(['TypeScript']);
    });
  });

  describe('CountrySelector', () => {
    it('renders country selector with options', () => {
      render(<CountrySelector value="US" onChange={vi.fn()} />);

      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('calls onChange when country is selected', () => {
      const mockOnChange = vi.fn();
      render(<CountrySelector value="US" onChange={mockOnChange} />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'IN' } });

      expect(mockOnChange).toHaveBeenCalledWith('IN');
    });
  });

  describe('IndustrySelector', () => {
    const industries = ['Technology', 'Finance', 'Healthcare', 'Education'];

    it('renders industry selector with options', () => {
      render(
        <IndustrySelector
          value="Technology"
          industries={industries}
          onChange={vi.fn()}
        />
      );

      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });

    it('calls onChange when industry is selected', () => {
      const mockOnChange = vi.fn();
      render(
        <IndustrySelector
          value="Technology"
          industries={industries}
          onChange={mockOnChange}
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'Finance' } });

      expect(mockOnChange).toHaveBeenCalledWith('Finance');
    });
  });
});
