import express from "express"
import Course from "../models/courseModel.js";
import courseContent from "../models/courseContent.js";
const routes = express.Router();


routes.put("/addCourse", async (req, res) => {
    try {
        const reqBody = req.body;
        console.log(reqBody);
        if (!(reqBody.name && reqBody.canEnroll && reqBody.fee && reqBody.timeAdded && reqBody.mentor)) {
            return res.status(400).json({ success: false, error: "All fields are required and to be filled properly" });
        }
        var courseid = 0;
        await Course.create({ name: reqBody.name, canEnroll: reqBody.canEnroll, fee: reqBody.fee, timeAdded: reqBody.timeAdded, mentor: reqBody.mentor })
            .then((r) => { courseid = r._id; })

        await courseContent.create({ cid: courseid });

        return res.status(201).json({ success: true, error: null, id: courseid, message: "Course Added Successfully!!" });
    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message });
    }
});


export default routes;