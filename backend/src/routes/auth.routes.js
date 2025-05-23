const express = require('express');
const router = express.Router();
const { register, login, updatePassword,logout, getAllUsers,getUserById, getUserDetails } = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/update-password',authenticate, updatePassword);
router.post('/logout',authenticate, logout);
router.get('/users',authenticate,authorize("ADMIN"), getAllUsers);
router.get('/users/:id',authenticate,authorize("ADMIN"), getUserById);
router.get('/user-details',authenticate, getUserDetails);



module.exports = router;
