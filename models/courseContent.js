import mongoose from "mongoose";

const { Schema } = mongoose;

const weekSchema = new Schema({
    videos: [String],
    videosDesc: [String],
    assignments: [String],
    content: [String],
    contentDescription: String
});

const courseContentSchema = new Schema({
    cid: { type: Schema.Types.ObjectId, required: true },
    content: {

        weeks: [weekSchema]


    },
    last_updated: { type: Date, default: Date.now }
});

const CourseContentModel = mongoose.model('CourseContent', courseContentSchema);

export default CourseContentModel;
