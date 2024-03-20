import express from "express";
import checkLogin from "../middlewares/checkUserLogin.js";
import jwt from "jsonwebtoken";
import Course from "../models/courseModel.js";
import Enrolls from "../models/courseEnrollModel.js";
import dotenv from "dotenv"
dotenv.config();
const routes = express.Router();



routes.get("/enroll/:cid", checkLogin, async (req, res) => {

    try {
        const reqBody = req.body;
        if (!(req.params.cid || req.cookies.token || req.ip))
            return res.send({ success: false, error: "Something went wrong" })

        const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const uid = decodedToken.uid;
        const findCourse = await Course.findOne({ _id: req.params.cid })
        if (!findCourse)
            return res.status(400).json({ success: false, error: "Something went wrong while retriving the course" })

        const checkAlreadyEnrolled = await Enrolls.findOne({ uid: uid, courseid: req.params.cid })
        console.log(checkAlreadyEnrolled)
        if (checkAlreadyEnrolled)
            return res.status(400).json({ success: false, error: "User Already Enrolled" })

        await Enrolls.create({ uid: uid, courseid: req.params.cid, enrollIP: req.ip, paymentAmount: findCourse.fee })


        return res.status(200).json({ success: true, error: null, message: "Successfully!!enrolled to this course" });
    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message });
    }
})


export default routes;