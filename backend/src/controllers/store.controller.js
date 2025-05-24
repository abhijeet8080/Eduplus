const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();


exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: 'All fields (name, email, address, ownerId) are required' });
    }

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: 'Store name must be between 2 and 60 characters' });
    }

    if (address.length > 400) {
      return res.status(400).json({ message: 'Address must be under 400 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(400).json({ message: 'Owner user does not exist' });
    }

    const [store, updatedUser] = await prisma.$transaction([
      prisma.store.create({
        data: {
          name,
          email,
          address,
          ownerId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.user.update({
        where: { id: ownerId },
        data: { role: 'OWNER' },  
      }),
    ]);

    res.status(201).json({ message: 'Store created successfully', store, updatedUser });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        ratings: {
          select: {
            value: true,
          },
        },
      },
    });

    const storesWithAvg = stores.map((store) => {
      const values = store.ratings.map((r) => r.value);
      const avgRating =
        values.length > 0
          ? values.reduce((sum, val) => sum + val, 0) / values.length
          : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgRating,
      };
    });

    res.status(200).json({ stores: storesWithAvg });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.getStoreDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const storeId = parseInt(id, 10);
    if (isNaN(storeId)) {
      return res.status(400).json({ message: 'Invalid Store ID' });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ store });
  } catch (error) {
    console.error('Error fetching store details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.getStoreDetailsFromUserId = async (req, res) => {
  try {
    const userId = req.user.id; 

    const stores = await prisma.store.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        ratings: {
          select: {
            value: true,
          },
        },
      },
    });

    if (stores.length === 0) {
      return res.status(404).json({ message: "No stores found for this user" });
    }

    const storeDetails = stores.map((store) => {
      const ratingValues = store.ratings.map((r) => r.value);
      const avgRating =
        ratingValues.length > 0
          ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        avgRating: Number(avgRating.toFixed(1)),
      };
    });

    res.status(200).json({ stores: storeDetails });
  } catch (error) {
    console.error("Error fetching store details from user ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
