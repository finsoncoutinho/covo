import express from 'express'
import cors from 'cors'
import type { Express } from 'express'
import prisma from './lib/prisma.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middlewares/error.middleware.js'
const app: Express = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)

app.get('/api/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany()

    res.status(200).json(users)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch users',
    })
  }
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Covo server is running 🚀',
  })
})

app.use(errorHandler)

export default app
