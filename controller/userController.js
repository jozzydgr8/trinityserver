const User = require('../schema/userSchema');
const jwt = require('jsonwebtoken');

const genToken = (_id)=>{
    return jwt.sign({_id}, process.env.jwt_secret, {expiresIn:'2d'})
}
const addUser = async(req,res)=>{
     const email = req.body.email.toLowerCase().trim();
     const createdBy = req.user.email.toLowerCase().trim(); 
    const password = process.env.defaultpassword;
    try{
        const user = await User.createUser({email, password,createdBy});
        const token = genToken(user._id)
        res.status(200).json({email, token});

    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const signUser = async(req,res)=>{
    const {email, password}= req.body;
    try{
        const user = await User.signUser({email,password})
        const token =  genToken(user._id)
        res.status(200).json({email:user.email, token:token, id:user._id})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const getUsers = async(req,res)=>{
    try{
        const user = await User.find({}).select('-_id email admin superadmin');
    
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

module.exports = {
    addUser,
    signUser,
    getUsers
}