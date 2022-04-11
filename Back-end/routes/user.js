const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/access/:user_email', /*auth,*/ userCtrl.accessUserProfile);
router.get('/logout', /*auth,*/ userCtrl.logout);
router.delete('/:user_email', /*auth,*/ userCtrl.deleteAccount);

module.exports = router;