import express from 'express'
import cors from 'cors'
import type { Express } from 'express'
import prisma from './lib/prisma.js'
const app: Express = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)

app.use(express.json())

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

export default app
