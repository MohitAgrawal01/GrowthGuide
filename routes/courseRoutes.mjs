import express from "express"
import checkLogin from "../middlewares/checkUserLogin.js"
import Course from "../models/courseModel.js"
import Enrolls from "../models/courseEnrollModel.js"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

import courseContent from "../models/courseContent.js"
const routes = express.Router()

routes.get('/courses', checkLogin, async (req, res) => {

    try {
        const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const uid = decodedToken.uid;

        const courses = await Course.find()
        const enrolledCourses = await Enrolls.find({ uid: uid }).select('courseid');



        res.status(200).json({ courses, enrolledCourses })
    }
    catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }

})

routes.post("/course/:cid/update", async (req, res) => {

    try {
        const reqBody = req.body;
        if (!(reqBody.week && reqBody.type))
            return res.status(400).json({ success: false, error: "All params should be filled properly" })


        var cid = req.params.cid;
        const content = await courseContent.findOne({ cid: cid })

        if (!content)
            return res.status(400).json({ success: false, error: "Course Not Found" })

        var oldcontent = content;

        if (!oldcontent.content.weeks[reqBody.week]) {
            oldcontent.content.weeks[reqBody.week] = { videos: [], videosDesc: [], assignments: [], content: [], contentDescription: "" }

        }
        if (reqBody.type == "video" && reqBody.videoDesc != null && reqBody.videoURL != null) {

            oldcontent.content.weeks[reqBody.week].videos.push(reqBody.videoURL);
            oldcontent.content.weeks[reqBody.week].videosDesc.push(reqBody.videoDesc);
            console.log(oldcontent)

            await oldcontent.save()
            return res.status(200).json({ success: true, error: null, message: `Video ${reqBody.videoURL} has been successfully added in WEEK ${reqBody.week} ` })
        }

        else if (reqBody.type == "assignment" && reqBody.pdfURL != null && reqBody.content != null) {

            oldcontent.content.weeks[reqBody.week].assignments.push(reqBody.pdfURL);
            oldcontent.content.weeks[reqBody.week].content.push(reqBody.content);
            await oldcontent.save()
            return res.status(200).json({ success: true, error: null, message: `Assignment ${reqBody.pdfURL} has been successfully added in WEEK ${reqBody.week} ` })
        }




        return res.status(400).json({ success: false, error: "No action Found" })
    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message })
    }
})


routes.get("/course/:cid/view", checkLogin, async (req, res) => {
    try {
        const content = await courseContent.findOne({ cid: req.params.cid })
        return res.status(200).json(content)
    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message })
    }
})

export default routes;