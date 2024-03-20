import mongoose from "mongoose";



// Course Schema
const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    canEnroll: { type: Boolean, default: true },
    fee: { type: Number, required: true },
    timeAdded: { type: Date, default: Date.now },
    mentor: { type: String, required: true }
});


const Course = mongoose.model('Course', courseSchema);

export default Course;