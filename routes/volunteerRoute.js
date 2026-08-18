const express = require('express');

const router = express.Router();
const authenticator = require('../middleware/authenticator')

const {
  getVolunteers,
  createVolunteer,
} = require('../controller/volunteerController');


router.get(
  '/',authenticator,
  getVolunteers
);


router.post(
  '/',
  createVolunteer
);


module.exports = router;
