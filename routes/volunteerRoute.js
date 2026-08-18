const express = require('express');

const router = express.Router();
const authenticator = require('../middleware/authenticator')

const {
  getVolunteers,
  createVolunteer,
} = require('../controller/volunteerController');


router.get(
  '/',
  getVolunteers
);


router.post(
  '/',authenticator,
  createVolunteer
);


module.exports = router;
