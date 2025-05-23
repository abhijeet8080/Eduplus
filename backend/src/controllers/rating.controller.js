const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();


exports.createRating = async (req, res) => {
  try {
    console.log("Creating rating...");
    userId = req.user.id;
    let { value, storeId } = req.body;

    if (value === undefined || userId === undefined || storeId === undefined) {
      return res.status(400).json({ message: 'All fields (value, userId, storeId) are required' });
    }

    value = parseInt(value);
    userId = parseInt(userId);
    storeId = parseInt(storeId);

    if (isNaN(value) || isNaN(userId) || isNaN(storeId)) {
      return res.status(400).json({ message: 'Invalid data type for value, userId, or storeId' });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const store = await prisma.store.findUnique({ where: { id: storeId } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const rating = await prisma.rating.create({
      data: {
        value,
        userId,
        storeId,
      },
    });

    res.status(201).json({ message: 'Rating created', rating });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);

    if (isNaN(storeId)) {
      return res.status(400).json({ message: 'Invalid store ID' });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ ratings });
  } catch (error) {
    console.error('Error fetching store ratings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateRating = async (req, res) => {
  try {
    const { ratingId, value } = req.body;
    const userId = req.user.id;

    if (!ratingId || !value) {
      return res.status(400).json({ message: 'Rating ID and value are required' });
    }

    const rating = await prisma.rating.findUnique({
      where: { id: parseInt(ratingId) },
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (rating.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own ratings' });
    }

    const updatedRating = await prisma.rating.update({
      where: { id: parseInt(ratingId) },
      data: { value: parseInt(value) },
    });

    res.status(200).json({ message: 'Rating updated', updatedRating });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
