const Volunteer = require('../schema/volunteerSchema');


// GET all volunteers
const getVolunteers = async (req, res) => {
  try {
    const fetchVolunteers = await Volunteer.find({});

    res.status(200).json(fetchVolunteers);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// CREATE volunteer
const createVolunteer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      address,
      about,
    } = req.body;

    const volunteer = await Volunteer.create({
      firstName,
      lastName,
      email,
      address,
      about,
    });

    res.status(201).json(volunteer);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


module.exports = {
  getVolunteers,
  createVolunteer,
};
