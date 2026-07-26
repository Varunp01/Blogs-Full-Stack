import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BLOG_API_END_POINT } from "../../Constants";

// Extracted out of component scope to maximize performance
const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

const BlogCard = ({ blog = {}, manage = false, onDelete }) => {
    const { user } = useSelector((state) => state.user);
    const userLoginId = user?._id;

    // Local interaction states
    const [likes, setLikes] = useState(blog.likes?.length || 0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sync initial state configuration based on incoming array data
    useEffect(() => {
        setLikes(blog.likes?.length || 0);
        if (blog.likes && userLoginId) {
            const alreadyLiked = blog.likes.some(
                (id) => (typeof id === 'object' ? id._id : id).toString() === userLoginId.toString()
            );
            setHasLiked(alreadyLiked);
        } else {
            setHasLiked(false);
        }
    }, [blog, userLoginId]);

    const handleLikeClick = async (e) => {
        e.preventDefault();

        if (!userLoginId) {
            toast.error("Login to like this Blog");
            return;
        }

        // Optimistic UI Update
        const previousLiked = hasLiked;
        const previousLikesCount = likes;

        setHasLiked(!previousLiked);
        setLikes((prev) => (previousLiked ? prev - 1 : prev + 1));

        try {
            const { data } = await axios.patch(
                `${BLOG_API_END_POINT}/blog/togglelike/${blog._id}`,
                {},
                {
                    headers: { 'Content-Type': "application/json" },
                    withCredentials: true
                }
            );

            if (data.success) {
                toast.success(data.liked ? "Liked" : "Unliked");
            } else {
                // Revert on unexpected failure
                setHasLiked(previousLiked);
                setLikes(previousLikesCount);
            }
        } catch (error) {
            // Revert state on network error
            setHasLiked(previousLiked);
            setLikes(previousLikesCount);

            const errMsg = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errMsg);
        }
    };

    const handleDeleteClick = async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete(blog._id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="group flex h-full flex-col justify-between rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5">
            <div>
                {/* Image Wrapper */}
                <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-blue-50">
                    <img
                        src={blog.featuredImage || "https://placehold.co/600x400?text=No+Cover+Image"}
                        alt={blog.title || "Blog cover"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x400?text=Image+Unavailable";
                        }}
                    />
                    {/* Floating Category / Status Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                        {blog.category && (
                            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 backdrop-blur-xs shadow-xs">
                                {blog.category}
                            </span>
                        )}
                        {manage && blog.status && (
                            <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs shadow-xs ${
                                blog.status === 'published' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-amber-100 text-amber-800'
                            }`}>
                                {blog.status}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Block */}
                <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                    {blog.title || "Untitled Blog"}
                </h3>

                <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {blog.excerpt || blog.content || "No preview available."}
                </p>
            </div>

            {/* Footer Block */}
            <div className="mt-5 border-t border-gray-100 pt-4">
                {/* Author & Timestamps Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Written by</span>
                        <span className="font-semibold text-gray-700">
                            {blog.author?.name || "Anonymous"}
                        </span>
                    </div>

                    <div className="text-right text-[11px] leading-normal text-gray-400">
                        <p>Published: <span className="font-medium text-gray-600">{formatDate(blog.publishedAt || blog.createdAt)}</span></p>
                        {blog.updatedAt && (
                            <p className="mt-0.5">Updated: <span className="font-medium text-gray-500">{formatDate(blog.updatedAt)}</span></p>
                        )}
                    </div>
                </div>

                {/* Engagement & Navigation Actions */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Interactive Like Action Indicator */}
                    <button
                        type="button"
                        onClick={handleLikeClick}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                            hasLiked
                                ? "bg-rose-100 text-rose-700"
                                : "bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                        }`}
                    >
                        <span>{hasLiked ? "♥" : "♡"}</span>
                        <span>{likes} {likes === 1 ? "like" : "likes"}</span>
                    </button>

                    <Link
                        to={`/explore/${blog.slug || blog._id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 transition-colors duration-200 hover:text-blue-800"
                    >
                        Read more
                        <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                </div>

                {/* Optional Management Toolbar */}
                {manage && (
                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                        <Link
                            to={`/edit-blog/${blog._id}/${blog.slug}`}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition"
                        >
                            Edit
                        </Link>
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleDeleteClick}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 transition cursor-pointer"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogCard;