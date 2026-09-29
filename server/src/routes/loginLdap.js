const express = require('express');
const router = express.Router();
const loginLdap = require('../controllers/ldapPrueba');

router.get('/pruebaLoginLdap', loginLdap.loginLdap);


module.exports = router;