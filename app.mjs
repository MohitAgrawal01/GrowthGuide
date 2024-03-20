import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv"

dotenv.config();


mongoose.connect(process.env.DB_URI, {}).then(() => { console.log("connected database") }).catch((e) => console.log(e))



import addCourseRoutes from "./routes/addCourse.mjs"
import authRoutes from "./routes/authRoutes.mjs"
import courseEnrollRoutes from "./routes/courseEnrollRoutes.mjs"
import paymentRoutes from "./routes/paymentRoutes.mjs";
import courseRoutes from "./routes/courseRoutes.mjs"


const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`SERVER STARTED AT PORT ${PORT}`)
})

app.get("/", (req, res) => {

    res.send("bye")
})



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.enable('trust proxy'); // Trust the first proxy to get the client's IP address
app.use(cookieParser());
const staticPath = path.resolve() + "/static";
app.use(express.static(staticPath));


app.use(addCourseRoutes)
app.use(authRoutes)
app.use(courseEnrollRoutes)
app.use(paymentRoutes)
app.use(courseRoutes)








