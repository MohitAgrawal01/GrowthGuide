import mongoose from "mongoose";


//coupon schema

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, trim: true },
    discount: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    totalUsers: { type: Number, required: true, default: 99999 },
    claimedUsers: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
})

const coupons = mongoose.model("coupons", couponSchema);

export default coupons;