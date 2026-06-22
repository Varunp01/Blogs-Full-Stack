import React from "react";
import { Link } from "react-router-dom";
import useBlogs from "../hooks/useBlogs";
import BlogCard from "./Components/BlogCard";
import { formatDate } from "../Utils/date";

const Home = () => {
  const { blogs: latestBlogs, loading: latestLoading, error: latestError } = useBlogs({ sort: "latest", limit: 3 });
  const { blogs: mostLikedBlogs, loading: likedLoading, error: likedError } = useBlogs({ sort: "most-liked", limit: 3 });

  const categories = [...new Set([...latestBlogs, ...mostLikedBlogs].map((blog) => blog.category).filter(Boolean))];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Discover Stories, Ideas, and <span className="text-blue-600">Insights</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A modern blog platform where readers explore meaningful articles and writers share powerful ideas.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/exploreblogs" className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md">
              Explore Blogs
            </Link>
            <Link to="/create" className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Blogs</h2>
            <p className="mt-2 text-gray-600">Most liked articles from readers.</p>
          </div>
          <Link to="/exploreblogs" className="text-blue-600 font-semibold hover:underline">View all blogs</Link>
        </div>

        {likedLoading && <p className="text-gray-600">Loading featured blogs...</p>}
        {likedError && <p className="text-red-500">{likedError}</p>}
        {!likedLoading && mostLikedBlogs.length === 0 && <p className="text-gray-600">No featured blogs found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mostLikedBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <p className="mt-2 text-gray-600">Freshly published articles from the blog.</p>
          </div>

          {latestLoading && <p className="text-center text-gray-600">Loading latest posts...</p>}
          {latestError && <p className="text-center text-red-500">{latestError}</p>}
          {!latestLoading && latestBlogs.length === 0 && <p className="text-center text-gray-600">No latest blogs found.</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestBlogs.map((blog) => (
              <div key={blog._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                <p className="text-sm text-gray-500">{formatDate(blog.publishedAt)}</p>
                <h3 className="mt-3 text-lg font-bold text-gray-900">{blog.title}</h3>
                <p className="mt-2 text-gray-600 line-clamp-3">{blog.excerpt}</p>
                <Link to={`/exploreblogs/${blog.slug}`} className="inline-block mt-4 text-blue-600 font-semibold hover:underline">
                  Read Post
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
          <p className="mt-2 text-gray-600">Browse articles based on your interests.</p>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-gray-600">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/exploreblogs?category=${encodeURIComponent(category)}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-6 text-center font-semibold text-gray-700 hover:text-blue-600 hover:shadow-md transition"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Join the Community</h2>
          <p className="mt-4 text-blue-100 text-lg">Become part of a growing community of readers, writers, and creators.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth" className="px-6 py-3 rounded-full bg-white text-blue-600 font-semibold hover:bg-gray-100 transition shadow-md">
              Create Account
            </Link>
            <Link to="/exploreblogs" className="px-6 py-3 rounded-full border border-blue-200 text-white hover:bg-blue-700 transition">
              Explore Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
