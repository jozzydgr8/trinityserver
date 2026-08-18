const { signUser, addUser, getUsers } = require('../controller/userController');
const User = require('../schema/userSchema');
const router = require('express').Router();
const authenticator = require('../middleware/authenticator');
const superAuthenticator  = require('../middleware/superAuthenticator');

router.post('/createuser',authenticator, addUser);
router.get('/getUsers', authenticator, getUsers)
router.post('/signuser', signUser);
router.delete('/:id', superAuthenticator, async(req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findOneAndDelete({_id:id});
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error:error})
    }
})
module.exports=router;