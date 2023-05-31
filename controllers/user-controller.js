const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "myKey";



const signup = async (req,res,next)=>{
    const {name, email, password} = req.body;
    let existingUser;
    try {
     existingUser = await User.findOne({email : email})  
    }catch (e) {
        console.log(e);
    }
    if(existingUser){
        return res.status(400).json({message : "User already exists! login instead"});
    }
    const hasedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password : hasedPassword,
    });

    try{
        await user.save();
    }
    catch(err){
        console.log(err);
    }

    return res.status(201).json({message:user})
}

const login = async (req, res, next )=>{
    const {email, password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email : email});
    }
    catch(err){
        return new Error(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"user not found ! please signUp first"});
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message : "Invalid Email / Password"});
    }
    const token = jwt.sign({id : existingUser._id}, JWT_SECRET_KEY, {
        expiresIn : "30s"
    });
    res.cookie(String(existingUser._id), token , {
        path : '/',
        expires : new Date(Date.now() + 1000 * 30),
        httpOnly : true,
        sameSite : 'lax'
    })
    
    return res.status(200).json({message:"login successfully", user : existingUser , token});
} 

const verifyToken = (req, res, next) =>{
    const cookies = req.headers.cookie;
    const token = cookies.split('=')[1];
    console.log(token,"dadadad");
    if(!token){
        res.status(400).json({message:"Token not found"});
    }
    jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
        if(err){
            return res.status(400).json({message:"Invalid token"})
        }
        console.log(user.id,"adjadadd");
        req.id = user.id;
    })
    next();
} 

const getUser = async (req,res,next) => {
    const userId = req.id;
    let user;
    try{
        user = await User.findById(userId, "password");
    }catch(err){
        return new Error(err)
    }
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    return res.status(200).json({user})

}


exports.signup = signup; 
exports.login = login;
exports.verifyToken = verifyToken; 
exports.getUser = getUser;