import mongoose from "mongoose";
import slugify from "slugify";
import { User } from "../models/user.js";
import { Blog } from "../models/blog.js";

export const CreateB = async (req, res) => {
    try {
        let { title, excerpt, featuredImage, content, category, tags, status } = req.body;
        let userId = req.user;

        if (!title || !excerpt || !featuredImage || !content || !category || !tags) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }
        let slug = slugify(title, {
            lower: true,
            strict: true,
        });

        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            slug = `${slug}-${Date.now()}`;
        }

        await Blog.create({
            title,
            slug,
            excerpt,
            featuredImage,
            content,
            category,
            tags,
            author: userId,
            status,
            publishedAt: status === "published" ? new Date() : null
        })
        return res.status(201).json({
            message: `Blog is created Successfully`,
            success: true
        })

    } catch (error) {
        console.log(`error in creating Blog ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const GetPublishedBlogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            tag,
            search,
            sort = "latest",
        } = req.query;

        const query = {
            status: "published",
        };

        if (category) {
            query.category = category;
        }

        if (tag) {
            query.tags = tag;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        let sortOption = { publishedAt: -1 };

        if (sort === "most-liked") {
            sortOption = { likes: -1, publishedAt: -1 };
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));
        const skip = (pageNumber - 1) * limitNumber;

        const totalBlogs = await Blog.countDocuments(query);

        const blogs = await Blog.find(query)
            .populate("author", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        return res.status(200).json({
            message: "Published blogs fetched successfully",
            success: true,
            blogs,
            pagination: {
                totalBlogs,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalBlogs / limitNumber),
                limit: limitNumber,
            },
        });
    } catch (error) {
        console.log(`error in getting published blogs ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const GetBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                message: "Blog slug is required",
                success: false,
            });
        }

        const blog = await Blog.findOne({
            slug,
            status: "published",
        }).populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Published blog not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Blog fetched successfully",
            success: true,
            blog,
        });
    } catch (error) {
        console.log(`error in getting blog by slug ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const GetMyBlogs = async (req, res) => {
    try {
        const userId = req.user;

        const {
            page = 1,
            limit = 10,
            status,
            search,
        } = req.query;

        const query = {
            author: userId,
        };

        // Optional filter: ?status=draft or ?status=published
        if (status) {
            if (!["draft", "published"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid status. Use draft or published",
                    success: false,
                });
            }

            query.status = status;
        }

        // Optional search: ?search=keyword
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));
        const skip = (pageNumber - 1) * limitNumber;

        const totalBlogs = await Blog.countDocuments(query);

        const blogs = await Blog.find(query)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        return res.status(200).json({
            message: "User blogs fetched successfully",
            success: true,
            blogs,
            pagination: {
                totalBlogs,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalBlogs / limitNumber),
                limit: limitNumber,
            },
        });
    } catch (error) {
        console.log(`error in getting user blogs ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const GetBlogByIdForEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        if (!id) {
            return res.status(400).json({
                message: "Blog ID is required",
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Blog ID",
                success: false,
            });
        }

        const blog = await Blog.findOne({
            _id: id,
            author: userId,
        }).populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or you are not authorized to edit this blog",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Blog fetched for editing successfully",
            success: true,
            blog,
        });
    } catch (error) {
        console.log(`error in getting blog by id for editing ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const UpdateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        let {
            title,
            excerpt,
            featuredImage,
            content,
            category,
            tags,
            status,
        } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Blog ID is required",
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Blog ID",
                success: false,
            });
        }

        const blog = await Blog.findOne({
            _id: id,
            author: userId,
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or you are not authorized to update this blog",
                success: false,
            });
        }

        if (status && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Use draft or published",
                success: false,
            });
        }

        if (title) {
            const newSlug = slugify(title, {
                lower: true,
                strict: true,
            });

            const existingBlog = await Blog.findOne({
                slug: newSlug,
                _id: { $ne: id },
            });

            blog.title = title;
            blog.slug = existingBlog ? `${newSlug}-${Date.now()}` : newSlug;
        }

        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (featuredImage !== undefined) blog.featuredImage = featuredImage;
        if (content !== undefined) blog.content = content;
        if (category !== undefined) blog.category = category;
        if (tags !== undefined) blog.tags = tags;

        if (status !== undefined) {
            blog.status = status;

            if (status === "published" && !blog.publishedAt) {
                blog.publishedAt = new Date();
            }

            if (status === "draft") {
                blog.publishedAt = null;
            }
        }

        await blog.save();

        return res.status(200).json({
            message: "Blog updated successfully",
            success: true,
            blog,
        });
    } catch (error) {
        console.log(`error in updating blog ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const DeleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        if (!id) {
            return res.status(400).json({
                message: "Blog ID is required",
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Blog ID",
                success: false,
            });
        }

        const blog = await Blog.findOneAndDelete({
            _id: id,
            author: userId,
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or you are not authorized to delete this blog",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Blog deleted successfully",
            success: true,
        });
    } catch (error) {
        console.log(`error in deleting blog ${error}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};