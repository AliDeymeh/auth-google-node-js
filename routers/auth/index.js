const express = require('express');
const authController = require('../../controllers/auth/auth');
const { saveDataUser } = require('../../controllers/auth/saveData');

const router = express.Router();

router.post('/login', authController.login);
router.post('/sign-up', authController.signup);

//!!login or sign up fot the git

const authControllerGit = require('../../controllers/auth/signInControllerGit');

router.get('/github/', authControllerGit.gitAuth);
router.get('/github/callback', authControllerGit.gitCallBack, saveDataUser);

//??login or sign up fot the google

const authControllerGoogle = require('../../controllers/auth/signInControllerGoogle');

router.get('/google/', authControllerGoogle.googleAuth);
router.get(
  '/google/callback',
  authControllerGoogle.googleCallBack,
  saveDataUser
);
module.exports = router;
