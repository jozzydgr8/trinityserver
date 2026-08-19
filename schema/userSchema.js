const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');
const sendEmail = require('../config/mailer');

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


//forgot password 
UserSchema.statics.forgotPassword = async function(email) {
  if (!email) throw Error('Email is required');

  const user = await this.findOne({ email: email.toLowerCase().trim() });
  if (!user) throw Error('User not found');

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes

  user.resetToken = resetToken;
  user.resetTokenExpires = resetTokenExpires;
  await user.save();
  
  const resetLink = `https://thetrinityarmsfoundation.com/admin_jctbdil1$/reset-password?token=${resetToken}&email=${user.email}`; // or your frontend URL
  // console.log(resetLink);
  const emailbody = {
    recipient_email: user.email,
    subject: 'Password Reset Request',
    message: `<p>You requested a password reset.</p>
           <p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`
  };
  const send = await sendEmail(emailbody)
 

  return { message: 'Password reset email sent' };
};

// Sign In
UserSchema.statics.signUser = async function({ email, password }) {
  if (!email || !password) throw Error('Fields required');
  if (!validator.isEmail(email)) throw Error('Invalid email');

  const user = await this.findOne({ email });
  if (!user) throw Error('Invalid email or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Error('Invalid email or password');

  return user;
};
// change Password
UserSchema.statics.changePassword = async function({ email, password, newPassword }) {
  if (!email || !password) throw Error('Fill all required fields');
  if (!validator.isEmail(email)) throw Error('This email is invalid');
  if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

  const user = await this.findOne({ email });
  if (!user) throw Error('User does not exist');

  const isSame = await bcrypt.compare(password, user.password);
  if (!isSame) throw Error('not authorized');

  const isNewSame = await bcrypt.compare(newPassword, user.password);
  if (isNewSame) throw Error('can not use previous password');


  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  const updatedUser = await this.findOneAndUpdate({ email }, { password: hash }, { new: true });
  return updatedUser;
};
module.exports=mongoose.model('user', UserSchema);