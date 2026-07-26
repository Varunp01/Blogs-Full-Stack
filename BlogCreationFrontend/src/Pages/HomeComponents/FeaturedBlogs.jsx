import React, { useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard.jsx";
import BlogCardSkeleton from "./BlogCardSkeleton.jsx";
import { useBlogs } from "../../hooks/useBlogs.js";
const FeaturedBlogs = () => {
    const { blogs: featuredBlog, loading: blogLoading, error: blogError, refetch } = useBlogs({
        limit: 3,
        sort: "most-liked",
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <>
            <section className="w-full bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
                                Popular Articles
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Featured Blogs
                            </h2>

                            <p className="mt-2 text-base text-gray-600 sm:text-lg">
                                Discover the most liked articles from our readers.
                            </p>
                        </div>

                        <Link
                            to="/blogs"
                            className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition duration-300 hover:bg-blue-700 hover:shadow-lg"
                        >
                            View All Blogs
                        </Link>
                    </div>

                    {/* Blog cards can be placed here */}
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {blogLoading && <><BlogCardSkeleton /></>}
                        {!blogLoading && blogError && <><p className="text-red-500 col-span-full">Failed to load featured blogs. Please try again later.</p> <span onClick={refetch} disabled={blogLoading}>Click to Refetch</span></>}
                        {!blogLoading && !blogError && featuredBlog.length === 0 && <p className="text-gray-600">No featured blogs found.</p>}

                        {featuredBlog.map((blog) => (
                            < BlogCard key = { blog._id || blog.id } blog = { blog } />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeaturedBlogs;