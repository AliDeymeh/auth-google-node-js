const express = require('express');
const authController = require('../../controllers/auth/auth');
const { saveDataUser, uploadFileSingle } = require('../../services/saveData');

const router = express.Router();

router.post('/login', authController.login);
router.post('/sign-up', uploadFileSingle, authController.signup);

//??login or sign up fot the git

router.get('/github/', authController.gitAuth);
router.get('/github/callback', authController.gitCallBack, saveDataUser);

//??login or sign up fot the google

router.get('/google/', authController.googleAuth);
router.get('/google/callback', authController.googleCallBack, saveDataUser);

//??login or sign up fot the microsoft
router.get('/microsoft/', authController.micAuth);
router.get('/microsoft/callback', authController.micCallBack, saveDataUser);
module.exports = router;
