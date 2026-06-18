import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import deviceRoutes from './routes/devices';

const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);

// Database initialization
async function initDb() {
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@mahanetra.com' }
  });

  if (!adminExists) {
    console.log('Creating default admin user...');
    // In a real app, use bcrypt.hash here! For this phase 1 prototype, we're doing a simple mock match or a fast hash if we want.
    // We will just store 'admin123' directly for testing, or use a dummy hash.
    await prisma.user.create({
      data: {
        email: 'admin@mahanetra.com',
        passwordHash: 'admin123', 
        role: 'admin'
      }
    });
  }
}

app.listen(port, async () => {
  await initDb();
  console.log(`Mahanetra Backend API running at http://localhost:${port}`);
});
