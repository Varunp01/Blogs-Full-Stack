import { Blog } from "../models/blog.js";
import { Comment } from "../models/comments.js";

export const createC = async (req, res) => {
    try {
        let { blogId, content } = req.body;
        let userId = req.user;

        if (!content) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        const blog = await Blog.findOne({
            _id: blogId,
            status: "published",
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Published blog not found.",
            });
        }

        const comment = await Comment.create({
            blog: blogId,
            user: userId,
            content: content.trim(),
        });

        return res.status(201).json({
            message: `Comment added Successfully`,
            success: true
        })
    } catch (error) {
        console.log("error in commenting ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getC = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { page = 1, limit = 5 } = req.query;

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(50, Math.max(1, Number(limit) || 5));
        const skip = (pageNumber - 1) * limitNumber;

        const totalComments = await Comment.countDocuments({ blog: blogId });

        const comments = await Comment.find({ blog: blogId })
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully.",
            comments,
            pagination: {
                totalComments,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalComments / limitNumber),
                limit: limitNumber,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const deleteC = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user;

        const comment = await Comment.findOneAndDelete({
            _id: commentId,
            user: userId,
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found or you are not authorized to delete it.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}