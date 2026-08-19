import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server as HttpServer } from 'http';
import { env } from './env.config';
import jwt from 'jsonwebtoken';

let io: SocketIOServer;

export const initSocket = async (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

  const pubClient = createClient({ url: env.REDIS_URL });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.data.user.userId}`);
    
    // Join a room for the user's organization to receive broadcast events
    if (socket.data.user.orgId) {
      socket.join(`org_${socket.data.user.orgId}`);
      console.log(`[Socket] Joined room: org_${socket.data.user.orgId}`);
    }

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.data.user.userId}`);
    });
  });

  console.log('[Socket] Initialized with Redis Adapter');
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
