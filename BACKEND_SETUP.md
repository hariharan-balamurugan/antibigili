# Backend Setup Guide

This guide helps you set up the backend API for **antibigili**.

## Overview

**antibigili** frontend expects a Node.js/Express API with:

- JWT authentication
- MongoDB database
- User registration/login
- User profile endpoint

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- Postman or curl for testing

## Backend Architecture

```
Backend API
├── /auth/register    POST    Create user account
├── /auth/login       POST    Get JWT token
├── /auth/profile     GET     Get user profile (protected)
└── /auth/logout      POST    Logout user
```

## Quick Start

### 1. Create Backend Project

```bash
mkdir antibigili-backend
cd antibigili-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express cors dotenv jsonwebtoken bcryptjs mongoose
npm install --save-dev typescript @types/express @types/node ts-node nodemon
```

### 3. TypeScript Setup

```bash
npx tsc --init
```

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 4. Project Structure

```
antibigili-backend/
├── src/
│   ├── models/
│   │   └── User.ts
│   ├── routes/
│   │   └── auth.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── controllers/
│   │   └── authController.ts
│   ├── config/
│   │   └── database.ts
│   └── app.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## Implementation

### User Model

**src/models/User.ts**

```typescript
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema)
```

### Database Config

**src/config/database.ts**

```typescript
import mongoose from 'mongoose'

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}
```

### Auth Middleware

**src/middleware/auth.ts**

```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string }
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded as { id: string }
    next()
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}
```

### Auth Controller

**src/controllers/authController.ts**

```typescript
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { AuthRequest } from '../middleware/auth'

export async function register(req: AuthRequest, res: Response) {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User exists' })
    }

    const user = new User({ email, password, name })
    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    return res.status(201).json({
      success: true,
      data: {
        accessToken: token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    return res.json({
      success: true,
      data: {
        accessToken: token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user?.id)
    return res.json({
      success: true,
      data: {
        id: user?._id,
        email: user?.email,
        name: user?.name,
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}
```

### Routes

**src/routes/auth.ts**

```typescript
import express from 'express'
import { register, login, getProfile } from '../controllers/authController'
import { verifyToken } from '../middleware/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', verifyToken, getProfile)
router.post('/logout', (_req, res) => {
  res.json({ success: true, message: 'Logged out' })
})

export default router
```

### Express App

**src/app.ts**

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://antibigili.vercel.app'
  ]
}))
app.use(express.json())

// Connect DB
connectDB()

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (_, res) => {
  res.json({ success: true, message: 'API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
```

### Environment Variables

**.env**

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/antibigili
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Package Scripts

**package.json**

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## Running

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Test Endpoints

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Deployment

### Deploy to Railway

1. Push backend to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Connect GitHub repo
4. Add environment variables
5. Deploy

### Deploy to Render

1. Go to [render.com](https://render.com)
2. Create New → Web Service
3. Connect GitHub repository
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

### Deploy to AWS

Use AWS Elastic Beanstalk:

```bash
eb create antibigili-backend
eb deploy
```

## Production Checklist

- [ ] Change `JWT_SECRET` to strong value
- [ ] Enable MongoDB IP whitelist
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Setup logging/monitoring
- [ ] Enable database backups
- [ ] Test all endpoints

## Security Best Practices

1. **Hash Passwords** - Use bcryptjs (done)
2. **Validate Input** - Add input validation middleware
3. **Rate Limiting** - Use express-rate-limit
4. **CORS** - Configure properly (done)
5. **Secrets** - Use environment variables
6. **HTTPS** - Enable SSL/TLS
7. **Monitoring** - Setup error tracking

## Resources

- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT Authentication](https://jwt.io)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## Frontend Configuration

Update frontend `.env.local`:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Next Steps

1. Add input validation (express-validator)
2. Add logging (winston, pino)
3. Add rate limiting
4. Add refresh token rotation
5. Add email verification
6. Add password reset

---

**Backend setup complete! 🎉**
