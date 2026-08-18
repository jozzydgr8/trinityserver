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
      phone,
      address,
      about,
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingVolunteer = await Volunteer.findOne({
      email: normalizedEmail,
    });

    if (existingVolunteer) {
      return res.status(409).json({
        message: 'This email has already been used to submit a volunteer application.',
      });
    }

    const volunteer = await Volunteer.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      address,
      about,
    });

    res.status(201).json(volunteer);
  } catch (error) {
    console.error('Error creating volunteer:', error);

    // Handles MongoDB duplicate-key error as an extra safeguard
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This email has already been used to submit a volunteer application.',
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};



module.exports = {
  getVolunteers,
  createVolunteer,
};
