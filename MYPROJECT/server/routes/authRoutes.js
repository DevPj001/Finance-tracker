const express = require('express');
const { register, login,changePassword,getUserInfo} = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/change-password',authMiddleware,changePassword);
router.get('/user-info',authMiddleware,getUserInfo);
module.exports = router;
