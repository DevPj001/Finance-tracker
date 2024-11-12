const express = require('express');
const {createData,getData} = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');
const { get } = require('mongoose');
const router = express.Router();

router.post('/data',authMiddleware,createData);
router.get('/data',authMiddleware,getData);

module.exports = router;
