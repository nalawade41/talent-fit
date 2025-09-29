# Talent Fit - Frontend Application

A modern React-based talent matching platform built with TypeScript, Vite, and Tailwind CSS. This application helps managers find and allocate the right talent for projects while providing employees with visibility into available opportunities.

![React](https://img.shields.io/badge/React-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-green.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-blue.svg)

## 🚀 Features

### For Managers
- **Employee Directory** - Browse and filter all employees by skills, location, availability
- **Project Management** - Create, update, and manage project requirements
- **AI-Powered Matching** - Get intelligent employee suggestions for projects
- **Resource Allocation** - Assign employees to projects with different allocation types
- **Dashboard Analytics** - View utilization metrics and resource availability
- **Real-time Updates** - Live data synchronization across the platform

### For Employees
- **Profile Management** - Maintain skills, experience, and availability status
- **Project Visibility** - View assigned projects and allocation details
- **Skill Development** - Track industry experience and skill progression
- **Notification System** - Receive updates about project assignments

### Authentication & Security
- **Google OAuth Integration** - Secure single sign-on with Google accounts
- **Role-Based Access** - Manager and Employee role separation
- **JWT Token Management** - Secure API authentication
- **Session Persistence** - Automatic login state management

## 🛠 Tech Stack

- **Frontend Framework**: React 19.x with TypeScript
- **Build Tool**: Vite 7.x for fast development and building
- **Styling**: Tailwind CSS 3.x with custom design system
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router 6.x for SPA navigation
- **State Management**: React Context API with custom hooks
- **HTTP Client**: Axios for API communication
- **Authentication**: Google Identity Services
- **Charts**: Recharts for data visualization
- **Notifications**: React Hot Toast for user feedback
- **Development**: ESLint + Prettier for code quality

## 📦 Project Structure

```
apps/web/src/
├── components/           # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── Projects/        # Project-related components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   └── LoginPage.tsx   # Authentication page
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks
│   ├── useProjects.ts  # Project data management
│   └── useProjectFilters.ts # Filtering logic
├── services/           # API service layers
│   ├── api/           # HTTP client configuration
│   ├── projectService.ts
│   ├── employeeProfileService.ts
│   └── managerService.ts
├── types/              # TypeScript type definitions
├── data/              # Mock data and constants
├── utils/             # Utility functions
└── assets/            # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talent-fit/apps/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the web app directory:
   ```bash
   # API Configuration
   VITE_API_URL=http://localhost:8080
   VITE_API_URL_DEV=http://localhost:8080
   
   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Environment
   VITE_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run lint:fix` | Fix auto-fixable ESLint issues |
| `npm run type-check` | Run TypeScript compiler checks |

## 🏗️ Build Process

The application uses Vite for building and bundling:

1. **Development Build**
   ```bash
   npm run dev
   ```
   - Hot Module Replacement (HMR)
   - Source maps for debugging
   - Fast refresh for React components

2. **Production Build**
   ```bash
   npm run build
   ```
   - Code splitting and tree shaking
   - Asset optimization and compression
   - TypeScript compilation and validation
   - Output to `dist/` directory

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue-based primary colors with semantic variants
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 4px base spacing system
- **Components**: Reusable UI components with consistent styling

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive layouts

### User Experience
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Progressive Enhancement**: Graceful fallbacks

## 🔐 Authentication Flow

1. **Google OAuth Sign-In**
   - User clicks Google Sign-In button
   - Google Identity Service handles authentication
   - JWT token received from backend API

2. **Token Management**
   - JWT stored in localStorage
   - Automatic token refresh
   - Secure API request headers

3. **Role-Based Routing**
   - Manager role → Manager dashboard
   - Employee role → Employee dashboard
   - Automatic redirection based on user role

## 🌐 API Integration

### Service Layer Architecture
- **Centralized HTTP Client**: Axios configuration with interceptors
- **Type-Safe APIs**: TypeScript interfaces for all API responses
- **Error Handling**: Consistent error handling across services
- **Loading States**: Built-in loading state management

### Available Services
- **Authentication**: Google OAuth and JWT management
- **Projects**: CRUD operations for project management
- **Employees**: Profile management and directory
- **Allocations**: Project-employee assignment management
- **Manager**: Dashboard metrics and employee operations

## 📱 Key Components

### Pages
- **`LoginPage`**: Google OAuth authentication
- **`EmployeeDashboard`**: Employee portal with projects and profile
- **`ManagerDashboard`**: Manager overview with metrics
- **`ProjectsPage`**: Project listing and management
- **`AllEmployeesPage`**: Employee directory with filtering
- **`ProjectDetailsPage`**: Individual project management

### Reusable Components
- **`ProjectCard`**: Project display with status and actions
- **`EmployeeCard`**: Employee profile with skills and availability
- **`PriorityOverview`**: Project priority statistics
- **`AllocationDialog`**: Employee-project assignment modal

## 🚀 Deployment

### Netlify (Recommended)
The project is configured for Netlify deployment with `netlify.toml`:

1. **Connect Repository**: Link your Git repository to Netlify
2. **Environment Variables**: Set production environment variables
3. **Auto Deploy**: Automatic deployments on push to main branch

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the dist folder to your hosting service
# The built files will be in the dist/ directory
```

## 🔧 Development Guidelines

### Code Style
- **ESLint**: Airbnb configuration with React rules
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Strict mode enabled for type safety
- **Import Order**: Organized imports with clear separation

### Component Guidelines
- **Functional Components**: Use React function components with hooks
- **TypeScript Props**: Define clear interfaces for component props
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Error Boundaries**: Implement error handling for component trees

### State Management
- **Local State**: useState for component-level state
- **Context API**: useContext for shared state (auth, theme)
- **Custom Hooks**: Encapsulate complex state logic
- **API State**: Loading, error, and data states for API calls

## 🐛 Troubleshooting

### Common Issues

**Environment Variables Not Loading**
```bash
# Ensure variables start with VITE_
VITE_API_URL=http://localhost:8080

# Restart development server after adding variables
npm run dev
```

**Google OAuth Not Working**
- Verify `VITE_GOOGLE_CLIENT_ID` is correctly set
- Check Google Cloud Console OAuth configuration
- Ensure authorized domains include your development URL

**API Calls Failing**
- Verify backend server is running
- Check `VITE_API_URL` matches backend URL
- Inspect network tab for CORS issues

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run type checking
npm run type-check
```

## 📊 Performance

### Optimization Strategies
- **Code Splitting**: Dynamic imports for route-based splitting
- **Tree Shaking**: Eliminate unused code in production builds
- **Asset Optimization**: Image compression and lazy loading
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

### Monitoring
- **Web Vitals**: Core web vitals tracking
- **Error Tracking**: Client-side error monitoring
- **Performance Metrics**: Load time and interaction tracking

## 🔒 Security

### Best Practices
- **JWT Storage**: Secure token storage in localStorage
- **XSS Protection**: Input sanitization and validation
- **CSRF Prevention**: Token-based request authentication
- **Environment Variables**: Sensitive data in environment variables only

## 🧪 Testing

### Test Setup (Future Enhancement)
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **MSW**: API mocking for testing

## 📈 Future Enhancements

### Planned Features
- [ ] **Dark Mode**: Theme switching capability
- [ ] **Offline Support**: PWA with service worker
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Advanced Filtering**: More sophisticated search options
- [ ] **Export Features**: CSV/PDF export functionality
- [ ] **Notification Center**: In-app notification system
- [ ] **Mobile App**: React Native version

### Technical Improvements
- [ ] **Test Coverage**: Comprehensive test suite
- [ ] **Accessibility**: WCAG 2.1 compliance
- [ ] **Performance**: Further optimization and caching
- [ ] **Documentation**: Storybook for component documentation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Workflow
- Follow existing code style and patterns
- Add TypeScript types for new features
- Update documentation for significant changes
- Test changes thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For questions or support:
- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on the repository
- **Development**: Contact the development team

---

**Built with ❤️ using React, TypeScript, and Vite**
