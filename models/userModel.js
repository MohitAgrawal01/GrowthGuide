import mongoose from "mongoose";

//users schema

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    lastLoggedIn: { type: Date },
    password: { type: String, required: true },
    email: { type: String, required: true },
    signupIp: { type: String, required: true }
})

const users = mongoose.model("users", userSchema);

export default users;