const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:true,
    },
    superadmin:{
        type:Boolean,
        default:false,
    },
    createdBy:{
    type:String,
    required:true,
    lowercase:true
  },
  resetToken: String,       
  resetTokenExpires: Date 
})
UserSchema.statics.createUser = async function({ email, password,createdBy }) {
  if (!email || !password || !createdBy) throw Error('Fields required');
  if (!validator.isEmail(email)) throw Error('Invalid email');
  if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

  const exists = await this.findOne({ email });
  if (exists) throw Error('Email already exists');

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hashPassword, createdBy });
  return user;
};

UserSchema.statics.signUser = async function ({email, password}){
     if(!email || !password){
        throw Error('Fields required')
    }
     email = email.toLowerCase().trim()

    if(!validator.isEmail(email)){
        throw Error('invalid email')
    }if(!validator.isStrongPassword(password)){
        throw Error('password not strong enough')
    }
    try{
        const user = await this.findOne({email:email})
        if(!user){
            throw Error('Account does not exist')
        }
        const compare = await bcrypt.compare(password, user.password);
        if(!compare){
            throw Error('incorrect email or password');
        }
        return user;


    }catch(error){
        throw Error(error)
    }

}
module.exports=mongoose.model('user', UserSchema);