const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require("jsonwebtoken");
const Task = require('./task');

const userSchema = new mongoose.Schema({
    UserId: {
        type:Number
    },
    UserName: {
        type: String,
        required: true,
        trim: true
    },
    UserPassword: {
        type: String,
        required: true,
        minlength: 6,
        // maxlength: 10,
        trim:true,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "Password"');
            }
        }
    },
    UserEmail: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('The email is not valide');
            }
        }
    },
    UserBirthDay: {
        type: Date,
        required: true
    },
    UserAge: {
        type: Number,
        required: true,
        validate(value){
            if(value <0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    UserActive: {
        type: Boolean,
        default: false
    },
    UserTokens :[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    UserAvatar:{
        type: Buffer
    }
},{
    timestamps:true,
});

userSchema.virtual('LstTask',{
    ref:'Task',
    localField:'_id',
    foreignField:'TaskOwner',
})

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jsonwebtoken.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.UserTokens = user.UserTokens.concat({token});
    await user.save();
    return token
};

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.UserPassword;
    delete userObject.UserTokens;
    delete userObject.UserAvatar;
    return userObject
};

userSchema.statics.findByCredentials = async(UserEmail, UserPassword)=>{
    const user = await User.findOne({UserEmail});
    if (!user){
        throw new Error ("The user doesn't exist");
    }else{
        const isMatch = await bcryptjs.compare(UserPassword, user.UserPassword);
        if(!isMatch){
            throw new Error ("The password is incorrect");
        }else{
            return user;
        }
    }
}

//Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this;
    if (user.isModified('UserPassword')){
        user.UserPassword = await bcryptjs.hash(user.UserPassword, 10);
    };
    next();
} )
//Remove task from the user
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({TaskOwner: user._id});
    next();
} )
const User = mongoose.model('User',userSchema);

module.exports = User;