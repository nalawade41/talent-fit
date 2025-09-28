# Testing Suite for Talent Fit Web Application

This directory contains a comprehensive automated testing suite for the Talent Fit web application, focusing on UI validation and data integrity for the employee section.

## 🧪 Testing Framework

- **Vitest**: Fast, modern test runner with Jest-compatible API
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM simulation for browser environment
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing

## 📁 Test Structure

```
src/
├── __tests__/                          # Integration tests
│   └── employee-workflow.test.tsx      # End-to-end employee workflow
├── components/
│   ├── __tests__/                      # Component unit tests
│   │   └── auth-components.test.tsx    # Authentication components
│   ├── pages/
│   │   └── __tests__/
│   │       └── EmployeeDashboard.test.tsx  # Dashboard tests
│   ├── Profile/
│   │   └── __tests__/
│   │       └── ProfileComponents.test.tsx  # Profile component tests
│   └── ui/
│       └── __tests__/
│           └── ui-components.test.tsx      # UI component tests
├── data/
│   └── __tests__/
│       └── data-validation.test.ts         # Data validation tests
└── test/
    ├── setup.ts                          # Test environment setup
    ├── test-utils.tsx                    # Testing utilities and mocks
    └── __mocks__/                        # Mock implementations
        ├── external.ts                   # External library mocks
        └── hooks.ts                      # Custom hook mocks
```

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests once (CI mode)
```bash
npm run test:run
```

### Run tests with UI
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## 🧪 Test Categories

### 1. Component Unit Tests
- **EmployeeDashboard.test.tsx**: Tests dashboard rendering, data display, and user interactions
- **ProfileComponents.test.tsx**: Tests profile form, availability toggle, skills selector, and other profile components
- **ui-components.test.tsx**: Tests shadcn/ui components (Button, Input, Card, Badge, Select)
- **auth-components.test.tsx**: Tests authentication flow, protected routes, and role-based rendering

### 2. Data Validation Tests
- **data-validation.test.ts**: Validates data structure, relationships, and business logic
  - Employee data integrity
  - Project data validation
  - Allocation data consistency
  - Filtering function correctness

### 3. Integration Tests
- **employee-workflow.test.tsx**: End-to-end employee workflow testing
  - Dashboard loading and data display
  - Profile page navigation and editing
  - Data consistency across components
  - Error handling and loading states

## 🔧 Test Configuration

### Environment Setup (`src/test/setup.ts`)
- Configures jsdom environment
- Mocks browser APIs (localStorage, sessionStorage, matchMedia, etc.)
- Sets up global test utilities

### Test Utilities (`src/test/test-utils.tsx`)
- Custom render function with providers
- Mock data generators
- Common test helpers

### Mocks (`src/test/__mocks__/`)
- External library mocks (react-router-dom, recharts, lucide-react)
- Custom hook mocks
- Context provider mocks

## 📊 Coverage Areas

### UI Components
- ✅ Button interactions and variants
- ✅ Form inputs and validation
- ✅ Card layouts and content
- ✅ Badge variants and display
- ✅ Select dropdowns and options

### Employee Features
- ✅ Dashboard data display
- ✅ Profile form editing
- ✅ Availability toggle functionality
- ✅ Skills selection and management
- ✅ Country and industry selectors

### Authentication
- ✅ Login flow simulation
- ✅ Role-based access control
- ✅ Protected route behavior
- ✅ Navigation and routing

### Data Integrity
- ✅ Employee data structure validation
- ✅ Project data consistency
- ✅ Allocation relationship integrity
- ✅ Filtering function accuracy

## 🎯 Test Best Practices

### Naming Conventions
- Test files: `*.test.tsx` or `*.test.ts`
- Test descriptions: Clear, descriptive names
- Test cases: `it('should do something specific')`

### Test Organization
- Arrange-Act-Assert pattern
- One concept per test
- Descriptive test names
- Proper cleanup with `beforeEach`

### Mocking Strategy
- Mock external dependencies
- Mock API calls and data fetching
- Mock browser APIs
- Use realistic mock data

### Assertions
- Test user-visible behavior
- Test component props and state
- Test event handlers
- Test accessibility attributes

## 🔄 CI/CD Integration

Tests are configured to run in CI environments with:
- Headless browser simulation via jsdom
- Comprehensive coverage reporting
- Automated test execution on commits
- Failure notifications and reporting

## 📈 Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## 🐛 Debugging Tests

### Debug Mode
```bash
npm test -- --reporter=verbose
```

### Single Test Debug
```bash
npm test EmployeeDashboard.test.tsx
```

### Visual Debugging
```bash
npm run test:ui
```

## 📝 Adding New Tests

1. Create test file in appropriate `__tests__/` directory
2. Import necessary utilities from `../test-utils`
3. Mock external dependencies
4. Write descriptive test cases
5. Run tests to ensure they pass

Example:
```typescript
import { render, screen } from '../test-utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

## 🔧 Maintenance

- Keep mocks up-to-date with component changes
- Update test data when schema changes
- Review and update coverage goals regularly
- Remove obsolete tests and mocks

## 📞 Support

For questions about the testing suite:
- Check existing test examples
- Review Vitest and React Testing Library documentation
- Ensure proper mock setup for new dependencies
