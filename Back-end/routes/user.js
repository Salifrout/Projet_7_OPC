const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/access/:user_email', userCtrl.accessUserProfile);
/* router.put('/user/:user_id/update', auth, userCtrl.updateUser); //ne peux pas changer mdp et email */
router.get('/logout', userCtrl.logout);
router.get('/delete', userCtrl.deleteAccount);

module.exports = router;