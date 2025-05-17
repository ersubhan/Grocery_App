import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// register user : /api/user/register
export const register = async (req,res)=> {
    try {
        const { name,email,password } = req.body;

    // checking users 
        if (!name || !email || !password) {
            return res.json({success: false, message: "Missing Details..."})
        }

    // check existing user 
    const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.json({success: false, message: "User Already Exists..."})
        }

    // hashing password 
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user 
    const user = await User.create({name, email, password: hashedPassword})

    // create token 
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.cookie('token', token, {
            httpOnly: true, // prevent javascript to access cookies
            secure: process.env.NODE_ENV === 'production', // use secure cookie in productions
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 1 * 24 * 60 * 60 * 1000, // cookie expiration time
        })
        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        ({success: false, message: error.message})
    }
}

// login user : /api/user/login
export const login = async (req,res)=> {
    try {
        const { email,password } = req.body;

        // checking user in database 
        if (!email || !password) {
            return res.json({success: false, message: "Email & Password are Required..."});
        }

        const user = await User.findOne({email});
            if (!user) {
                return res.json({success: false, message: "Invalid Email or Password"});
            }

        // matching password 
        const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({success: false, message: "Invalid Email or Password"});
            }

        // generating token 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        //generate cookie
        res.cookie('token', token, {
            httpOnly: true, // prevent javascript to access cookies
            secure: process.env.NODE_ENV === 'production', // use secure cookie in productions
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 1 * 24 * 60 * 60 * 1000, // cookie expiration time
        })
        return res.json({success: true, user: {email: user.email, name: user.name, token}})
    } catch (error) {
        console.log(error.message);
        ({success: false, message: error.message})
    }
}

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// logout user : /api/user/logout
export const logOut = async (req,res)=> {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        console.log(error.message);
        ({success: false, message: error.message})
    }
}