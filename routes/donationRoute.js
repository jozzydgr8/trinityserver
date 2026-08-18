const {getDonations} = require('../controller/donationController');
const router = require('express').Router();
const authenticator = require('../middleware/authenticator')
router.get('/',authenticator, getDonations);
module.exports = router;