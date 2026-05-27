import express from 'express'
import cors from 'cors'
import type { Express } from 'express'

const app: Express = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Covo server is running 🚀',
  })
})

export default app
