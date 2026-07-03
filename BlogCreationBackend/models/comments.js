import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
    },
}, { timestamps: true });
export const Comment = mongoose.model("Comment", commentSchema);