# antibigili

> Production-ready React + MongoDB + JWT starter for Vercel

A modern, secure, and modular web application scaffold with authentication, built for scalability and deployment on Vercel.

## 🚀 Features

- **React 18** with TypeScript
- **JWT Authentication** with secure token management
- **MongoDB Integration Ready** (backend API support)
- **Vercel Optimized** - Deploy in seconds
- **Testing** with Vitest
- **Code Quality** - ESLint + Prettier
- **Responsive UI** - Modern gradient design
- **API Client** - Axios with JWT interceptors
- **Environment Management** - .env.example included

## 📋 Prerequisites

- **Node.js** 18+ (LTS)
- **npm** 9+

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hariharan-balamurugan/antibigili.git
cd antibigili
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Update `.env.local` with your API configuration:

```env
VITE_API_URL=http://localhost:5000/api
VITE_JWT_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/antibigili
```

## 💻 Development

### Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Linter

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Run Tests

```bash
npm run test
```

### Test Coverage

```bash
npm run test:coverage
```

## 🏗️ Building

### Production Build

```bash
npm run build
```

Output: `dist/`

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
antibigili/
├── src/
│   ├── components/          # React components
│   │   ├── AuthForm.tsx
│   │   ├── Dashboard.tsx
│   │   └── __tests__/
│   ├── contexts/            # React Context API
│   │   └── AuthContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.ts
│   ├── services/            # API & external services
│   │   └── api.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── .env.example
├── vercel.json
├── README.md
└── LICENSE
```

## 🔐 Authentication Flow

### Login/Register

1. User submits credentials via `AuthForm`
2. API client sends request to backend
3. Backend validates & returns JWT token + user data
4. Token stored in localStorage
5. User redirected to Dashboard
6. All subsequent API calls include JWT in Authorization header

### Token Management

- **Access Token** - Short-lived (default: 7 days)
- **Refresh Token** - Long-lived (default: 30 days)
- **Auto-refresh** - Interceptor handles token renewal
- **Logout** - Clears token from localStorage

## 🌐 API Integration

The API client (`src/services/api.ts`) handles:

- Base URL configuration
- JWT token injection
- Error handling (401 redirects to login)
- Request/response interception

### Available Endpoints

```typescript
api.login({ email, password })
api.register({ email, password, name })
api.getProfile()
api.logout()
```

## 🚢 Deployment

### Deploy to Vercel

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   ```
   VITE_API_URL = your-api-url
   VITE_JWT_SECRET = your-secret-key
   ```

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

Or use [Vercel Dashboard](https://vercel.com/dashboard) for automatic deployments.

### Environment Variables

Add to Vercel project settings:

```env
VITE_API_URL=https://your-api.example.com/api
VITE_JWT_SECRET=production-secret-key
MONGODB_URI=your-mongodb-connection-string
```

## 📦 Package Management

### Update Dependencies

```bash
npm update
```

### Audit Security

```bash
npm audit
```

### Fix Vulnerabilities

```bash
npm audit fix
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Watch Mode

```bash
npm run test -- --watch
```

### UI Dashboard

```bash
npm run test:ui
```

### Coverage Report

```bash
npm run test:coverage
```

## 🎨 Customization

### Change Colors

Edit `src/App.module.css` and `src/components/AuthForm.module.css`

### Add Components

```bash
mkdir src/components/MyComponent
touch src/components/MyComponent/index.tsx
touch src/components/MyComponent/MyComponent.module.css
```

### Add Hooks

```bash
touch src/hooks/useMyHook.ts
```

### Add API Endpoints

Update `src/services/api.ts`:

```typescript
async getUsers(): Promise<ApiResponse<User[]>> {
  const response = await this.client.get('/users')
  return response.data
}
```

## 🔧 Configuration

### Vite

See `vite.config.ts` for build configuration, aliases, and dev server settings.

### TypeScript

See `tsconfig.json` for compiler options and path aliases.

### ESLint

See `.eslintrc.cjs` for linting rules.

### Prettier

See `.prettierrc` for formatting rules.

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Reporting Issues

Found a bug? Please [create an issue](https://github.com/hariharan-balamurugan/antibigili/issues) with:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [JWT.io](https://jwt.io)

## 🚀 Next Steps

1. **Backend Setup** - Create Node.js/Express API with MongoDB
2. **Database Schema** - Design MongoDB collections (Users, Sessions, etc.)
3. **API Routes** - Implement `/auth/login`, `/auth/register`, etc.
4. **Environment** - Configure production API URL
5. **Deploy** - Push to Vercel
6. **Domain** - Add custom domain in Vercel settings

## 📞 Support

For questions or support:

- 📧 Create an issue on GitHub
- 💬 Check discussions
- 🔗 Review documentation

---

**Built with ❤️ for modern web development**
