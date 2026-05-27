import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app: Express = express();
const httpServer = createServer(app);

const PORT = process.env.PORT ?? 8000;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, httpServer, io };
