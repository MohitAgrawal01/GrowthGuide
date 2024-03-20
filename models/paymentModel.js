import mongoose from "mongoose";

//payment schema
const paymentSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, required: true },
    cid: { type: mongoose.Schema.Types.ObjectId, required: true },
    method: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: "PENDING" },
    couponCode: { type: String, trim: true },
    discount: { type: Number, default: 0 },
    completedAt: { type: Date },
    payid: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
});



const Payments = mongoose.model('Payments', paymentSchema);

export default Payments;