const { signUser, addUser, getUsers } = require('../controller/userController');
const User = require('../schema/userSchema');
const router = require('express').Router();
const authenticator = require('../middleware/authenticator');
const superAuthenticator  = require('../middleware/superAuthenticator');

router.post('/createuser',authenticator, addUser);
router.get('/getUsers', authenticator, getUsers)
router.post('/signuser', signUser);
router.delete('/:id', superAuthenticator, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Prevent deleting another superadmin
    if (user.superadmin) {
      return res.status(403).json({
        error: 'Superadmin users cannot be deleted',
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json(user);

  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

module.exports=router;