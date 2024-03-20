import mongoose from "mongoose";

// Enrolls Schema
const enrollsSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseid: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolled_at: { type: Date, default: Date.now },
    enrollIP: { type: String, required: true },
    paymentAmount: { type: Number, default: 0 },
    payment: { type: Boolean, default: false }
});

const Enrolls = mongoose.model('Enrolls', enrollsSchema);

export default Enrolls;