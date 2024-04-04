const express = require('express');

const router = express.Router();
const authController = require('../controllers/signInControllerMIC');

// router.get('/success', authController.success);
// router.get('/error', authController.error);
router.get('/', authController.googleAuth);
router.get('/callback', authController.googleCallBack, authController.saveData);

module.exports = router;
