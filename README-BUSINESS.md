# Al Fatah Enterprise - Industrial Equipment & Solutions Provider

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-green.svg)](https://vitejs.dev/)

Al Fatah Enterprise is a modern, responsive web application for an industrial equipment supplier and solutions provider based in the UAE. Built with cutting-edge web technologies to provide an exceptional user experience across all devices.

## 🌟 Features

### 🏢 Business Website
- **Modern Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Company Overview** - Comprehensive information about services and capabilities
- **Project Portfolio** - Showcase of completed industrial projects
- **Service Catalog** - Detailed service offerings with interactive features
- **Team Information** - Professional team member profiles
- **Client Testimonials** - Customer feedback and success stories
- **Contact Integration** - Multiple contact methods and inquiry forms
- **News & Updates** - Company news and industry insights

### 🔧 Technical Features
- **Progressive Web App (PWA) Ready** - Offline capabilities and app-like experience
- **SEO Optimized** - Meta tags, structured data, and sitemap generation
- **Performance Optimized** - Code splitting, lazy loading, and resource optimization
- **Accessibility** - WCAG 2.1 compliant design and keyboard navigation
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Real-time Health Monitoring** - System status and API health checks
- **TypeScript** - Full type safety and enhanced developer experience
- **Modern CI/CD** - Automated testing and deployment pipelines

### 🚀 Government Procurement Integration
- **Tender Management** - Browse and bid on government contracts
- **User Authentication** - Secure login with role-based access control
- **Document Management** - Upload and manage procurement documents
- **Bid Submission** - Complete bidding workflow with validation
- **Dashboard** - Personalized user dashboard for suppliers and officials

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Fast build tool with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Smooth animations and interactions
- **React Router** - Client-side routing with lazy loading
- **Axios** - HTTP client with interceptors and retry logic
- **React Hook Form** - Performant forms with validation

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Reliable relational database
- **Prisma ORM** - Type-safe database client and migration tool
- **JWT Authentication** - Secure authentication with refresh tokens
- **Winston Logging** - Comprehensive logging and monitoring
- **Redis** - Caching and session management
- **Passport.js** - Authentication middleware with multiple strategies

### Development & Deployment
- **ESLint & Prettier** - Code linting and formatting
- **Husky** - Git hooks for quality assurance
- **Jest** - Unit and integration testing
- **Docker** - Containerization for consistent deployments
- **GitHub Actions** - Automated CI/CD pipelines

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (v14.0 or higher)
- **Redis** (v6.0 or higher) - Optional, for caching

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/alfatah-enterprise.git
cd alfatah-enterprise
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

```bash
# Copy environment files
cp .env.example .env.local
cp backend/.env.example backend/.env

# Edit the environment files with your configuration
```

### 4. Database Setup

```bash
# Navigate to backend
cd backend

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

cd ..
```

### 5. Start Development Servers

```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start frontend development server
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database Studio**: http://localhost:5555 (run `npm run db:studio` in backend)

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
# API Configuration
VITE_API_BASE_URL="http://localhost:3001/api/v1"
VITE_APP_NAME="Al Fatah Enterprise"

# Company Information
VITE_CONTACT_EMAIL="info@alfatahenterprise.com"
VITE_CONTACT_PHONE="+971-4-123-4567"

# Feature Flags
VITE_ENABLE_AUTH=true
VITE_ENABLE_NEWSLETTER=true
```

#### Backend (backend/.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/alfatah_enterprise"

# Authentication
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
```

## 🏗️ Build & Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:production
```

### Preview Production Build
```bash
npm run preview
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up --build
```

## 📁 Project Structure

```
alfatah-enterprise/
├── src/                      # Frontend source code
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   └── business/        # Business-specific components
│   ├── pages/               # Page components
│   ├── services/            # API services and utilities
│   ├── contexts/            # React context providers
│   ├── config/              # Configuration files
│   └── styles/              # CSS and styling files
├── backend/                 # Backend source code
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business services
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   ├── prisma/              # Database schema and migrations
│   └── tests/               # Backend tests
├── public/                  # Static assets
├── docs/                    # Documentation
└── docker/                  # Docker configuration files
```

## 🧪 Testing

### Run All Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Integration tests
npm run test:integration
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 Performance

This application is optimized for performance with:

- **Code Splitting** - Lazy loading of route components
- **Asset Optimization** - Minified CSS, JavaScript, and images
- **Caching Strategy** - HTTP caching and CDN integration
- **Bundle Analysis** - Regular bundle size monitoring
- **Performance Monitoring** - Real-time performance metrics

### Performance Metrics
- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)

## 🔒 Security

Security measures implemented:

- **HTTPS Enforcement** - All communications encrypted
- **Content Security Policy** - XSS protection
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Parameterized queries with Prisma
- **Authentication** - JWT with refresh token rotation
- **CORS Configuration** - Proper cross-origin resource sharing

## 🤝 Contributing

We welcome contributions to Al Fatah Enterprise! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes**: `git commit -m 'Add some feature'`
4. **Push to the branch**: `git push origin feature/your-feature-name`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript and ESLint configurations
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:

- **Email**: info@alfatahenterprise.com
- **Phone**: +971-4-123-4567
- **Website**: https://alfatahenterprise.com
- **Issues**: Create a GitHub issue for bug reports or feature requests

## 🎯 Roadmap

### Upcoming Features
- [ ] Multi-language support (Arabic/English)
- [ ] Real-time chat support
- [ ] Advanced project filtering and search
- [ ] Mobile application
- [ ] Integration with ERP systems
- [ ] AI-powered recommendation engine

### Recent Updates
- [x] Performance optimization and code splitting
- [x] Comprehensive error handling and monitoring
- [x] SEO optimization and meta tag implementation
- [x] Production build pipeline and deployment scripts
- [x] Health monitoring and system status dashboard

## 🏆 Acknowledgments

- **Design Inspiration**: Modern industrial websites and UAE business standards
- **Icons**: Lucide React icon library
- **Images**: Unsplash and Pexels for professional photography
- **Fonts**: Google Fonts for typography
- **Community**: React, TypeScript, and Node.js communities

---

**Built with ❤️ by Al Fatah Enterprise Development Team**

*Empowering Industrial Excellence in the UAE*
