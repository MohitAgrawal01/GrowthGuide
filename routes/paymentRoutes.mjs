import express from "express";
import checkLogin from "../middlewares/checkUserLogin.js";
import checkPayment from "../controllers/checkPayment.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Course from "../models/courseModel.js";
import Payments from "../models/paymentModel.js";
import getTransactionById from "../controllers/checkPayment.js";

dotenv.config()
const routes = express.Router();



routes.post("/course/:cid/pay", checkLogin, async (req, res) => {

    try {
        const reqBody = req.body;
        if (!(req.params.cid || req.cookies.token || reqBody.method))
            return res.status(400).json({ success: false, error: "Something went wrong" })

        if (reqBody.method != "UPI")
            return res.status(400).json({ success: false, error: "This Payment method is not supported!!" })


        const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const uid = decodedToken.uid;
        const findCourse = await Course.findOne({ _id: req.params.cid })
        if (!findCourse)
            return res.status(400).json({ success: false, error: "Something went wrong while retriving the course" })

        const checkAlreadyPaid = await Payments.findOne({ uid: uid, cid: req.params.cid, status: "success" })
        if (checkAlreadyPaid)
            return res.status(400).json({ success: false, error: "User Already has Entry" })



        var couponCode = "";
        var discount = 0;
        if (reqBody.couponCode) {
            couponCode = reqBody.couponCode;
            const couponDetails = await coupons.findOne({ code: reqBody.couponCode })
            if (!couponDetails || couponDetails.totalUsers == couponDetails.claimedUsers || couponDetails.expiredAt < new Date.now())
                return res.status(400).json({ success: false, error: "Invalid/Expired Coupon Code" })

            if (couponDetails.minPurchase > findCourse.amount) {
                return res.status(400).json({ success: false, error: `To use this Coupon Code Min Order value must be ${findCourse.amount}` })

            }

            discount = couponDetails.discount;

        }
        const order = await Payments.create({ uid: uid, cid: req.params.cid, method: req.body.method, couponCode: couponCode, discount: discount, amount: findCourse.fee })
        //   console.log(order)

        return res.status(200).json({ success: true, error: null, message: "Proceed to Pay for this course", "QR_URL": "/images/qr.png", orderid: order._id });
    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message });
    }
})

routes.post("/process-payment", checkLogin, async (req, res) => {
    var reqBody = req.body;
    try {
        if (!(reqBody.orderid || reqBody.txnid)) {
            return res.status(400).json({ success: false, error: "Something Went Wrong" })
        }

        const orderDetails = await Payments.findOne({ _id: req.body.orderid })
        if (!orderDetails)
            return res.status(400).json({ success: false, error: "Order doesn't exist" });
        console.log(orderDetails)
        if (orderDetails.status != "PENDING")
            return res.status(400).json({ success: false, error: "This Order can't be processed anymore" });
        if (orderDetails.amount == 0) {
            await Payments.updateOne({ _id: reqBody.orderid }, { $set: { status: "SUCCESS", payid: "99999999999", completedAt: Date.now } })
            await Enrolls.updateOne({ uid: orderDetails.uid, courseid: order.cid }, { $set: { payment: true } })
            return res.status(200).json({ success: true, error: null, message: "Order Payment Successfull!!" });
        }

        const checkTxnidAlready = await Payments.findOne({ payid: reqBody.txnid })
        if (checkTxnidAlready)
            return res.status(400).json({ success: false, error: "This Bank Reference ID is already used." });

        getTransactionById(reqBody.txnid, async (error, transactions) => {
            if (error) {
                return res.status(400).json({ success: false, error: error.message });
            } else {
                if (!transactions[0]) {
                    return res.status(400).json({ success: false, error: "No payment received with this Bank reference ID, Please check and try again" });
                }
                // console.log('Transactions:', transactions);
                var payAmt = transactions[0].amount;
                var ts = transactions[0].paymentTimestamp;

                var tobepaid = orderDetails.amount - orderDetails.discount;

                if (tobepaid == payAmt) {
                    await Payments.updateOne({ _id: reqBody.orderid }, { $set: { status: "SUCCESS", payid: reqBody.txnid, completedAt: Date.now } })
                    await Enrolls.updateOne({ uid: orderDetails.uid, courseid: orderDetails.cid }, { $set: { payment: true } })
                    return res.status(200).json({ success: true, error: null, message: "Order Payment Successfull!!" });

                } else {
                    return res.status(400).json({ success: false, error: "Payament not matched against order id" });

                }

            }
        });
    }
    catch (e) {
        return res.status(400).json({ success: false, error: e.message });
    }

})


export default routes;