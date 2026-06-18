import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await prisma.device.findMany();
    res.json({ success: true, devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add a new device
router.post('/', async (req, res) => {
  const { serialNo, name, username, password, status } = req.body;

  try {
    const existing = await prisma.device.findUnique({ where: { serialNo } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Device with this SN already exists' });
    }

    const device = await prisma.device.create({
      data: {
        serialNo,
        name,
        username,
        password,
        status: status || 'offline'
      }
    });

    res.json({ success: true, device });
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
