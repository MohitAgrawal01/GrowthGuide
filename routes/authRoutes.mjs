import express from 'express';
import users from '../models/userModel.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config()

const routes = express.Router();



routes.put("/createUser", async (req, res) => {

    try {
        const reqBody = req.body;
        if (!(reqBody.name || reqBody.email || req.ip || reqBody.password))
            return res.status(400).json({ success: false, error: "All fields are required and to be filled properly" });


        const userData = await users.findOne({ email: reqBody.email })
        if (userData)
            return res.status(400).json({ success: false, error: "Email Already Exists" });
        const saltRounds = 10;

        bcrypt.hash(reqBody.password, saltRounds, async (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Signup failed' });
            } else {
                await users.create({ name: reqBody.name, email: reqBody.email, password: hashedPassword, signupIp: req.ip })

                return res.status(201).json({ success: true, error: null, message: "User created!!" })
            }
        });

    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message })
    }

})




routes.post('/loginUser', async (req, res) => {
    try {
        const reqBody = req.body;
        if (!(reqBody.email || reqBody.password))
            return res.status(400).json({ success: false, error: "All fields are required and to be filled properly" });

        const userData = await users.findOne({ email: reqBody.email })
        if (!userData)
            return res.status(400).json({ success: false, error: "Invalid User Details" });

        bcrypt.compare(reqBody.password, userData.password, async (err, passwordMatch) => {
            if (err || !passwordMatch) {
                return res.status(400).json({ success: false, error: "Invalid User Details" });
            } else {

                const payload = {
                    uid: userData._id,
                    username: userData.name,
                    email: userData.email
                };

                const options = {
                    expiresIn: '24h'
                };

                // Create the JWT
                const token = jwt.sign(payload, process.env.JWT_SECRET, options);

                return res.status(200).cookie('token', token, { httpOnly: true, maxAge: 3600000 * 24 }).json({ success: true, error: null, message: "User loggedin!!" });
            }

        })

    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message })
    }
})


export default routes;
