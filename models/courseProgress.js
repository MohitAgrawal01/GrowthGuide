import mongoose, { mongo } from "mongoose";


// Course Progress Schema
const courseProgressSchema = new mongoose.Schema({
    sno: { type: Number, required: true },
    cid: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: {
        type: [{
            weeks: [{
                videos: [{ type: String }],
                videosDesc: [{ type: String }],
                assignments: [{ type: String }],
                content: [{ type: String }],
                contentDescription: [{ type: String }]
            }]
        }],
        default: []
    },
    last_updated: { type: Date, default: Date.now }
});


const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress;