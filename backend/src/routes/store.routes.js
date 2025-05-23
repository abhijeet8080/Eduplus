const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { createStore, getAllStores, getStoreDetails, getStoreDetailsFromUserId} = require('../controllers/store.controller');
const { getStoreRatings } = require('../controllers/rating.controller');
const router = express.Router();

router.post('/createStore',authenticate,authorize('ADMIN'),createStore);
router.get('/getAllStores',authenticate,getAllStores);
router.get('/:id/ratings',authenticate,getStoreRatings);
router.get('/getStoreDetails/:id',authenticate,getStoreDetails);
router.get('/getStoreDetailsFromUserId',authenticate,getStoreDetailsFromUserId);



module.exports = router;
