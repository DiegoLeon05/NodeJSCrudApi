const jsonwebtoken = require('jsonwebtoken');
const user = require('../models/user');
const User = require('../models/user');

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','') ;
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'UserTokens.token':token});
        if (!user){
            throw new Error();
        }else{
            req.user = user;
            req.token = token;
            next();
        }
    }
    catch(e){
        res.status(401).send({error:'Please authenticate'});;
    }
};

module.exports = auth;