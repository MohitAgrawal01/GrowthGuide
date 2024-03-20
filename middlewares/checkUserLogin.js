import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();

const checkLogin = (req, res, next) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(400).json({ success: false, error: 'JWT verification failed:' + err.message });
            // Handle verification failure (e.g., invalid signature, expired token)
        } else {
            next();
        }
    });
}

export default checkLogin;