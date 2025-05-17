import jwt from "jsonwebtoken";


// seller login

export const sellerLogin = async (req,res) => {
    try {
        const { email, password } = req.body;

    if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "1d"});

        //generate cookie
        res.cookie('sellerToken', token, {
            httpOnly: true, // prevent javascript to access cookies
            secure: process.env.NODE_ENV === 'production', // use secure cookie in productions
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 1 * 24 * 60 * 60 * 1000, // cookie expiration time
        });
        return res.json({ success: true, message: "Logged In..."})
    } else {
        return res.json({ success: false, message: "Invalid Credentials"})
    }
    } catch (error) {
        console.log(error.message);
        ({success: false, message: error.message})
    }
}


// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {  
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// logout seller : /api/seller/logout
export const sellerLogOut = async (req,res)=> {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}